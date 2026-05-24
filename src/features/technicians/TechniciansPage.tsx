import { useState, useEffect } from 'react';
import { 
  RefreshCcw, 
  Camera
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

export const TechniciansPage = () => {
  const { technicians, fetchData } = useStore();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [selectedTech, setSelectedTech] = useState<any>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (scannerVisible) {
      scanner = new Html5QrcodeScanner(
        "tech-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(onScanSuccess, () => {});
    }

    async function onScanSuccess(decodedText: string) {
      try {
        const response = await axios.get(`http://localhost:1880/api/technicians/${decodedText}`);
        setSelectedTech(response.data);
        setScannerVisible(false);
        if (scanner) scanner.clear();
      } catch (err) {
        alert("Technician not found");
      }
    }

    return () => {
      if (scanner) scanner.clear();
    };
  }, [scannerVisible]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-indigo-500 rounded-full" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Technician Profile Lookup</h3>
          <div className="flex-1 h-px bg-[#212733]" />
        </div>

        <div className="card-dark p-8 flex flex-col items-center justify-center min-h-[200px] border-dashed border-2">
          {scannerVisible ? (
            <div className="w-full max-w-md">
              <div id="tech-reader" className="bg-black rounded-xl" />
              <button onClick={() => setScannerVisible(false)} className="mt-4 w-full py-2 text-xs font-bold text-red-500 uppercase border border-red-500/20 rounded-lg">Cancel</button>
            </div>
          ) : selectedTech ? (
            <div className="w-full flex items-center gap-8 animate-in fade-in slide-in-from-bottom-2">
               <div className="w-24 h-24 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-4xl">
                 {selectedTech.avatar || '👤'}
               </div>
               <div className="flex-1 space-y-2">
                 <h4 className="text-xl font-black text-white">{selectedTech.name}</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Role</p>
                     <p className="text-xs font-bold text-slate-300">{selectedTech.role}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">RFID UID</p>
                     <p className="text-xs font-mono text-slate-300">{selectedTech.rfid_uid}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                       selectedTech.status === 'Maintaining' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                       selectedTech.status === 'Sleep Mode' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                       'bg-green-500/10 text-green-500 border-green-500/20'
                     )}>
                       {selectedTech.status}
                     </span>
                   </div>
                 </div>
                 <button onClick={() => setSelectedTech(null)} className="text-[10px] font-black text-indigo-400 uppercase mt-4 hover:underline">Clear Profile</button>
               </div>
            </div>
          ) : (
            <button 
              onClick={() => setScannerVisible(true)}
              className="flex flex-col items-center gap-4 group"
            >
              <Camera className="w-8 h-8 text-slate-700 group-hover:text-indigo-400 transition-colors" />
              <div className="text-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan QR Code</h4>
                <p className="text-[10px] text-slate-600 uppercase mt-1 font-bold">Display profile from Node-RED DB</p>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Real-time Status</h3>
          </div>
          <button onClick={() => fetchData()} className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center gap-1">
            <RefreshCcw className="w-3 h-3" /> Sync
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="card-dark p-6 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#0B0E14] border border-[#212733] flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                  {tech.avatar}
                </div>
                <h4 className="text-lg font-black text-white">{tech.name}</h4>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{tech.rfid_uid}</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    tech.status === 'Maintaining' ? "bg-orange-500 animate-pulse" :
                    tech.status === 'Sleep Mode' ? "bg-slate-500" : "bg-green-500"
                  )} />
                  <span className={cn(
                    "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                    tech.status === 'Maintaining' ? "text-orange-500" :
                    tech.status === 'Sleep Mode' ? "text-slate-500" : "text-green-500"
                  )}>
                    Node-RED {tech.status === 'Available' ? 'online' : tech.status.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-indigo-500 rounded-full" />
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quality Ranking</h3>
          <div className="flex-1 h-px bg-[#212733]" />
        </div>

        <div className="card-dark overflow-hidden">
          <div className="px-6 py-4 border-b border-[#212733] bg-[#151921]/50">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Ranking — <span className="text-indigo-400">GET /RANKING</span> → Technicians Table
             </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#212733]">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">#</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quality Score</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Interventions</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody>
                {technicians.length === 0 ? (
                  <tr className="border-b border-[#212733]/50 last:border-0">
                    <td colSpan={5} className="px-6 py-12 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      No data
                    </td>
                  </tr>
                ) : (
                  technicians.map((tech, idx) => (
                    <tr key={tech.id} className="border-b border-[#212733]/50 last:border-0 hover:bg-slate-800/10 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{idx + 1}</td>
                      <td className="px-6 py-4 text-xs font-bold text-white uppercase">{tech.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-indigo-400">0.0</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-300">0</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border",
                          tech.status === 'Maintaining' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'
                        )}>
                          {tech.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
