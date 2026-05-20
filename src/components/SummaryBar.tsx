import type { MonitorTask } from '../types';

interface SummaryBarProps {
  tasks: MonitorTask[];
  lastRefresh: Date;
  loading: boolean;
}

export function SummaryBar({ tasks, lastRefresh, loading }: SummaryBarProps) {
  const inboxCount = tasks.filter(t => t.status === 'inbox' || t.status === 'review').length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const doneToday = tasks.filter(t => {
    if (t.status !== 'done' && t.status !== 'ignored') return false;
    const resolved = new Date(t.resolved_at);
    const today = new Date();
    return resolved.toDateString() === today.toDateString();
  }).length;

  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done' && t.status !== 'ignored').length;

  return (
    <header className="sticky top-0 z-10 bg-layer-floor-1 border-b border-separator px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-action-primary animate-pulse" />
          <h1 className="text-lg font-semibold tracking-tight text-content-primary">Monitor</h1>
          <span className="text-xs text-content-tertiary">Autonomous Task Pipeline</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <Stat label="Inbox" value={inboxCount} highlight={inboxCount > 0} />
            <Stat label="To-Do" value={todoCount} />
            <Stat label="Working" value={inProgressCount} />
            <Stat label="Done today" value={doneToday} positive />
            {highPriority > 0 && <Stat label="High priority" value={highPriority} danger />}
          </div>

          <div className="flex items-center gap-2 text-xs text-content-tertiary">
            {loading && <span className="animate-spin">&#8635;</span>}
            <span>Last sync: {lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, highlight, positive, danger }: {
  label: string;
  value: number;
  highlight?: boolean;
  positive?: boolean;
  danger?: boolean;
}) {
  let valueClass = 'text-content-primary font-semibold';
  if (highlight) valueClass = 'text-content-action-primary font-semibold';
  if (positive) valueClass = 'text-content-action-primary font-semibold';
  if (danger) valueClass = 'text-content-danger-primary font-semibold';

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-content-secondary">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
