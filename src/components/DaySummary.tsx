import type { Task } from '../types';

/* ═══════════════════════════════════════════════
   DaySummary — shows completion stats for a day
   ═══════════════════════════════════════════════ */

interface DaySummaryProps {
  activeTasks: Task[];
  completedTasks: Task[];
  dateLabel: string;
  isToday: boolean;
}

export default function DaySummary({
  activeTasks,
  completedTasks,
  dateLabel,
  isToday,
}: DaySummaryProps) {
  const total = activeTasks.length + completedTasks.length;
  const completed = completedTasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const message = (() => {
    if (total === 0) return 'No tasks recorded.';
    if (pct === 100) return isToday ? 'All done! Great work today!' : 'Perfect day — every task completed!';
    if (pct >= 75) return isToday ? 'Almost there, keep going!' : 'Strong day overall!';
    if (pct >= 50) return isToday ? 'Halfway — you\'re making progress!' : 'Decent day with room for more.';
    return isToday ? 'You\'ve started — keep the momentum!' : 'Some tasks were left pending.';
  })();

  const emoji = pct === 100 ? '🎉' : pct >= 75 ? '💪' : pct >= 50 ? '🚀' : pct > 0 ? '🌱' : '📋';

  return (
    <div
      id="day-summary"
      className="mt-6 rounded-2xl bg-surface-elevated border border-border-subtle p-5
        animate-fade-in shadow-sm shadow-black/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
          Day Summary
        </h3>
        <span className="text-[11px] text-text-muted bg-surface-active rounded-lg px-2 py-0.5 font-medium">
          {dateLabel}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-surface-active overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg, #34d399, #10b981)'
              : 'linear-gradient(90deg, #6366f1, #818cf8)',
          }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          <span className={`font-bold ${pct === 100 ? 'text-success' : 'text-accent'}`}>
            {completed}/{total}
          </span>
          {' '}tasks completed
        </p>
        <span className="text-xs text-text-muted tabular-nums">{pct}%</span>
      </div>

      {/* Encouragement */}
      <p className="mt-2.5 text-sm text-text-muted">
        <span className="mr-1">{emoji}</span>
        {message}
      </p>
    </div>
  );
}
