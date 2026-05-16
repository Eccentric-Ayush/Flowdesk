import { useState, useRef } from 'react';
import type { Task } from '../types';
import { processImageFile } from './QuickAdd';

/* ─── Inline SVG icons ─── */

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ─── Custom checkbox — 44×44 touch target ─── */

function Checkbox({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  const [justChecked, setJustChecked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    if (!checked) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 350);
    }
    onChange();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
      className={`
        group/cb relative w-11 h-11 rounded-xl shrink-0
        transition-all duration-200 flex items-center justify-center
        ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer active:scale-90'}
        ${justChecked ? 'animate-checkbox-pop' : ''}
      `}
    >
      {/* Visual checkbox inside the touch target */}
      <span className={`
        w-5 h-5 rounded-lg border-2 flex items-center justify-center
        transition-all duration-200
        ${checked
          ? 'bg-success border-success shadow-[0_0_10px_rgba(52,211,153,0.3)]'
          : `border-border ${disabled ? 'bg-surface-hover' : 'group-hover/cb:border-accent/50 group-hover/cb:shadow-[0_0_8px_rgba(99,102,241,0.15)]'}`
        }
      `}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`
            w-2.5 h-2.5 text-white
            transition-all duration-200
            ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </button>
  );
}

/* ─── Single task row ─── */

function TaskItem({
  task,
  onToggle,
  onDelete,
  onAttachImage,
  onImageClick,
  readOnly = false,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAttachImage: (id: string, imageUri: string) => void;
  onImageClick: (imageUri: string) => void;
  readOnly?: boolean;
}) {
  const [animating, setAnimating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const missingProof = task.requiresProof && !task.imageUri;
  const disableCheckbox = readOnly || missingProof;

  const handleToggle = () => {
    if (disableCheckbox) return;
    if (!task.completed) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }
    onToggle(task.id);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await processImageFile(file);
        onAttachImage(task.id, base64);
        if (fileRef.current) fileRef.current.value = '';
      } catch (err) {
        console.error('Error attaching image', err);
      }
    }
  };

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <li
      id={`task-${task.id}`}
      className={`
        group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5
        transition-all duration-200 select-none
        hover:bg-surface-hover/50 active:bg-surface-hover/70
        ${animating ? 'animate-task-complete' : ''}
      `}
    >
      <Checkbox checked={task.completed} onChange={handleToggle} disabled={disableCheckbox} />

      {/* Hidden file input for uploading proof */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Text + meta */}
      <div className="flex-1 min-w-0">
        <span
          className={`
            block text-sm leading-snug transition-all duration-300
            ${task.completed
              ? 'line-through text-text-muted opacity-60'
              : 'text-text-primary'
            }
          `}
        >
          {task.text}
        </span>

        {/* Badges row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {(dueLabel || task.recurrence) && (
            <>
              {dueLabel && (
                <span className="inline-flex items-center gap-1 text-[11px] text-text-muted
                  bg-surface-hover rounded-md px-1.5 py-0.5">
                  📅 {dueLabel}
                </span>
              )}
              {task.recurrence && (
                <span className="inline-flex items-center gap-1 text-[11px] text-accent/70 font-medium
                  bg-accent/5 rounded-md px-1.5 py-0.5">
                  🔁 {task.recurrence}
                </span>
              )}
            </>
          )}

          {/* Proof required badge / upload button */}
          {task.requiresProof && !task.imageUri && !task.completed && (
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wide
                text-warning bg-warning/10 hover:bg-warning/20 border border-warning/20 hover:border-warning/40
                rounded-md px-2 py-0.5 transition-all duration-200 cursor-pointer min-h-[28px]"
            >
              <ShieldIcon /> Proof Required
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail or Upload action — 44×44 touch target */}
      {task.imageUri ? (
        <div 
          onClick={() => onImageClick(task.imageUri!)}
          className="w-11 h-11 rounded-lg overflow-hidden border border-white/5 shadow-sm 
            cursor-pointer group-hover:ring-2 hover:ring-accent/50 transition-all duration-200
            shrink-0 relative active:scale-95"
        >
          <img src={task.imageUri} alt="Task proof" className="w-full h-full object-cover" />
          {task.requiresProof && (
             <div className="absolute top-0.5 right-0.5 text-success drop-shadow-md">
               <ShieldIcon />
             </div>
          )}
        </div>
      ) : (
         /* Provide secondary upload button — 44×44 touch target */
        !readOnly && !task.completed && (
           <button
             type="button"
             onClick={() => fileRef.current?.click()}
             aria-label="Attach image"
             className="w-11 h-11 flex items-center justify-center
               opacity-0 group-hover:opacity-100 sm:opacity-0
               rounded-xl text-text-muted hover:text-accent hover:bg-accent/10
               transition-all duration-200 cursor-pointer shrink-0
               active:scale-90"
           >
             <CameraIcon />
           </button>
        )
      )}

      {/* Reminder indicator */}
      {task.isReminder && (
        <span
          title="Reminder set"
          className="text-sm shrink-0 opacity-70 hover:opacity-100
            transition-all duration-200 hover:scale-110 w-6 text-center"
        >
          🔔
        </span>
      )}

      {/* Delete button — 44×44 touch target */}
      {!readOnly && (
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="w-11 h-11 flex items-center justify-center
          opacity-0 group-hover:opacity-100
          rounded-xl text-text-muted hover:text-danger hover:bg-danger/10
          transition-all duration-200 cursor-pointer shrink-0
          hover:shadow-[0_0_8px_rgba(248,113,113,0.1)]
          active:scale-90"
      >
        <TrashIcon />
      </button>
      )}
    </li>
  );
}

/* ─── Section header ─── */

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        {label}
      </h3>
      <span className="text-[10px] font-bold bg-surface-active text-text-secondary
        rounded-full px-2 py-0.5 tabular-nums">
        {count}
      </span>
    </div>
  );
}

/* ─── Empty state ─── */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-text-muted text-sm select-none">
      <span className="text-3xl mb-3 opacity-30">📋</span>
      <p className="text-text-muted/70">{message}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TaskList — main exported component
   ═══════════════════════════════════════════════ */

export default function TaskList({
  activeTasks,
  completedTasks,
  onToggle,
  onDelete,
  onAttachImage,
  readOnly = false,
}: {
  activeTasks: Task[];
  completedTasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAttachImage: (id: string, imageUri: string) => void;
  readOnly?: boolean;
}) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  /* Lightbox closing handler */
  const closeLightbox = () => setLightboxImage(null);

  return (
    <>
      <div
        id="task-list"
        className="rounded-2xl bg-surface-elevated border border-border-subtle
          overflow-hidden shadow-sm shadow-black/10 relative"
      >
        {/* ── Active tasks ──────────────── */}
        <SectionHeader label="Active" count={activeTasks.length} />

        {activeTasks.length === 0 ? (
          <EmptyState message="No active tasks — add one above!" />
        ) : (
          <ul className="divide-y divide-border-subtle/50">
            {activeTasks.map((t) => (
              <TaskItem 
                key={t.id} 
                task={t} 
                onToggle={onToggle} 
                onDelete={onDelete} 
                onAttachImage={onAttachImage}
                onImageClick={setLightboxImage}
                readOnly={readOnly} 
              />
            ))}
          </ul>
        )}

        {/* ── Completed tasks ───────────── */}
        {completedTasks.length > 0 && (
          <>
            <div className="border-t border-border-subtle" />
            <SectionHeader label="Completed" count={completedTasks.length} />
            <ul className="divide-y divide-border-subtle/50">
              {completedTasks.map((t) => (
                <TaskItem 
                  key={t.id} 
                  task={t} 
                  onToggle={onToggle} 
                  onDelete={onDelete} 
                  onAttachImage={onAttachImage}
                  onImageClick={setLightboxImage}
                  readOnly={readOnly} 
                />
              ))}
            </ul>
          </>
        )}
      </div>

      {/* ── Lightbox Overlay ───────────── */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in
            bg-black/60 backdrop-blur-md"
          onClick={closeLightbox}
        >
          {/* Close button — 44×44 touch target */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center rounded-full
              bg-surface-elevated/80 text-text-primary hover:bg-surface hover:text-white
              transition-all duration-200 border border-white/10 shadow-xl active:scale-90"
            onClick={closeLightbox}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          {/* Image */}
          <div 
            className="relative max-w-full max-h-full rounded-2xl overflow-hidden glassmorphism-border shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent bubbling to backdrop
          >
            <img 
              src={lightboxImage} 
              alt="Visual Proof" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
