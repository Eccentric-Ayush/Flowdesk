import { useState, useRef, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  Circle,
  Timer,
  CheckCircle2,
  Trash2,
  Camera,
  Shield,
  X,
} from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { processImageFile } from './QuickAdd';

/* ── Column meta ── */

interface ColumnDef {
  id: TaskStatus;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  accent: string;
  dotColor: string;
  bgColor: string;
  countBg: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'todo',
    label: 'To Do',
    shortLabel: 'To Do',
    icon: <Circle className="w-4 h-4" />,
    accent: 'text-text-secondary',
    dotColor: 'bg-text-muted',
    bgColor: 'bg-[#0f1119]/60',
    countBg: 'bg-surface-active',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    shortLabel: 'Doing',
    icon: <Timer className="w-4 h-4" />,
    accent: 'text-warning',
    dotColor: 'bg-warning',
    bgColor: 'bg-warning/[0.02]',
    countBg: 'bg-warning-muted',
  },
  {
    id: 'done',
    label: 'Completed',
    shortLabel: 'Done',
    icon: <CheckCircle2 className="w-4 h-4" />,
    accent: 'text-success',
    dotColor: 'bg-success',
    bgColor: 'bg-success/[0.02]',
    countBg: 'bg-success-muted',
  },
];

/* ── Mobile breakpoint hook ── */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

/* ── Kanban Card ── */

function KanbanCard({
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
  const fileRef = useRef<HTMLInputElement>(null);

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
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      className={`
        kanban-card group rounded-xl bg-surface-elevated border border-border-subtle
        hover:border-border hover:shadow-lg hover:shadow-black/20
        transition-all duration-200 overflow-hidden select-none
        active:scale-[0.98]
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Card Cover — Image */}
      {task.imageUri && (
        <div
          onClick={() => onImageClick(task.imageUri!)}
          className="relative w-full h-28 sm:h-32 cursor-pointer overflow-hidden"
        >
          <img
            src={task.imageUri}
            alt="Task cover"
            className="w-full h-full object-cover transition-transform duration-300
              group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated/80 to-transparent" />
          {task.requiresProof && (
            <div className="absolute top-2 right-2 p-1 rounded-md bg-success/20 text-success">
              <Shield className="w-3 h-3" />
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div className="p-3.5">
        {/* Task text */}
        <p
          className={`text-sm leading-snug mb-2 ${
            task.completed
              ? 'line-through text-text-muted'
              : 'text-text-primary'
          }`}
        >
          {task.text}
        </p>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {dueLabel && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-text-muted
              bg-surface-hover rounded-md px-1.5 py-0.5"
            >
              📅 {dueLabel}
            </span>
          )}
          {task.recurrence && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-accent/70 font-medium
              bg-accent/5 rounded-md px-1.5 py-0.5"
            >
              🔁 {task.recurrence}
            </span>
          )}
          {task.isReminder && (
            <span
              className="inline-flex items-center gap-1 text-[10px] text-warning/80
              bg-warning/5 rounded-md px-1.5 py-0.5"
            >
              🔔 Reminder
            </span>
          )}
          {task.requiresProof && !task.imageUri && !task.completed && (
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wide
                text-warning bg-warning/10 hover:bg-warning/20 border border-warning/20
                rounded-md px-1.5 py-0.5 transition-all duration-200 cursor-pointer min-h-[28px]"
            >
              <Shield className="w-2.5 h-2.5" /> Proof
            </button>
          )}
        </div>

        {/* Action row — all buttons 44×44 touch targets */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {!readOnly && !task.completed && (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-11 h-11 flex items-center justify-center rounded-lg
                  text-text-muted hover:text-accent hover:bg-accent/10
                  transition-all duration-200 cursor-pointer
                  opacity-60 sm:opacity-0 sm:group-hover:opacity-100
                  active:scale-90"
                title="Attach image"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            {!readOnly && (
              <>
                <button
                  onClick={() => onToggle(task.id)}
                  className={`w-11 h-11 flex items-center justify-center rounded-lg
                    transition-all duration-200 cursor-pointer
                    opacity-60 sm:opacity-0 sm:group-hover:opacity-100
                    active:scale-90
                    ${
                      task.completed
                        ? 'text-warning hover:text-warning hover:bg-warning/10'
                        : 'text-success hover:text-success hover:bg-success/10'
                    }`}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="w-11 h-11 flex items-center justify-center rounded-lg
                    text-text-muted hover:text-danger hover:bg-danger/10
                    transition-all duration-200 cursor-pointer
                    opacity-60 sm:opacity-0 sm:group-hover:opacity-100
                    active:scale-90"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Kanban Column (desktop only) ── */

function KanbanColumn({
  column,
  tasks,
  onToggle,
  onDelete,
  onAttachImage,
  onImageClick,
  readOnly,
}: {
  column: ColumnDef;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAttachImage: (id: string, imageUri: string) => void;
  onImageClick: (imageUri: string) => void;
  readOnly: boolean;
}) {
  return (
    <div className="flex flex-col min-w-[280px] flex-1">
      {/* Column header */}
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
        <h3 className={`text-xs font-semibold uppercase tracking-widest ${column.accent}`}>
          {column.label}
        </h3>
        <span
          className={`text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums
            ${column.countBg} text-text-secondary`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 rounded-2xl p-3 space-y-3 min-h-[200px]
              border border-transparent transition-all duration-200
              ${column.bgColor}
              ${
                snapshot.isDraggingOver
                  ? 'border-accent/20 bg-accent/[0.03] shadow-inner shadow-accent/5'
                  : ''
              }
            `}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 text-text-muted/40 text-xs select-none">
                <span className="text-2xl mb-2 opacity-40">
                  {column.id === 'todo' ? '📋' : column.id === 'in-progress' ? '⏳' : '✅'}
                </span>
                <p>No tasks</p>
              </div>
            )}

            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={readOnly}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`
                      transition-transform duration-150
                      ${snapshot.isDragging ? 'rotate-[2deg] scale-105 shadow-2xl shadow-accent/10 z-50' : ''}
                    `}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    <KanbanCard
                      task={task}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onAttachImage={onAttachImage}
                      onImageClick={onImageClick}
                      readOnly={readOnly}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

/* ── Mobile Tab Switcher ── */

function MobileTabSwitcher({
  activeTab,
  onChangeTab,
  counts,
}: {
  activeTab: TaskStatus;
  onChangeTab: (tab: TaskStatus) => void;
  counts: Record<TaskStatus, number>;
}) {
  return (
    <div className="flex items-center gap-1 p-1 mb-4 rounded-xl bg-surface-elevated border border-border-subtle">
      {COLUMNS.map((col) => (
        <button
          key={col.id}
          onClick={() => onChangeTab(col.id)}
          className={`
            flex-1 flex items-center justify-center gap-1.5
            min-h-11 rounded-lg text-xs font-semibold
            transition-all duration-200 cursor-pointer select-none
            active:scale-95
            ${
              activeTab === col.id
                ? `${col.accent} bg-surface-active shadow-sm`
                : 'text-text-muted hover:text-text-secondary'
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeTab === col.id ? col.dotColor : 'bg-transparent'}`} />
          {col.shortLabel}
          <span className={`text-[9px] font-bold rounded-full px-1.5 py-0.5
            ${activeTab === col.id ? col.countBg : 'bg-transparent'} tabular-nums`}>
            {counts[col.id]}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Mobile Kanban Card List (single column at a time) ── */

function MobileKanbanList({
  tasks,
  onToggle,
  onDelete,
  onAttachImage,
  onImageClick,
  readOnly,
  columnId,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAttachImage: (id: string, imageUri: string) => void;
  onImageClick: (imageUri: string) => void;
  readOnly: boolean;
  columnId: TaskStatus;
}) {
  return (
    <div className="space-y-3 animate-tab-fade">
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-text-muted/40 text-xs select-none">
          <span className="text-3xl mb-3 opacity-40">
            {columnId === 'todo' ? '📋' : columnId === 'in-progress' ? '⏳' : '✅'}
          </span>
          <p>No tasks here</p>
        </div>
      )}
      {tasks.map((task) => (
        <KanbanCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onAttachImage={onAttachImage}
          onImageClick={onImageClick}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KanbanBoard — main exported component
   Desktop: 3 side-by-side columns with drag & drop
   Mobile: Tabs-based, one column at a time
   ═══════════════════════════════════════════════ */

export default function KanbanBoard({
  tasksByStatus,
  onToggle,
  onDelete,
  onAttachImage,
  onMoveTask,
  readOnly = false,
}: {
  tasksByStatus: { todo: Task[]; 'in-progress': Task[]; done: Task[] };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAttachImage: (id: string, imageUri: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  readOnly?: boolean;
}) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<TaskStatus>('todo');
  const isMobile = useIsMobile();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    onMoveTask(draggableId, newStatus);
  };

  const counts: Record<TaskStatus, number> = {
    todo: tasksByStatus.todo.length,
    'in-progress': tasksByStatus['in-progress'].length,
    done: tasksByStatus.done.length,
  };

  return (
    <>
      {isMobile ? (
        /* ── Mobile: Tabs-based Kanban ── */
        <div id="kanban-board">
          <MobileTabSwitcher
            activeTab={mobileTab}
            onChangeTab={setMobileTab}
            counts={counts}
          />
          <MobileKanbanList
            tasks={tasksByStatus[mobileTab]}
            onToggle={onToggle}
            onDelete={onDelete}
            onAttachImage={onAttachImage}
            onImageClick={setLightboxImage}
            readOnly={readOnly}
            columnId={mobileTab}
          />
        </div>
      ) : (
        /* ── Desktop: 3-column drag & drop ── */
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            id="kanban-board"
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          >
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasksByStatus[col.id]}
                onToggle={onToggle}
                onDelete={onDelete}
                onAttachImage={onAttachImage}
                onImageClick={setLightboxImage}
                readOnly={readOnly}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* ── Lightbox Overlay ───────────── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in
            bg-black/60 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center rounded-full
              bg-surface-elevated/80 text-text-primary hover:bg-surface hover:text-white
              transition-all duration-200 border border-white/10 shadow-xl active:scale-90"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-full max-h-full rounded-2xl overflow-hidden glassmorphism-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
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
