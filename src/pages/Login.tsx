import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Factory, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError('Invalid credentials.');
    }
  };

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md scada-panel p-8 animate-fade-in shadow-2xl">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#00d1ff]/10 ring-1 ring-[#00d1ff]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,209,255,0.2)]">
            <Factory className="w-7 h-7 text-[#00d1ff]" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-glow">Smart Factory</h1>
            <p className="text-[10px] text-mono text-slate-400 tracking-[0.2em] mt-2 uppercase">MAINTENANCE CONTROL</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-mono tracking-wider text-slate-400 uppercase block">USERNAME</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="PFE26"
              autoComplete="off"
              autoCapitalize="none"
              className="w-full bg-[#020817] border border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl px-4 text-sm outline-none focus:border-[#00d1ff]/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-mono tracking-wider text-slate-400 uppercase block">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="off"
                className="w-full bg-[#020817] border border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl px-4 pr-12 text-sm outline-none focus:border-[#00d1ff]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-md bg-red-500/10 ring-1 ring-red-500/40 text-red-500">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#00d1ff] hover:bg-[#00d1ff]/90 text-black font-bold h-12 rounded-xl transition-all shadow-[0_0_15px_rgba(0,209,255,0.3)] text-sm"
          >
            Authenticate
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-600 font-mono mt-6 uppercase tracking-widest">
          PFE 2026 — Secure Access
        </p>
      </div>
    </main>
  );
}
