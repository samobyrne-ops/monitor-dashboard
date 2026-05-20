export type TaskSource = 'slack' | 'gmail' | 'meeting' | 'manual';

export type TaskType =
  | 'reply_needed'
  | 'action_item'
  | 'decision_needed'
  | 'fyi'
  | 'research';

export type TaskStatus =
  | 'inbox'
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done'
  | 'ignored';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface MonitorTask {
  id: string;
  source: TaskSource;
  source_link: string;
  type: TaskType;
  summary: string;
  status: TaskStatus;
  priority: TaskPriority;
  agent_notes: string;
  draft_link: string;
  created_at: string;
  sam_response: string;
  task_file: string;
  updated_at: string;
  resolved_at: string;
}

export type KanbanColumn = 'inbox' | 'todo' | 'in_progress' | 'done';

export const COLUMN_CONFIG: Record<KanbanColumn, { label: string; statuses: TaskStatus[] }> = {
  inbox: { label: 'Inbox', statuses: ['inbox', 'review'] },
  todo: { label: 'To-Do', statuses: ['todo'] },
  in_progress: { label: 'In Progress', statuses: ['in_progress'] },
  done: { label: 'Done', statuses: ['done', 'ignored'] },
};
