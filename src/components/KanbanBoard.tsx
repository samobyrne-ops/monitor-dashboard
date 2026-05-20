import type { MonitorTask, KanbanColumn } from '../types';
import { COLUMN_CONFIG } from '../types';
import { KanbanColumnComponent } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: MonitorTask[];
  onSelectTask: (task: MonitorTask) => void;
  selectedTaskId?: string;
}

export function KanbanBoard({ tasks, onSelectTask, selectedTaskId }: KanbanBoardProps) {
  const columns: KanbanColumn[] = ['inbox', 'todo', 'in_progress', 'done'];

  const getColumnTasks = (column: KanbanColumn): MonitorTask[] => {
    const config = COLUMN_CONFIG[column];
    return tasks
      .filter(t => config.statuses.includes(t.status))
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  };

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {columns.map(col => (
        <KanbanColumnComponent
          key={col}
          column={col}
          label={COLUMN_CONFIG[col].label}
          tasks={getColumnTasks(col)}
          onSelectTask={onSelectTask}
          selectedTaskId={selectedTaskId}
        />
      ))}
    </div>
  );
}
