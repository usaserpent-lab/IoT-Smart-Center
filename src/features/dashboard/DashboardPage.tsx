import { 
  RefreshCcw, 
  Factory, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

export const DashboardPage = () => {
  const { machineState, stateDuration, activeIntervention, logs, fetchData } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live Monitoring</span>
        </div>
        <button 
          onClick={() => fetchData()}
          className="flex items-center gap-2 text-indigo-400 text-[11px] font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Sync with Node-RED
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-dark p-8 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Factory className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{machineState}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Machine State</p>
          </div>
          {activeIntervention && (
            <div className="ml-auto text-right">
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Active Intervention</p>
              <p className="text-sm font-black text-white">{activeIntervention.technician_name}</p>
            </div>
          )}
        </div>

        <div className="card-dark p-8 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20">
            <Clock className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">{stateDuration}s</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">State Duration</p>
          </div>
        </div>
      </div>

      <div className="card-dark flex flex-col min-h-[400px]">
        <div className="px-6 py-4 border-b border-[#212733] flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Event Log</h3>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase">Managed by Node-RED</span>
          </div>
        </div>
        <div className="flex-1 p-6 font-mono text-xs space-y-2 overflow-y-auto max-h-[500px]">
          {logs.length === 0 ? (
             <div className="flex items-center justify-center h-full text-slate-600 uppercase tracking-widest font-bold">
               Waiting for events...
             </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-4 group">
                <span className="text-slate-600 flex-shrink-0">• {log.timestamp}</span>
                <span className={cn(
                  "group-hover:translate-x-1 transition-transform",
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'warning' ? 'text-orange-400' : 'text-slate-400'
                )}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
