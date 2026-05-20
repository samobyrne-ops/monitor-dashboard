import type { MonitorTask, TaskSource } from '../types';

interface TaskCardProps {
  task: MonitorTask;
  onClick: () => void;
  isSelected: boolean;
}

const SOURCE_ICONS: Record<TaskSource, string> = {
  slack: '💬',
  gmail: '✉️',
  meeting: '🎙️',
  manual: '📝',
};

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-danger-secondary text-content-danger-primary',
  medium: 'bg-warning-secondary text-content-warning-primary',
  low: 'bg-neutral-secondary text-content-tertiary',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function TaskCard({ task, onClick, isSelected }: TaskCardProps) {
  const hasQuestion = task.agent_notes.includes('?') && !task.sam_response && task.status !== 'done';
  const isReview = task.status === 'review';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md p-3 border transition-all cursor-pointer ${
        isSelected
          ? 'border-action-primary bg-layer-floor-1 shadow-md'
          : 'border-separator bg-layer-floor-1 hover:border-neutral-secondary hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{SOURCE_ICONS[task.source]}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold uppercase ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <span className="text-[10px] text-content-tertiary whitespace-nowrap">
          {timeAgo(task.created_at)}
        </span>
      </div>

      <p className="text-sm text-content-primary mt-2 line-clamp-2 leading-snug">
        {task.summary}
      </p>

      {isReview && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-content-action-primary font-semibold">
          <span>&#9998;</span> Draft ready for review
        </div>
      )}

      {hasQuestion && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-[#F28B30] font-semibold">
          <span>?</span> Agent needs your input
        </div>
      )}

      {task.sam_response && task.status !== 'done' && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-content-action-primary font-semibold">
          <span>&#10003;</span> Response submitted
        </div>
      )}
    </button>
  );
}
