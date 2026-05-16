import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskStatus, Recurrence } from '../types';

const STORAGE_KEY = 'flowdesk-tasks';
const SNAPSHOT_KEY = 'flowdesk-snapshots';

/* ── Date helper ── */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayKey(): string {
  return toDateKey(new Date());
}

/* ── LocalStorage helpers ── */

/** Read tasks from localStorage */
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

/** Write tasks to localStorage */
function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** Daily snapshots: { "2026-04-06": Task[], ... } */
type Snapshots = Record<string, Task[]>;

function loadSnapshots(): Snapshots {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Snapshots;
  } catch {
    return {};
  }
}

function saveSnapshots(snapshots: Snapshots): void {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshots));
}

/** Generate a short unique id */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ═══════════════════════════════════════════════
   useTasks hook
   ═══════════════════════════════════════════════ */

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [snapshots, setSnapshots] = useState<Snapshots>(loadSnapshots);

  // Persist whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Persist snapshots
  useEffect(() => {
    saveSnapshots(snapshots);
  }, [snapshots]);

  // Take a snapshot of today's tasks at end of day / on each change
  useEffect(() => {
    const key = todayKey();
    setSnapshots((prev) => ({
      ...prev,
      [key]: tasks,
    }));
  }, [tasks]);

  /** Add a new task */
  const addTask = useCallback(
    (text: string, options?: { dueDate?: string; isReminder?: boolean; recurrence?: Recurrence; imageUri?: string | null; requiresProof?: boolean }) => {
      const newTask: Task = {
        id: uid(),
        text: text.trim(),
        completed: false,
        status: 'todo',
        createdAt: new Date().toISOString(),
        dueDate: options?.dueDate,
        isReminder: options?.isReminder ?? false,
        recurrence: options?.recurrence,
        imageUri: options?.imageUri,
        requiresProof: options?.requiresProof,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [],
  );

  /** Toggle completed status */
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? 'done' : 'todo',
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t,
      ),
    );
  }, []);

  /** Move a task to a specific status column (used by Kanban drag & drop) */
  const moveTaskToStatus = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: newStatus,
              completed: newStatus === 'done',
              completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
            }
          : t,
      ),
    );
  }, []);

  /** Attach visual proof image to an existing task */
  const attachImageToTask = useCallback((id: string, imageUri: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, imageUri } : t
      )
    );
  }, []);

  /** Delete a task */
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** Helper: derive status for legacy tasks that don't have one */
  const deriveStatus = (t: Task): TaskStatus => {
    if (t.status) return t.status;
    return t.completed ? 'done' : 'todo';
  };

  /** Get tasks for a specific date (snapshot for past, live for today) */
  const getTasksForDate = useCallback(
    (dateKey: string): { active: Task[]; completed: Task[] } => {
      const today = todayKey();

      if (dateKey === today) {
        // Live tasks
        return {
          active: tasks.filter((t) => !t.completed),
          completed: tasks.filter((t) => t.completed),
        };
      }

      // Historical snapshot
      const snapshot = snapshots[dateKey] ?? [];
      return {
        active: snapshot.filter((t) => !t.completed),
        completed: snapshot.filter((t) => t.completed),
      };
    },
    [tasks, snapshots],
  );

  /** Get tasks by Kanban status columns */
  const getTasksByStatus = useCallback(
    (source: Task[]) => {
      const todo: Task[] = [];
      const inProgress: Task[] = [];
      const done: Task[] = [];

      source.forEach((t) => {
        const status = deriveStatus(t);
        switch (status) {
          case 'in-progress':
            inProgress.push(t);
            break;
          case 'done':
            done.push(t);
            break;
          default:
            todo.push(t);
        }
      });

      return { todo, 'in-progress': inProgress, done };
    },
    [],
  );

  /** Derived lists (today) */
  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  return {
    tasks,
    activeTasks,
    completedTasks,
    addTask,
    toggleTask,
    deleteTask,
    attachImageToTask,
    moveTaskToStatus,
    getTasksForDate,
    getTasksByStatus,
  };
}
