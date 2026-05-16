import { useState, useMemo, useEffect } from 'react';
import { useDateTime, useTasks } from '../hooks';
import {
  QuickAdd,
  DateStrip,
  DaySummary,
  KanbanBoard,
  ListView,
  ViewToggle,
} from '../components';
import type { ViewMode } from '../components';

/* ── Date helpers ── */

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/* ── Hook to track mobile breakpoint ── */

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

export default function Dashboard() {
  const { greeting, dateString } = useDateTime();
  const {
    addTask,
    toggleTask,
    deleteTask,
    getTasksForDate,
    attachImageToTask,
    moveTaskToStatus,
    getTasksByStatus,
  } = useTasks();

  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const isMobile = useIsMobile();

  /** Kanban now has its own mobile tab system, so use viewMode directly */
  const effectiveViewMode = viewMode;

  const [showMobileQuickAdd, setShowMobileQuickAdd] = useState(false);

  const isToday = selectedDate === todayKey;
  const { active: visibleActive, completed: visibleCompleted } =
    getTasksForDate(selectedDate);

  // All visible tasks combined (for kanban)
  const allVisibleTasks = useMemo(
    () => [...visibleActive, ...visibleCompleted],
    [visibleActive, visibleCompleted],
  );
  const tasksByStatus = useMemo(
    () => getTasksByStatus(allVisibleTasks),
    [getTasksByStatus, allVisibleTasks],
  );

  // Today's stats
  const { active: todayActive, completed: todayCompleted } =
    getTasksForDate(todayKey);
  const totalCount = todayActive.length + todayCompleted.length;

  /** Stat cards — always show today's stats */
  const stats = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: totalCount,
      color: 'text-accent',
      glow: 'bg-accent/5',
    },
    {
      id: 'active',
      label: 'Active',
      value: todayActive.length,
      color: 'text-warning',
      glow: 'bg-warning/5',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: todayCompleted.length,
      color: 'text-success',
      glow: 'bg-success/5',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      value: todayActive.filter((t) => t.isReminder).length,
      color: 'text-danger',
      glow: 'bg-danger/5',
    },
  ];

  const selectedDateLabel = formatDateLabel(selectedDate);

  return (
    <div className="animate-fade-in">
      {/* ── Greeting ─────────────────── */}
      <header className="mb-6">
        <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-medium">
          {dateString}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, <span className="text-accent">User</span> 👋
        </h1>
        <p className="text-text-secondary mt-1.5 text-sm">
          Here's what's on your plate today.
        </p>
      </header>

      {/* ── Date Strip ─────────────────── */}
      <DateStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* ── Past-date banner ─────────── */}
      {!isToday && (
        <div
          id="past-date-banner"
          className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-2xl
            bg-warning-muted border border-warning/15 animate-fade-in"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-warning shrink-0 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm text-warning/80">
            Viewing{' '}
            <span className="font-semibold text-warning">
              {selectedDateLabel}
            </span>{' '}
            — read-only mode
          </span>
          <button
            onClick={() => setSelectedDate(todayKey)}
            className="ml-auto text-xs font-semibold text-accent hover:text-accent-hover
              transition-all duration-200 cursor-pointer
              hover:underline underline-offset-2"
          >
            Back to Today →
          </button>
        </div>
      )}

      {/* ── Stat Cards ───────────────── */}
      <section
        id="stats"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
      >
        {stats.map((s) => (
          <div
            key={s.id}
            id={`stat-${s.id}`}
            className="group relative rounded-2xl bg-surface-elevated border border-border-subtle
              p-5 overflow-hidden transition-all duration-200
              hover:border-border hover:shadow-lg hover:shadow-accent-glow/20"
          >
            {/* Decorative glow */}
            <div
              className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${s.glow}
              group-hover:opacity-150 transition-all duration-300`}
            />
            <p className="text-xs text-text-muted font-medium mb-1.5">
              {s.label}
            </p>
            <p className={`text-3xl font-bold tracking-tight ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* ── Quick Add (only for today) ── */}
      {isToday && !isMobile && (
        <section id="quick-add-section" className="mb-6">
          <QuickAdd onAdd={addTask} />
        </section>
      )}

      {/* ── Section Header with View Toggle ── */}
      <section id="tasks-section" className={isMobile ? 'pb-24' : ''}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {isToday ? 'My Tasks' : `Tasks — ${selectedDateLabel}`}
          </h2>

          {/* Only show toggle on desktop */}
          {!isMobile && (
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          )}
        </div>

        {/* ── View Switch ──────────── */}
        {effectiveViewMode === 'kanban' ? (
          <KanbanBoard
            tasksByStatus={tasksByStatus}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onAttachImage={attachImageToTask}
            onMoveTask={moveTaskToStatus}
            readOnly={!isToday}
          />
        ) : (
          <ListView
            activeTasks={visibleActive}
            completedTasks={visibleCompleted}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onAttachImage={attachImageToTask}
            readOnly={!isToday}
          />
        )}
      </section>

      {/* ── Day Summary ─────────────── */}
      <DaySummary
        activeTasks={visibleActive}
        completedTasks={visibleCompleted}
        dateLabel={selectedDateLabel}
        isToday={isToday}
      />

      {/* ── Mobile Bottom Navigation Bar & FAB ── */}
      {isMobile && (
        <>
          {/* If quick add is open, show backdrop + component */}
          {showMobileQuickAdd && isToday && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-surface/80 backdrop-blur-sm animate-fade-in"
                onClick={() => setShowMobileQuickAdd(false)}
              />
              <div className="fixed bottom-[84px] left-4 right-4 z-50 animate-quick-add-enter shadow-2xl">
                <QuickAdd 
                   onAdd={(...args) => {
                     addTask(...args);
                     setShowMobileQuickAdd(false);
                   }}
                />
              </div>
            </>
          )}

          <div className="mobile-bottom-bar fixed bottom-0 left-0 right-0 z-50 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] bg-surface-elevated/95 backdrop-blur-xl border-t border-border-subtle flex items-center justify-between animate-slide-up shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            
            {isToday && (
              <button
                onClick={() => setShowMobileQuickAdd(!showMobileQuickAdd)}
                title="Add Task"
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 active:scale-90
                  ${showMobileQuickAdd ? 'bg-surface-hover border border-border rotate-45 shadow-none text-text-primary' : 'bg-accent shadow-lg shadow-accent/40 hover:bg-accent-hover'}
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
