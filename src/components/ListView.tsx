import TaskList from './TaskList';
import type { Task } from '../types';

/* ═══════════════════════════════════════════════
   ListView — minimalist high-density list view
   Wraps the existing TaskList with proper styling
   ═══════════════════════════════════════════════ */

export default function ListView({
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
  return (
    <div id="list-view" className="animate-fade-in">
      <TaskList
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        onToggle={onToggle}
        onDelete={onDelete}
        onAttachImage={onAttachImage}
        readOnly={readOnly}
      />
    </div>
  );
}
