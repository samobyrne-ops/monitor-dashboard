import type { MonitorTask, KanbanColumn } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: KanbanColumn;
  label: string;
  tasks: MonitorTask[];
  onSelectTask: (task: MonitorTask) => void;
  selectedTaskId?: string;
}

export function KanbanColumnComponent({ column, label, tasks, onSelectTask, selectedTaskId }: KanbanColumnProps) {
  const columnColors: Record<KanbanColumn, string> = {
    inbox: 'bg-action-primary',
    todo: 'bg-[#F28B30]',
    in_progress: 'bg-[#3E7CE0]',
    done: 'bg-content-tertiary',
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2 h-2 rounded-full ${columnColors[column]}`} />
        <h2 className="text-sm font-semibold text-content-primary tracking-tight">{label}</h2>
        <span className="text-xs text-content-tertiary ml-auto">{tasks.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onSelectTask(task)}
            isSelected={task.id === selectedTaskId}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-xs text-content-tertiary">
            No items
          </div>
        )}
      </div>
    </div>
  );
}
