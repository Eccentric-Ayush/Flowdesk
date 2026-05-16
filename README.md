<p align="center">
  <img src="public/favicon.svg" alt="FlowDesk Logo" width="72" height="72" />
</p>

<h1 align="center">FlowDesk</h1>

<p align="center">
  <strong>A modern, sleek productivity &amp; daily task management web app — built to help you stay organized, focused, and in flow.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white" alt="PWA Ready" />
</p>

---

## ✨ Features

### 📋 Task Management
- **Quick Add Bar** — Create tasks instantly with optional due dates, reminders, recurring schedules, and image attachments.
- **List View** — A clean, scrollable list of active and completed tasks with inline actions.
- **Kanban Board** — Drag-and-drop tasks across **To Do → In Progress → Done** columns (powered by `@hello-pangea/dnd`).
- **View Toggle** — Seamlessly switch between List and Kanban views.

### 📅 Date Navigation
- **Date Strip** — A horizontally scrollable date picker spanning the last 14 days.
- **Historical Snapshots** — Browse past days in read-only mode to review what you accomplished.

### 📊 Insights & Analytics
- **Completion Consistency** — 14-day area chart showing your daily task completion rate.
- **Productivity Peaks** — Bar chart displaying average tasks completed per day of the week (last 30 days).
- **Key Metrics** — Current streak, overall completion rate, and most productive day — all at a glance.

### 🎨 Design & UX
- **Dark-First Design** — A premium dark theme with carefully curated color tokens, glassmorphism, and subtle glow effects.
- **Fluid Animations** — Page transitions, micro-interactions, and spring-based animations via **Framer Motion**.
- **Responsive Layout** — Fully optimized for desktop, tablet, and mobile with adaptive navigation and touch-friendly targets (44×44px minimum).
- **Collapsible Sidebar** — Desktop sidebar with active indicator bars, badges, and smooth collapse/expand.

### 🔐 Authentication
- **Auth Gateway** — Beautiful sign-in / sign-up page with animated floating labels, parallax card tilt, and social login buttons (Google & GitHub).
- **Mode Toggle** — Animated pill switch between Sign In and Sign Up with smooth field transitions.

### 📱 Progressive Web App (PWA)
- **Installable** — Add FlowDesk to your home screen for a native-like experience.
- **Service Worker** — Cache-first strategy for static assets, network-first for HTML — works offline.
- **App Manifest** — Standalone display, custom theme color, and splash screen configuration.

### 🔔 Additional Capabilities
- **Reminders** — Flag tasks as reminders with a visual bell indicator.
- **Recurring Tasks** — Set daily or weekly recurrence on any task.
- **Visual Proof** — Attach images to tasks as proof of completion; includes a full-screen lightbox viewer.
- **Day Summary** — End-of-day progress bar with motivational messages and emoji feedback.
- **Local Persistence** — All tasks and daily snapshots are stored in `localStorage` — no server required.

---

## 🛠 Tech Stack

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| **Framework**    | [React 19](https://react.dev) with TypeScript                              |
| **Build Tool**   | [Vite 8](https://vite.dev) — lightning-fast HMR and optimized builds       |
| **Styling**      | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite` plugin   |
| **Animations**   | [Framer Motion](https://www.framer.com/motion/) — spring physics & layout  |
| **Drag & Drop**  | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)                   |
| **Charts**       | [Recharts](https://recharts.org/) — composable charting for React          |
| **Icons**        | [Lucide React](https://lucide.dev/) + inline SVGs                          |
| **Backend**      | [Supabase](https://supabase.com/) — Auth, database, edge functions (optional) |
| **Linting**      | ESLint 9 + `typescript-eslint` + React hooks/refresh plugins               |
| **Typography**   | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts          |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or use your preferred package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/Eccentric-Ayush/Flowdesk.git
cd Flowdesk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials (optional — app works without them)

# Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`**.

### Available Scripts

| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| `npm run dev`    | Start the Vite dev server with HMR          |
| `npm run build`  | Type-check with `tsc` and build for production |
| `npm run preview`| Preview the production build locally        |
| `npm run lint`   | Run ESLint across the project               |

---

## 📁 Project Structure

```
FlowDesk/
├── public/
│   ├── favicon.svg          # App icon (SVG)
│   ├── icons.svg            # Icon sprite
│   ├── manifest.json        # PWA manifest
│   └── service-worker.js    # Offline caching service worker
├── src/
│   ├── assets/              # Static assets (hero image, logos)
│   ├── components/
│   │   ├── DateStrip.tsx     # Horizontal scrollable date picker
│   │   ├── DaySummary.tsx    # Daily progress bar & motivational summary
│   │   ├── KanbanBoard.tsx   # Drag-and-drop Kanban with mobile tabs
│   │   ├── ListView.tsx      # Task list view with toggle & delete
│   │   ├── QuickAdd.tsx      # Quick task creation bar with attachments
│   │   ├── Sidebar.tsx       # Collapsible navigation sidebar
│   │   ├── TaskList.tsx      # Reusable task list renderer
│   │   ├── ViewToggle.tsx    # List ↔ Kanban view switch
│   │   └── index.ts          # Barrel exports
│   ├── hooks/
│   │   ├── useDateTime.ts    # Greeting message & formatted date
│   │   ├── useTasks.ts       # Core task CRUD, snapshots & persistence
│   │   └── index.ts          # Barrel exports
│   ├── pages/
│   │   ├── AuthPage.tsx      # Login / Sign-up with animations
│   │   ├── Dashboard.tsx     # Main dashboard with stats & tasks
│   │   ├── Insights.tsx      # Analytics charts & key metrics
│   │   └── index.ts          # Barrel exports
│   ├── types/
│   │   └── index.ts          # Shared TypeScript interfaces (Task, NavItem, etc.)
│   ├── App.tsx               # Root app with auth gate & routing
│   ├── App.css               # Global app styles & animations
│   ├── index.css             # Tailwind directives & design tokens
│   └── main.tsx              # React DOM entry point
├── .env.example              # Environment variable template
├── index.html                # HTML shell with PWA meta tags
├── vite.config.ts            # Vite + React + Tailwind plugin config
├── tsconfig.json             # TypeScript project references
├── tsconfig.app.json         # App-specific TS config
├── tsconfig.node.json        # Node/Vite TS config
├── eslint.config.js          # ESLint flat config
└── package.json              # Dependencies & scripts
```

---

## 🌐 Environment Variables

FlowDesk uses **Supabase** for optional backend features. Copy the template and fill in your credentials:

```bash
cp .env.example .env
```

| Variable                      | Required | Description                                   |
| ----------------------------- | -------- | --------------------------------------------- |
| `VITE_SUPABASE_URL`          | Optional | Your Supabase project URL                     |
| `VITE_SUPABASE_ANON_KEY`    | Optional | Supabase anonymous/public API key             |
| `VITE_APP_NAME`             | No       | App display name (defaults to "FlowDesk")     |
| `VITE_API_VERSION`          | No       | API version identifier                        |
| `SUPABASE_SERVICE_ROLE_KEY` | No       | ⚠️ Server-side only — never expose in browser |

> **Note:** The app works fully without Supabase — tasks are persisted locally in the browser's `localStorage`.

---

## 📸 Screenshots

<p align="center">
  <img src="src/assets/hero.png" alt="FlowDesk Hero" width="720" />
</p>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please make sure your code:
- Passes `npm run lint` with no errors
- Builds successfully with `npm run build`
- Follows the existing code style and component patterns

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💜 by <a href="https://github.com/Eccentric-Ayush">Ayush</a>
</p>
