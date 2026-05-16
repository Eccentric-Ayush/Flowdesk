import { useState, useRef, useEffect } from 'react';

/* ─── Inline SVG icons ─── */

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" /><path d="M5 12h14" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ─── Image Helper ─── */
/** Downscales image to max 800px width/height and returns Base64. */
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const max = 800;
        
        if (width > max || height > max) {
          if (width > height) {
            height = Math.round((height * max) / width);
            width = max;
          } else {
            width = Math.round((width * max) / height);
            height = max;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75)); // Compress as JPEG
      };
      img.onerror = () => reject('Failed to open image');
      if (typeof e.target?.result === 'string') {
        img.src = e.target.result;
      }
    };
    reader.onerror = () => reject('Failed to read file');
    reader.readAsDataURL(file);
  });
}


/* ═══════════════════════════════════════════════
   QuickAdd — main input bar for creating tasks
   ═══════════════════════════════════════════════ */

interface QuickAddProps {
  onAdd: (text: string, options?: { dueDate?: string; isReminder?: boolean; recurrence?: 'daily' | 'weekly'; imageUri?: string | null; requiresProof?: boolean; }) => void;
}

export default function QuickAdd({ onAdd }: QuickAddProps) {
  const [text, setText] = useState('');
  const [isReminder, setIsReminder] = useState(false);
  const [requiresProof, setRequiresProof] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text, {
      isReminder,
      dueDate: dueDate || undefined,
      requiresProof,
      imageUri,
    });
    // Reset state
    setText('');
    setIsReminder(false);
    setRequiresProof(false);
    setDueDate('');
    setShowDatePicker(false);
    setImageUri(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await processImageFile(file);
        setImageUri(base64);
        // Reset file input so same file can be selected again if removed
        if (fileRef.current) fileRef.current.value = '';
      } catch (err) {
        console.error('Error processing image', err);
      }
    }
  };

  return (
    <div
      id="quick-add"
      className="relative rounded-2xl bg-surface-elevated border border-border-subtle
        focus-within:border-accent/30 focus-within:ring-1 focus-within:ring-accent/10
        focus-within:shadow-[0_0_24px_rgba(99,102,241,0.06)]
        transition-all duration-200
        scroll-mt-4"
      style={{ scrollMarginBottom: '120px' }}
    >
      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Image Preview Area */}
      {imageUri && (
        <div className="flex items-center gap-3 px-4 pt-3.5 animate-fade-in">
          <div className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/10
            shadow-sm shadow-black/20">
            <div className="absolute inset-0 bg-surface/20 backdrop-blur-[2px] z-0" />
            <img src={imageUri} alt="Preview" className="w-full h-full object-cover relative z-10" />
            <button
              onClick={() => setImageUri(null)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
                flex items-center justify-center opacity-0 group-hover:opacity-100
                transition-all duration-200 z-20 hover:bg-danger cursor-pointer"
              title="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Accent plus icon */}
        <span className="text-accent shrink-0 opacity-70">
          <PlusIcon />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          id="quick-add-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task…"
          className="flex-1 bg-transparent text-sm text-text-primary
            placeholder:text-text-muted/60 outline-none caret-accent"
        />

        {/* Action buttons — all min 44×44 touch targets */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {/* Require Proof toggle */}
          <button
            type="button"
            onClick={() => setRequiresProof((v) => !v)}
            title="Require Visual Proof"
            className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer active:scale-90
              ${requiresProof
                ? 'text-success bg-success-muted ring-1 ring-success/20'
                : 'text-text-muted hover:text-success hover:bg-success-muted'
              }`}
          >
            <ShieldIcon />
          </button>

          {/* Camera / Image Upload */}
          <button
             type="button"
             onClick={() => fileRef.current?.click()}
             title="Attach Image"
             className="min-w-11 min-h-11 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer text-text-muted 
               hover:text-accent hover:bg-accent/10 active:scale-90"
          >
             <CameraIcon />
          </button>

          {/* Reminder toggle */}
          <button
            type="button"
            onClick={() => setIsReminder((v) => !v)}
            title="Toggle reminder"
            className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer active:scale-90
              ${isReminder
                ? 'text-warning bg-warning-muted ring-1 ring-warning/20'
                : 'text-text-muted hover:text-warning hover:bg-warning-muted'
              }`}
          >
            <BellIcon />
          </button>

          {/* Due-date toggle */}
          <button
            type="button"
            onClick={() => {
              setShowDatePicker((v) => !v);
              setTimeout(() => dateRef.current?.showPicker(), 50);
            }}
            title="Set due date"
            className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer active:scale-90
              ${dueDate
                ? 'text-accent bg-accent/10 ring-1 ring-accent/20'
                : 'text-text-muted hover:text-accent hover:bg-accent/10'
              }`}
          >
            <CalendarIcon />
          </button>

          {/* Submit button — 44px min height */}
          <button
            type="button"
            id="quick-add-submit"
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="ml-1 px-5 min-h-11 rounded-xl text-xs font-semibold
              bg-accent text-white
              hover:bg-accent-hover disabled:opacity-25 disabled:cursor-not-allowed
              transition-all duration-200 cursor-pointer
              shadow-[0_2px_12px_rgba(99,102,241,0.25)]
              hover:shadow-[0_4px_20px_rgba(99,102,241,0.35)]
              hover:ring-1 hover:ring-accent/30
              active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {/* Expandable date picker row */}
      {showDatePicker && (
        <div className="flex items-center gap-3 px-4 pb-3.5 animate-fade-in">
          <span className="text-xs text-text-muted font-medium">Due:</span>
          <input
            ref={dateRef}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-surface-hover rounded-xl border border-border-subtle text-xs text-text-primary
              px-3 py-2 outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/10
              transition-all duration-200 cursor-pointer
              [color-scheme:dark]"
          />
          {dueDate && (
            <button
              type="button"
              onClick={() => { setDueDate(''); setShowDatePicker(false); }}
              className="text-[11px] text-text-muted hover:text-danger transition-all duration-200
                cursor-pointer hover:underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
