import { List, LayoutDashboard } from 'lucide-react';

export type ViewMode = 'list' | 'kanban';

/* ═══════════════════════════════════════════════
   ViewToggle — high-end segmented control
   ═══════════════════════════════════════════════ */

export default function ViewToggle({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div
      id="view-toggle"
      className="inline-flex items-center p-1 rounded-xl
        bg-surface-elevated border border-border-subtle
        shadow-sm shadow-black/10"
    >
      <button
        id="view-toggle-list"
        onClick={() => onChange('list')}
        className={`
          relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium
          transition-all duration-250 cursor-pointer
          ${
            viewMode === 'list'
              ? 'bg-accent/12 text-accent shadow-sm shadow-accent/10 ring-1 ring-accent/15'
              : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
          }
        `}
        title="List View"
      >
        <List className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">List</span>
      </button>

      <button
        id="view-toggle-kanban"
        onClick={() => onChange('kanban')}
        className={`
          relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium
          transition-all duration-250 cursor-pointer
          ${
            viewMode === 'kanban'
              ? 'bg-accent/12 text-accent shadow-sm shadow-accent/10 ring-1 ring-accent/15'
              : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
          }
        `}
        title="Kanban Board"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Board</span>
      </button>
    </div>
  );
}
