import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Database, 
  History, 
  BarChart3, 
  Users,
  LogOut,
  Menu,
  X,
  Circle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export type TabKey = 'dashboard' | 'machine' | 'technicians' | 'history' | 'reports' | 'settings';

const tabs: Array<{ key: TabKey; label: string; icon: React.ElementType }> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'machine', label: 'Machine M1', icon: Database },
  { key: 'technicians', label: 'Technicians', icon: Users },
  { key: 'history', label: 'History', icon: History },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
      active 
        ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
        : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
    )}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

export const DashboardLayout = ({ children, activeTab, onTabChange }: { 
  children: React.ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { nodeRedStatus } = useStore();

  const handleTabChange = (tab: TabKey) => {
    onTabChange(tab);
    // Auto-close the drawer only on mobile screens.
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#0B0E14] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0E14] border-r border-[#212733] transition-transform duration-300 lg:relative lg:translate-x-0",
        !sidebarOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6">
            <h1 className="text-2xl font-black italic tracking-tighter text-white">Maintain<span className="text-indigo-500">.</span></h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-500 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {tabs.map((tab) => (
              <NavItem
                key={tab.key}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.key}
                onClick={() => handleTabChange(tab.key)}
              />
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="p-4 rounded-xl bg-[#151921] border border-[#212733]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">P</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">PFE26</p>
                  <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">Administrator</p>
                </div>
              </div>
              <button 
                onClick={() => useStore.getState().logout()}
                className="w-full mt-4 flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-[#212733] rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-[#212733] flex items-center justify-between px-8 bg-[#0B0E14]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-slate-500 lg:hidden"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-sm font-bold text-white capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Circle className={cn(
                "w-2 h-2 fill-current",
                nodeRedStatus === 'connected' ? "text-green-500" : "text-red-500"
              )} />
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {nodeRedStatus}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">{time}</div>
          </div>
        </header>

        <div className="lg:hidden border-b border-[#212733] px-3 py-2 bg-[#0B0E14]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={cn(
                    'shrink-0 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors',
                    activeTab === tab.key
                      ? 'border-indigo-500/30 bg-indigo-600/10 text-indigo-300'
                      : 'border-[#212733] bg-[#151921] text-slate-400'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#0B0E14]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
