import React, { useState } from 'react';
import { Settings, Lock } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useStore((state: any) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-[#151921] border border-[#212733] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="relative z-10">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
            <Settings className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight mb-2 italic">PFE26 Login</h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-10">
            Machine Maintenance Dashboard <span className="mx-1 text-slate-700">•</span> ISET Sousse × TADREEX
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-[#0B0E14] border border-[#212733] text-white px-5 py-4 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#0B0E14] border border-[#212733] text-white px-5 py-4 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm placeholder:text-slate-700"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-bounce">
                Invalid Credentials
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              <Lock className="w-4 h-4" />
              <span className="uppercase tracking-widest text-sm">Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
