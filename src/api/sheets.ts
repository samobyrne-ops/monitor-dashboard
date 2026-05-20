import { CONFIG } from '../config';
import type { MonitorTask, TaskStatus, TaskPriority } from '../types';

const SAMPLE_TASKS: MonitorTask[] = [
  {
    id: 'slack-1716249600-001',
    source: 'slack',
    source_link: 'https://bolt.slack.com/archives/C06FB8551U1/p1716249600',
    type: 'reply_needed',
    summary: 'Justinas asking for May DI budget breakdown by campaign type',
    status: 'inbox',
    priority: 'high',
    agent_notes: 'Justinas posted in #malta-food-mgmt asking for the May demand incentives split by ULC vs Smart Promo vs AM spend. I can pull this from Looker (Delivery - Business Review dashboard, campaign tab) but need your confirmation on whether to include the Hermanos winback as a separate line item or fold it into ULC.',
    draft_link: '',
    created_at: '2026-05-21T08:15:00Z',
    sam_response: '',
    task_file: 'tasks/task-slack-1716249600-001.md',
    updated_at: '2026-05-21T08:15:00Z',
    resolved_at: '',
  },
  {
    id: 'gmail-1716249700-002',
    source: 'gmail',
    source_link: 'https://mail.google.com/mail/u/0/#inbox/19abc123',
    type: 'action_item',
    summary: 'Dale requesting Malta input for Merchant Excellence Programme review',
    status: 'todo',
    priority: 'medium',
    agent_notes: 'Dale sent an email requesting all GMs submit 3 examples of merchant success stories for the MXP quarterly review. Deadline is Friday. I can draft this using the Panina exclusivity win, the Hermanos winback campaign results, and the Welbees Q1 performance data. Shall I proceed with those three?',
    draft_link: '',
    created_at: '2026-05-21T07:30:00Z',
    sam_response: '',
    task_file: 'tasks/task-gmail-1716249700-002.md',
    updated_at: '2026-05-21T07:30:00Z',
    resolved_at: '',
  },
  {
    id: 'slack-1716249800-003',
    source: 'slack',
    source_link: 'https://bolt.slack.com/archives/C083YPDQ9KL/p1716249800',
    type: 'fyi',
    summary: 'Jeremy shared Q2 breakeven tracker update in #just-delivery-leadership',
    status: 'done',
    priority: 'low',
    agent_notes: 'FYI only. Jeremy posted the weekly breakeven tracker. Malta is on track (CM% 16.1% vs 14.5% target). No action needed. Logged for context.',
    draft_link: '',
    created_at: '2026-05-21T06:45:00Z',
    sam_response: '',
    task_file: '',
    updated_at: '2026-05-21T08:00:00Z',
    resolved_at: '2026-05-21T08:00:00Z',
  },
];

let useSampleData = true;

export async function fetchTasks(): Promise<MonitorTask[]> {
  if (!CONFIG.N8N_READ_URL || useSampleData) {
    return SAMPLE_TASKS;
  }

  try {
    const res = await fetch(CONFIG.N8N_READ_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    useSampleData = false;
    return Array.isArray(data) ? data : [];
  } catch {
    console.warn('n8n read failed, using sample data');
    return SAMPLE_TASKS;
  }
}

export async function updateTask(
  id: string,
  updates: { status?: TaskStatus; priority?: TaskPriority; sam_response?: string }
): Promise<boolean> {
  if (!CONFIG.N8N_WRITE_URL || useSampleData) {
    const task = SAMPLE_TASKS.find(t => t.id === id);
    if (task) {
      if (updates.status) task.status = updates.status;
      if (updates.priority) task.priority = updates.priority;
      if (updates.sam_response) task.sam_response = updates.sam_response;
      task.updated_at = new Date().toISOString();
      if (updates.status === 'done') task.resolved_at = new Date().toISOString();
    }
    return true;
  }

  try {
    const res = await fetch(CONFIG.N8N_WRITE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', id, ...updates }),
    });
    return res.ok;
  } catch {
    console.error('n8n write failed');
    return false;
  }
}

export async function triggerActionNow(taskId: string): Promise<boolean> {
  if (!CONFIG.CURSOR_AUTOMATION_WEBHOOK) {
    console.warn('Cursor Automation webhook not configured');
    return false;
  }

  try {
    const res = await fetch(CONFIG.CURSOR_AUTOMATION_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, action: 'process_now' }),
    });
    return res.ok;
  } catch {
    console.error('Cursor Automation webhook failed');
    return false;
  }
}

export function getCursorDeepLink(taskFile: string): string {
  const prompt = `Read ${taskFile} and continue working on this task`;
  return `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(prompt)}`;
}
