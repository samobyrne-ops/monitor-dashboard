import { useState } from 'react';
import type { MonitorTask, TaskStatus, TaskPriority } from '../types';
import { triggerActionNow, getCursorDeepLink } from '../api/sheets';

interface CardDetailProps {
  task: MonitorTask;
  onClose: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onPriorityChange: (id: string, priority: TaskPriority) => void;
  onResponse: (id: string, response: string) => void;
}

const SOURCE_LABELS = {
  slack: 'Slack',
  gmail: 'Gmail',
  meeting: 'Meeting',
  manual: 'Manual',
} as const;

const TYPE_LABELS = {
  reply_needed: 'Reply Needed',
  action_item: 'Action Item',
  decision_needed: 'Decision Needed',
  fyi: 'FYI',
  research: 'Research',
} as const;

export function CardDetail({ task, onClose, onStatusChange, onPriorityChange, onResponse }: CardDetailProps) {
  const [responseText, setResponseText] = useState(task.sam_response || '');
  const [actionNowLoading, setActionNowLoading] = useState(false);

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      onResponse(task.id, responseText.trim());
    }
  };

  const handleActionNow = async () => {
    setActionNowLoading(true);
    await triggerActionNow(task.id);
    setActionNowLoading(false);
  };

  const hasQuestion = task.agent_notes.includes('?') && !task.sam_response;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20" onClick={onClose} />

      <div className="w-[480px] bg-layer-floor-1 border-l border-separator overflow-y-auto shadow-lg">
        <div className="sticky top-0 bg-layer-floor-1 border-b border-separator px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-sm bg-neutral-secondary text-content-secondary font-semibold">
              {SOURCE_LABELS[task.source]}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-neutral-secondary text-content-secondary">
              {TYPE_LABELS[task.type]}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-content-tertiary hover:text-content-primary text-lg leading-none"
          >
            &times;
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-content-primary">
              {task.summary}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-content-tertiary">
              <span>Created {new Date(task.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              {task.source_link && (
                <a href={task.source_link} target="_blank" rel="noreferrer" className="text-content-action-primary hover:underline">
                  View original &rarr;
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-content-secondary uppercase tracking-wide mb-2">Agent Notes</h3>
            <div className="text-sm text-content-primary leading-relaxed bg-layer-floor-0-grouped rounded-md p-3">
              {task.agent_notes}
            </div>
          </div>

          {task.draft_link && (
            <a
              href={task.draft_link}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center py-2 px-4 rounded-md bg-action-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              View Draft
            </a>
          )}

          {hasQuestion && task.status !== 'done' && (
            <div>
              <h3 className="text-xs font-semibold text-content-secondary uppercase tracking-wide mb-2">Your Response</h3>
              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                placeholder="Type your response or instructions for the agent..."
                className="w-full rounded-md border border-separator bg-layer-floor-0-grouped p-3 text-sm text-content-primary placeholder:text-content-tertiary resize-none focus:outline-none focus:border-action-primary"
                rows={3}
              />
              <button
                onClick={handleSubmitResponse}
                disabled={!responseText.trim()}
                className="mt-2 w-full py-2 rounded-md bg-action-primary text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                Submit Response
              </button>
            </div>
          )}

          {task.sam_response && (
            <div>
              <h3 className="text-xs font-semibold text-content-secondary uppercase tracking-wide mb-2">Your Response</h3>
              <div className="text-sm text-content-primary leading-relaxed bg-positive-secondary rounded-md p-3">
                {task.sam_response}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-content-secondary uppercase tracking-wide block mb-1.5">Priority</label>
              <select
                value={task.priority}
                onChange={e => onPriorityChange(task.id, e.target.value as TaskPriority)}
                className="w-full rounded-md border border-separator bg-layer-floor-0-grouped p-2 text-sm text-content-primary"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-content-secondary uppercase tracking-wide block mb-1.5">Status</label>
              <select
                value={task.status}
                onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}
                className="w-full rounded-md border border-separator bg-layer-floor-0-grouped p-2 text-sm text-content-primary"
              >
                <option value="inbox">Inbox</option>
                <option value="todo">To-Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
                <option value="ignored">Ignored</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-separator">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onStatusChange(task.id, 'done')}
                className="py-2 rounded-md bg-action-primary text-white text-xs font-semibold hover:opacity-90"
              >
                Mark Done
              </button>
              <button
                onClick={() => onStatusChange(task.id, 'ignored')}
                className="py-2 rounded-md bg-neutral-secondary text-content-secondary text-xs font-semibold hover:bg-[#e0e2e6]"
              >
                Ignore
              </button>
              <button
                onClick={handleActionNow}
                disabled={actionNowLoading}
                className="py-2 rounded-md bg-[#3E7CE0] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40"
              >
                {actionNowLoading ? '...' : 'Action Now'}
              </button>
            </div>

            {task.task_file && (
              <a
                href={getCursorDeepLink(task.task_file)}
                className="block w-full text-center py-2 rounded-md border border-separator text-sm text-content-primary font-semibold hover:bg-neutral-secondary transition-colors"
              >
                Open in Cursor &rarr;
              </a>
            )}
          </div>

          <div className="pt-3 border-t border-separator text-xs text-content-tertiary space-y-1">
            <div>ID: <code className="text-[10px]">{task.id}</code></div>
            {task.task_file && <div>Task file: <code className="text-[10px]">{task.task_file}</code></div>}
            <div>Updated: {new Date(task.updated_at).toLocaleString('en-GB')}</div>
            {task.resolved_at && <div>Resolved: {new Date(task.resolved_at).toLocaleString('en-GB')}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
