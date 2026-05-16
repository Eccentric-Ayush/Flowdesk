import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components';
import { AuthPage, Dashboard, Insights } from './pages';
import './App.css';

/** Map nav IDs to page labels for the top bar */
const pageLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  insights: 'Insights',
  tasks: 'My Tasks',
  calendar: 'Calendar',
  settings: 'Settings',
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'insights':
        return <Insights />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        /* ── Auth Gate ─────────────────────────── */
        <motion.div
          key="auth"
          style={{ width: '100%' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
        >
          <AuthPage onAuthenticated={() => setIsAuthenticated(true)} />
        </motion.div>
      ) : (
        /* ── Main App ──────────────────────────── */
        <motion.div
          key="app"
          id="app-layout"
          className="flex min-h-screen w-full"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Sidebar ───────────────────────── */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((c) => !c)}
            activeId={activePage}
            onNavigate={setActivePage}
          />

          {/* ── Main Content ──────────────────── */}
          <main
            id="main-content"
            className={`
              flex-1 min-h-screen transition-all duration-300 ease-in-out
              w-full md:w-auto
              ${sidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-60'}
            `}
          >
            {/* Top bar */}
            <div
              id="topbar"
              className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-8
                bg-surface/80 backdrop-blur-xl border-b border-border-subtle"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] tracking-widest uppercase text-text-muted font-semibold">
                  {pageLabels[activePage] || 'Dashboard'}
                </span>
              </div>

              {/* Search + Avatar */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search pill */}
                <div id="search-trigger"
                  className="flex items-center gap-2 px-3 h-8 rounded-xl
                    bg-surface-elevated border border-border-subtle
                    text-text-muted text-sm cursor-pointer
                    hover:border-border hover:shadow-[0_0_8px_rgba(99,102,241,0.05)]
                    transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 opacity-50" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                  <span className="text-text-muted/60 hidden sm:inline">Search…</span>
                  <kbd className="hidden sm:inline text-[9px] text-text-muted/50 border border-border-subtle
                    rounded-md px-1.5 py-0.5 ml-3 font-mono">⌘K</kbd>
                </div>

                {/* Notification bell */}
                <button id="notifications-btn"
                  className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary
                    hover:bg-surface-hover transition-all duration-200 cursor-pointer min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 flex items-center justify-center active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-4 sm:h-4" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  <span className="absolute top-2.5 right-2.5 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 rounded-full bg-danger
                    ring-2 ring-surface" />
                </button>

                {/* Avatar — click to sign out (demo) */}
                <button
                  id="user-avatar"
                  type="button"
                  onClick={() => setIsAuthenticated(false)}
                  title="Sign out"
                  className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl bg-accent/12 flex items-center justify-center
                    text-xs font-semibold text-accent cursor-pointer
                    ring-2 ring-transparent hover:ring-accent/20
                    transition-all duration-200 active:scale-95 border-none"
                >
                  U
                </button>
              </div>
            </div>

            {/* Page content */}
            <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-6xl">
              {renderPage()}
            </div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
