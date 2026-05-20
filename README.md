# Monitor Dashboard

Autonomous agent task pipeline for Bolt Food Malta. Built with React 19, Kalep design system, and n8n webhooks.

## What This Is

Monitor is an autonomous agent that scans Slack, Gmail, and meeting transcripts every 60 minutes, triages items, and presents them in a Kanban dashboard. Sam reviews, responds to clarifying questions, and marks items done. The agent learns from overrides over time.

## Architecture

- **Dashboard**: React + Vite + Kalep (deployed on Boltable)
- **State Store**: Google Sheet (read/write via n8n webhooks)
- **Heartbeat**: Cursor Automation with My Machines worker
- **Data Bridge**: n8n workflows (stable Google Sheets OAuth, bypasses unstable Cursor MCP)

## Quick Start

```bash
npm install
npm run dev
```

See [SETUP.md](./SETUP.md) for full configuration.

## Design System

Uses Bolt's Kalep design system. Colors, typography, spacing, and components follow the Kalep spec.

## Key Features

- Kanban board (Inbox / To-Do / In Progress / Done)
- Card detail panel with inline response field
- "Action Now" webhook button (triggers immediate processing)
- "Open in Cursor" deep link (seamless handoff to interactive session)
- Summary bar with real-time stats
- 30-second polling with page-focus refresh
- Graceful fallback to sample data when n8n is unavailable
