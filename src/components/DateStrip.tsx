import { useRef, useEffect, useMemo } from 'react';

/* ── Helpers ── */

/** Format: "2026-04-07" */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

interface DateEntry {
  key: string;
  dayName: string;
  dayNum: number;
  monthName: string;
  isToday: boolean;
}

/* ═══════════════════════════════════════════════
   DateStrip — horizontal scrollable date picker
   ═══════════════════════════════════════════════ */

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (key: string) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  /** Build 14 days ending at today */
  const dates: DateEntry[] = useMemo(() => {
    const result: DateEntry[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = toDateKey(d);
      result.push({
        key,
        dayName: DAY_NAMES[d.getDay()],
        dayNum: d.getDate(),
        monthName: MONTH_NAMES[d.getMonth()],
        isToday: key === todayKey,
      });
    }
    return result;
  }, [todayKey]);

  /* Auto-scroll to today on mount */
  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
  }, []);

  return (
    <div id="date-strip-wrapper" className="relative mb-6">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10
        bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10
        bg-gradient-to-l from-surface to-transparent" />

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        id="date-strip"
        className="flex gap-2 overflow-x-auto py-2 px-5 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {dates.map((d) => {
          const isSelected = d.key === selectedDate;
          const isPast = d.key < todayKey;

          return (
            <button
              key={d.key}
              ref={d.isToday ? todayRef : undefined}
              id={`date-${d.key}`}
              onClick={() => onSelectDate(d.key)}
              className={`
                group relative flex flex-col items-center justify-center
                min-w-[64px] h-[80px] rounded-2xl shrink-0
                transition-all duration-200 cursor-pointer select-none
                ${isSelected
                  ? d.isToday
                    ? `bg-accent text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)]
                       ring-2 ring-accent/40`
                    : `bg-accent/12 text-accent ring-2 ring-accent/30`
                  : d.isToday
                    ? `bg-surface-elevated border-2 border-accent/30 text-text-primary
                       hover:border-accent/50 hover:shadow-[0_0_16px_rgba(99,102,241,0.1)]`
                    : isPast
                      ? `bg-surface-elevated/50 border border-border-subtle text-text-secondary
                         hover:bg-surface-hover hover:border-border`
                      : `bg-surface-elevated border border-border-subtle text-text-secondary
                         hover:bg-surface-hover hover:border-border`
                }
              `}
            >
              {/* Day name */}
              <span className={`text-[10px] font-semibold uppercase tracking-wider
                ${isSelected && d.isToday ? 'text-white/80' : isSelected ? 'text-accent/70' : 'text-text-muted'}
              `}>
                {d.isToday ? 'Today' : d.dayName}
              </span>

              {/* Day number */}
              <span className={`text-lg font-bold leading-none mt-0.5
                ${isSelected && d.isToday ? 'text-white' : isSelected ? 'text-accent' : ''}
              `}>
                {d.dayNum}
              </span>

              {/* Month */}
              <span className={`text-[9px] font-medium mt-0.5
                ${isSelected && d.isToday ? 'text-white/60' : isSelected ? 'text-accent/60' : 'text-text-muted'}
              `}>
                {d.monthName}
              </span>

              {/* Today dot indicator when not selected */}
              {d.isToday && !isSelected && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-accent
                  shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
