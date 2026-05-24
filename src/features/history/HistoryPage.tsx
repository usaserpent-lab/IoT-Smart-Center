import { RefreshCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const HistoryPage = () => {
  const { history, fetchData } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data logs from SQLite</h2>
        <button 
          onClick={() => fetchData()}
          className="flex items-center gap-2 text-indigo-400 text-[11px] font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-[#212733] bg-[#151921]/50">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Intervention History — <span className="text-indigo-400">Node-RED API Integration</span>
           </h4>
        </div>
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#212733]">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Machine</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Technician</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Result</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      No records found in database
                    </p>
                  </td>
                </tr>
              ) : (
                history.map((row: any) => (
                  <tr key={row.id} className="border-b border-[#212733]/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{new Date(row.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-bold text-white uppercase">{row.machine_id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-300 uppercase">{row.technician_name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-indigo-400 uppercase">{row.action}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{row.result}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
