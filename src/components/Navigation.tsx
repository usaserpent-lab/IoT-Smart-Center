import { NavLink } from 'react-router-dom';
import { Monitor, Users, Trophy, LogOut, Settings, QrCode, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

const Navigation = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: Monitor, label: 'Supervision' },
    { to: '/scan', icon: QrCode, label: 'Start Intervention' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/tech', icon: Users, label: 'Technicians' },
    { to: '/ranking', icon: Trophy, label: 'Ranking' },
    { to: '/settings', icon: Settings, label: 'Extra' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#020817]/80 backdrop-blur-xl border-t border-slate-800">
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 transition-all duration-300',
                isActive ? 'text-[#00d1ff] scale-110' : 'text-slate-500 hover:text-slate-300'
              )
            }
          >
            <item.icon size={20} />
            <span className="text-[9px] font-mono uppercase tracking-tighter">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 text-red-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-[9px] font-mono uppercase tracking-tighter">Exit</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
