/** Unique identifier for entities */
export type ID = string;

/** Priority levels for tasks */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/** Task status */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/** Recurrence options */
export type Recurrence = 'daily' | 'weekly';

/** A single task item */
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  status?: TaskStatus;     // 'todo' | 'in-progress' | 'done'
  createdAt: string;       // ISO string for JSON serialization
  dueDate?: string;        // ISO string
  completedAt?: string;    // ISO string
  isReminder: boolean;
  recurrence?: Recurrence;
  imageUri?: string | null;
  requiresProof?: boolean;
}

/** Navigation item for sidebar */
export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}
