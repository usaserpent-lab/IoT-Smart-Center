import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

const ReportStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="card-dark p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-indigo-500/20 transition-all">
    <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.02] rounded-full -mr-12 -mt-12 group-hover:opacity-[0.05] transition-opacity" />
    <div className={cn("p-2 rounded-lg w-fit", color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-3xl font-black text-white">{value}</h4>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  </div>
);

export const ReportsPage = () => {
  const { technicians, stats } = useStore();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ReportStat label="Machine Failures" value={stats.failures} icon={ShieldAlert} color="bg-red-500/10 text-red-500" />
        <ReportStat label="Successful Repairs" value={stats.repairs} icon={CheckCircle2} color="bg-green-500/10 text-green-500" />
        <ReportStat label="Escalations" value={stats.escalations} icon={AlertTriangle} color="bg-orange-500/10 text-orange-500" />
        <ReportStat label="Maintenance Starts" value={stats.maintenance} icon={Wrench} color="bg-indigo-500/10 text-indigo-500" />
        <ReportStat label="Critical Events" value={stats.critical} icon={AlertCircle} color="bg-red-600/10 text-red-600" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-indigo-500 rounded-full" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Technician Performance (Real Data)
          </h3>
          <div className="flex-1 h-px bg-[#212733]" />
        </div>

        <div className="card-dark overflow-hidden">
          <div className="p-2 space-y-1">
            {technicians.map(tech => (
              <div key={tech.id} className="flex items-center justify-between p-4 hover:bg-[#0B0E14]/50 rounded-lg group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#0B0E14] border border-[#212733] flex items-center justify-center text-sm">
                    {tech.avatar}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white">{tech.name} <span className="text-[9px] text-slate-500 font-bold ml-1">{tech.rfid_uid}</span></h5>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-[9px] font-bold text-slate-500 uppercase">Role: <span className="text-white">{tech.role}</span></span>
                       <span className="text-[9px] font-bold text-slate-500 uppercase">Status: <span className="text-indigo-400">{tech.status}</span></span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase group-hover:text-slate-400 transition-colors">
                  Details →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
