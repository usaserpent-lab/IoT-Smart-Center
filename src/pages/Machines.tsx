import { Activity, PenTool, Settings } from 'lucide-react';

const machines = [
  { id: 'M-001', name: 'CNC Lathe A1', status: 'Operational', health: 95 },
  { id: 'M-002', name: 'Milling Machine B2', status: 'Maintenance', health: 62 },
  { id: 'M-003', name: '3D Printer Pro', status: 'Operational', health: 88 },
];

export default function Machines() {
  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="mx-auto w-full max-w-md pt-6 pb-4">
        <h1 className="text-xl font-bold text-glow">Machine Inventory</h1>
        <p className="mt-1 text-[10px] tracking-widest text-slate-500 text-mono">ASSET OVERVIEW</p>
      </div>

      <div className="mx-auto w-full max-w-md space-y-3">
        {machines.map((machine) => (
          <article key={machine.id} className="scada-panel p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">{machine.name}</h2>
                <p className="text-[10px] text-slate-500 text-mono mt-1">ID: {machine.id}</p>
              </div>
              <span className="rounded-lg border border-slate-700 px-2 py-1 text-[10px] text-slate-300 text-mono">{machine.status}</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-black/30 p-2">
                <Activity size={14} className="mx-auto text-[#00d1ff]" />
                <p className="mt-1 text-[10px] text-slate-500">Health</p>
                <p className="text-sm text-white font-bold">{machine.health}%</p>
              </div>
              <div className="rounded-lg bg-black/30 p-2">
                <PenTool size={14} className="mx-auto text-[#00d1ff]" />
                <p className="mt-1 text-[10px] text-slate-500">State</p>
                <p className="text-xs text-white font-semibold">{machine.status}</p>
              </div>
              <div className="rounded-lg bg-black/30 p-2">
                <Settings size={14} className="mx-auto text-[#00d1ff]" />
                <p className="mt-1 text-[10px] text-slate-500">Actions</p>
                <p className="text-xs text-white font-semibold">Enabled</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}