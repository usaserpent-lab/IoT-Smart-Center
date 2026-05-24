import { useEffect, useState } from 'react';
import { fetchNodeRed, getNodeRedUrl } from '@/lib/api';
import { Activity, AlertTriangle, CheckCircle, Settings, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

type MachineState = 'RUNNING' | 'FAILURE' | 'MAINTENANCE' | 'ESCALATION' | 'CONTROL' | 'CRITICAL' | 'OFFLINE';

type MachineApiResponse = {
  machine?: string;
  tech?: string;
};

export default function MachineMonitoring() {
  const [state, setState] = useState<MachineState>('OFFLINE');
  const [activeTech, setActiveTech] = useState<string>('NONE');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const data = await fetchNodeRed<MachineApiResponse>('/machine');
        if (data && data.machine) {
          setState((data.machine as MachineState) || 'OFFLINE');
          setActiveTech(data.tech || 'NONE');
          setLastUpdate(new Date());
          setConnectionError(false);
        } else {
          setConnectionError(true);
        }
      } catch {
        setConnectionError(true);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (machineState: MachineState) => {
    switch (machineState) {
      case 'RUNNING':
        return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/50', icon: CheckCircle, label: 'RUNNING' };
      case 'FAILURE':
        return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50', icon: AlertTriangle, label: 'FAILURE' };
      case 'CRITICAL':
        return { color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500', icon: ShieldAlert, label: 'CRITICAL', blink: true };
      case 'MAINTENANCE':
        return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50', icon: Settings, label: 'MAINTENANCE' };
      case 'ESCALATION':
        return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50', icon: Zap, label: 'ESCALATION', blink: true };
      case 'CONTROL':
        return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50', icon: Activity, label: 'SUPERVISOR CONTROL' };
      default:
        return { color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/50', icon: Activity, label: 'OFFLINE' };
    }
  };

  const config = getStatusConfig(state);

  return (
    <main className="min-h-screen grid-bg flex flex-col items-center p-4 pb-24">
      <div className="w-full max-w-md py-6 text-center">
        <div className="flex justify-center mb-2">
          {connectionError ? (
            <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-red-500 font-mono font-bold uppercase tracking-tighter">Node-RED Disconnected</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-[9px] text-green-500 font-mono font-bold uppercase tracking-tighter">Backend Linked</span>
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold text-glow">Machine Supervision</h1>
        <p className="text-[10px] text-mono text-slate-500 tracking-widest mt-1 uppercase">SCADA Feed: {getNodeRedUrl()}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className={cn('scada-panel p-8 flex flex-col items-center transition-all duration-500', config.border, config.blink && 'animate-pulse')}>
          <div className={cn('w-24 h-24 rounded-full flex items-center justify-center mb-6 relative', config.bg)}>
            <div className={cn('absolute inset-0 rounded-full blur-xl opacity-50', config.bg)} />
            <config.icon size={48} className={config.color} />
          </div>
          <h2 className={cn('text-3xl font-black tracking-tighter italic', config.color)}>{config.label}</h2>
          <p className="text-[10px] text-mono text-slate-500 mt-2">SYSTEM STATUS IDENTIFIED</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="scada-panel p-4 space-y-1">
            <span className="text-[9px] text-slate-500 text-mono uppercase">Operational State</span>
            <p className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span
                className={cn(
                  'w-2 h-2 rounded-full animate-pulse',
                  state === 'RUNNING' ? 'bg-green-500' : ['MAINTENANCE', 'ESCALATION', 'CONTROL'].includes(state) ? 'bg-orange-500' : 'bg-red-500'
                )}
              />
              {state}
            </p>
          </div>
          <div className="scada-panel p-4 space-y-1">
            <span className="text-[9px] text-slate-500 text-mono uppercase">Assigned Staff</span>
            <p className="text-sm font-bold text-[#00d1ff] tracking-tight uppercase italic">{activeTech}</p>
          </div>
        </div>

        <div className="scada-panel p-6">
          <h3 className="text-[10px] text-mono text-slate-400 mb-4 uppercase tracking-widest text-center border-b border-slate-800 pb-2">Status LEDs</h3>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={cn('w-4 h-4 rounded-full ring-2 ring-black', state === 'RUNNING' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-green-950')} />
              <span className="text-[8px] text-slate-500 text-mono">RUN</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={cn('w-4 h-4 rounded-full ring-2 ring-black', ['FAILURE', 'CRITICAL'].includes(state) ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-red-950')} />
              <span className="text-[8px] text-slate-500 text-mono">FAIL</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={cn('w-4 h-4 rounded-full ring-2 ring-black', ['MAINTENANCE', 'ESCALATION', 'CONTROL'].includes(state) ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-orange-950')} />
              <span className="text-[8px] text-slate-500 text-mono">MAINT</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[9px] text-slate-600 font-mono italic">LAST API HANDSHAKE: {lastUpdate.toLocaleTimeString()}</p>
        </div>
      </div>
    </main>
  );
}