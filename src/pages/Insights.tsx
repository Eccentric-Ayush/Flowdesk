import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { useTasks } from '../hooks';
import type { Task } from '../types';

/* ─── Date helpers ─── */

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/* ─── Custom tooltip component ─── */

function ChartTooltip({ active, payload, label, suffix }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-border-subtle
      px-3.5 py-2.5 shadow-xl shadow-black/30">
      <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
      <p className="text-sm font-bold text-text-primary">
        {payload[0].value}{suffix || ''}
      </p>
    </div>
  );
}

/* ─── Metric card component ─── */

function MetricCard({ id, icon, label, value, subtext, accentColor }: {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  accentColor: string;
}) {
  return (
    <div
      id={`metric-${id}`}
      className="group relative rounded-2xl bg-surface-elevated border border-border-subtle
        p-5 overflow-hidden transition-all duration-200
        hover:border-border hover:shadow-lg hover:shadow-accent-glow/20"
    >
      {/* Decorative gradient orb */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10
        group-hover:opacity-20 transition-opacity duration-300 ${accentColor}`} />

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          bg-gradient-to-br ${accentColor} shadow-lg`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-text-primary leading-none">{value}</p>
          <p className="text-xs text-text-secondary mt-1.5">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Insights Page
   ═══════════════════════════════════════════════ */

export default function Insights() {
  const { tasks, getTasksForDate } = useTasks();

  /* ── Compute 14-day completion data for line chart ── */
  const completionData = useMemo(() => {
    const result: { date: string; label: string; pct: number; completed: number; total: number }[] = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toDateKey(d);
      const { active, completed } = getTasksForDate(key);
      const total = active.length + completed.length;
      const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0;
      const dayLabel = `${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getDate()}`;

      result.push({ date: key, label: dayLabel, pct, completed: completed.length, total });
    }
    return result;
  }, [getTasksForDate]);

  /* ── Compute productivity-by-day-of-week (last 30 days) ── */
  const productivityData = useMemo(() => {
    const dayBuckets: { total: number; count: number }[] = Array.from({ length: 7 }, () => ({ total: 0, count: 0 }));
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toDateKey(d);
      const { completed } = getTasksForDate(key);
      const dow = d.getDay();
      dayBuckets[dow].total += completed.length;
      dayBuckets[dow].count += 1;
    }

    // Reorder to Mon-Sun for display
    const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Mon...Sun
    return orderedDays.map((dow) => ({
      day: DAY_LABELS[dow],
      dayFull: DAY_FULL[dow],
      avg: dayBuckets[dow].count > 0
        ? parseFloat((dayBuckets[dow].total / dayBuckets[dow].count).toFixed(1))
        : 0,
      total: dayBuckets[dow].total,
    }));
  }, [getTasksForDate]);

  /* ── Key metrics ── */
  const metrics = useMemo(() => {
    // Current streak: consecutive days ending today with 100% completion
    let streak = 0;
    const today = new Date();
    for (let i = 0; i <= 60; i++) {      // look back up to 60 days
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toDateKey(d);
      const { active, completed } = getTasksForDate(key);
      const total = active.length + completed.length;
      if (total === 0) {
        // Skip empty days (no tasks = not a break)
        continue;
      }
      if (completed.length === total) {
        streak++;
      } else {
        break;
      }
    }

    // Overall completion rate (all-time from tasks array)
    const allTasksCount = tasks.length;
    const allCompleted = tasks.filter((t: Task) => t.completed).length;
    const overallRate = allTasksCount > 0 ? Math.round((allCompleted / allTasksCount) * 100) : 0;

    // Most productive day
    const bestDay = productivityData.reduce(
      (best, d) => (d.avg > best.avg ? d : best),
      productivityData[0],
    );

    return { streak, overallRate, allTasksCount, bestDay };
  }, [tasks, getTasksForDate, productivityData]);

  return (
    <div className="animate-fade-in">
      {/* ── Header ─────────────────── */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Insights <span className="text-accent">& Analytics</span>
        </h1>
        <p className="text-text-secondary mt-1.5">
          Track your productivity patterns and identify your strengths.
        </p>
      </header>

      {/* ── Key Metric Cards ─────── */}
      <section id="insight-metrics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <MetricCard
          id="streak"
          label="Current Streak"
          value={`${metrics.streak} day${metrics.streak !== 1 ? 's' : ''}`}
          subtext={metrics.streak > 0 ? '🔥 Keep it going!' : 'Complete all tasks to start a streak'}
          accentColor="from-orange-500 to-amber-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          }
        />

        <MetricCard
          id="completion-rate"
          label="Overall Completion"
          value={`${metrics.overallRate}%`}
          subtext={`${metrics.allTasksCount} total tasks tracked`}
          accentColor="from-violet-500 to-purple-600"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />

        <MetricCard
          id="best-day"
          label="Most Productive Day"
          value={metrics.bestDay?.dayFull ?? 'N/A'}
          subtext={
            metrics.bestDay?.avg > 0
              ? `Avg. ${metrics.bestDay.avg} tasks completed`
              : 'Not enough data yet'
          }
          accentColor="from-emerald-500 to-teal-500"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
        />
      </section>

      {/* ── Graph 1: Completion Consistency ── */}
      <section id="completion-chart" className="mb-10">
        <div className="rounded-2xl bg-surface-elevated border border-border-subtle p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Completion Consistency</h2>
              <p className="text-xs text-text-muted mt-0.5">Daily task completion rate — last 14 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              Completion %
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4e546b', fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4e546b', fontSize: 11 }}
                  tickFormatter={(v: number) => `${v}%`}
                  dx={-5}
                />
                <Tooltip content={<ChartTooltip suffix="%" />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="pct"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#completionGradient)"
                  dot={{ r: 3.5, fill: '#6366f1', stroke: '#13161e', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#818cf8', stroke: '#13161e', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── Graph 2: Productivity Peaks ── */}
      <section id="productivity-chart" className="mb-10">
        <div className="rounded-2xl bg-surface-elevated border border-border-subtle p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Productivity Peaks</h2>
              <p className="text-xs text-text-muted mt-0.5">
                Average tasks completed per day of week — last 30 days
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Avg. tasks
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4e546b', fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4e546b', fontSize: 11 }}
                  allowDecimals={false}
                  dx={-5}
                />
                <Tooltip
                  content={<ChartTooltip suffix=" tasks" />}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
                />
                <Bar
                  dataKey="avg"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
