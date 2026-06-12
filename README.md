# GitLab Chatbot Interface

A React based Gitlab Chatbot interface helpful to get any information from Gitlab handbook or direction pages.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Features

- **Multi-session chat** — Create and manage multiple conversation threads, persisted in localStorage
- **RAG source citations** — Responses include collapsible source panels linking back to original GitLab handbook pages and direction pages
- **Performance metadata** — View cache status, latency, and time-to-first-token (TTFT) per response
- **Conversation context** — Sends the last 10 messages as history for coherent multi-turn dialogue
- **Responsive design** — Mobile-first layout with collapsible sidebar
- **Dark theme** — Custom dark UI with an orange accent palette
- **Markdown rendering** — Full markdown support in assistant responses (headings, code blocks, tables, lists)
- **Welcome screen** — Preset question suggestions to get started quickly

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or npm/yarn)
- A running instance of the [GitLab Chat backend](https://gitlab-chatbot-backend.onrender.com) API

### Installation

```bash
git clone https://github.com/DebmalyaSen34/gitlab-chatbot-ui.git
cd gitlab-chatbot-ui
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE=http://localhost:8000
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE` | Base URL of the backend API | `http://localhost:8000` |

### Development

```bash
bun run dev
```

Starts the dev server on **http://localhost:3000** with hot module replacement. API requests to `/api` are proxied to the backend at `VITE_API_BASE`.

### Build

```bash
bun run build
```

Runs type-checking (`tsc -b`) then produces an optimized production build in `dist/`.

### Preview

```bash
bun run preview
```

Serves the production build locally for testing.

### Lint

```bash
bun run lint
```

## Backend API

This frontend expects a backend service exposing:

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat` | POST | Send a query with conversation history, returns an AI response with optional sources |
| `/api/health` | GET | Health check endpoint |

### POST `/api/chat`

**Request:**
```json
{
  "query": "What is the PTO policy?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "role": "assistant",
  "content": "GitLab's PTO policy is...",
  "sources": [
    {
      "title": "Paid Time Off",
      "url": "https://handbook.gitlab.com/handbook/paid-time-off/",
      "chunks": ["...relevant text..."]
    }
  ],
  "cache": "HIT",
  "latency": 1.23,
  "ttft": 0.45
}
```
