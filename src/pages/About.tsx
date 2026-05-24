import { CheckCircle2, QrCode, Shield, Zap } from 'lucide-react';

const points = [
  'Fast intervention startup using QR scans',
  'Simple technician performance visibility',
  'Mobile-friendly SCADA-inspired interface',
  'Local settings for Node-RED integration',
];

export default function About() {
  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="mx-auto w-full max-w-md pt-6 pb-4">
        <h1 className="text-xl font-bold text-glow">About Maintain-App</h1>
        <p className="mt-1 text-[10px] tracking-widest text-slate-500 text-mono">SMART FACTORY MAINTENANCE</p>
      </div>

      <section className="mx-auto w-full max-w-md space-y-4">
        <div className="scada-panel p-5">
          <p className="text-sm text-slate-200 leading-relaxed">
            Maintain-App helps production teams monitor machine states, launch interventions, and track technician outcomes
            in one focused workflow.
          </p>
        </div>

        <div className="scada-panel p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#00d1ff] text-sm font-semibold"><Zap size={16} /> Core Benefits</div>
          {points.map((point) => (
            <div key={point} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 size={14} className="text-green-400" />
              {point}
            </div>
          ))}
        </div>

        <div className="scada-panel p-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <QrCode size={16} className="mx-auto text-[#00d1ff]" />
            <p className="mt-1 text-[11px] text-slate-300">QR Flow</p>
          </div>
          <div>
            <Shield size={16} className="mx-auto text-[#00d1ff]" />
            <p className="mt-1 text-[11px] text-slate-300">Secure Login</p>
          </div>
          <div>
            <Zap size={16} className="mx-auto text-[#00d1ff]" />
            <p className="mt-1 text-[11px] text-slate-300">Live Monitoring</p>
          </div>
        </div>
      </section>
    </main>
  );
}