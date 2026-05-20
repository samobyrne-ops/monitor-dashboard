export const CONFIG = {
  // n8n webhook endpoints (via Bolt internal n8n instance)
  // These bypass the unstable Google Workspace MCP entirely
  N8N_READ_URL: 'https://n8n.automation.boltint.net/webhook/monitor-read',
  N8N_WRITE_URL: 'https://n8n.automation.boltint.net/webhook/monitor-write',

  // Cursor Automation webhook (for "Action Now" button)
  // Set this after creating the automation at cursor.com/automations
  CURSOR_AUTOMATION_WEBHOOK: '',

  // Polling interval in ms (30 seconds)
  POLL_INTERVAL: 30_000,

  // Workspace path (for Cursor deep links)
  WORKSPACE_PATH: '/Users/sam.obyrne/Downloads/databricks-setup',
} as const;
