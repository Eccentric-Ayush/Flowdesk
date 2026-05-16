import type { NavItem } from '../types';

/* ─── Icon components (inline SVG for zero dependencies) ─── */

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const InsightsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { id: 'insights', label: 'Insights', icon: <InsightsIcon />, path: '/insights' },
  { id: 'tasks', label: 'My Tasks', icon: <TasksIcon />, path: '/tasks', badge: 5 },
  { id: 'calendar', label: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeId: string;
  onNavigate: (id: string) => void;
}

export default function Sidebar({ collapsed, onToggle, activeId, onNavigate }: SidebarProps) {

  return (
    <aside
      id="sidebar"
      className={`
        hidden md:flex
        fixed top-0 left-0 z-40 h-screen flex-col
        bg-surface-elevated/90 backdrop-blur-xl
        border-r border-border-subtle
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[68px]' : 'w-60'}
      `}
    >
      {/* ── Logo / Brand ─────────────── */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center shrink-0
          shadow-[0_0_12px_rgba(99,102,241,0.1)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-text-primary whitespace-nowrap">
            Flowdesk
          </span>
        )}
      </div>

      {/* ── Navigation Links ─────────── */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 rounded-xl
                px-3 h-10 text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-accent/10 text-accent shadow-[0_0_12px_rgba(99,102,241,0.06)]'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent
                  shadow-[2px_0_8px_rgba(99,102,241,0.3)]" />
              )}
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] font-bold bg-accent/12 text-accent
                  rounded-full px-2 py-0.5 tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Collapse toggle ──────────── */}
      <div className="px-2 pb-4">
        <button
          id="sidebar-toggle"
          onClick={onToggle}
          className="flex items-center justify-center w-full h-9 rounded-xl
            text-text-muted hover:text-text-secondary hover:bg-surface-hover
            transition-all duration-200 cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
