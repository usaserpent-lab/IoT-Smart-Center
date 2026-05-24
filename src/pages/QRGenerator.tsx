import { useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRGenerator() {
  const [value, setValue] = useState('M-001');
  const [fgColor, setFgColor] = useState('#00d1ff');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [size, setSize] = useState(220);

  const safeValue = useMemo(() => value.trim() || 'EMPTY', [value]);

  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="mx-auto w-full max-w-md pt-6 pb-4">
        <h1 className="text-xl font-bold text-glow">QR Generator</h1>
        <p className="mt-1 text-[10px] tracking-widest text-slate-500 text-mono">CREATE MACHINE OR TECH TAGS</p>
      </div>

      <section className="mx-auto w-full max-w-md scada-panel p-5 space-y-5">
        <div>
          <label className="block text-[10px] text-slate-500 text-mono uppercase mb-2">QR Code Content</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter machine ID, tech ID, or URL"
            className="w-full rounded-xl border border-slate-800 bg-[#020817] px-4 py-2.5 text-sm text-white outline-none focus:border-[#00d1ff]/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="rounded-xl border border-slate-800 bg-black/30 p-3 text-xs text-slate-300 flex items-center justify-between">
            Foreground
            <input type="color" value={fgColor} onChange={(event) => setFgColor(event.target.value)} className="h-8 w-8 rounded" />
          </label>
          <label className="rounded-xl border border-slate-800 bg-black/30 p-3 text-xs text-slate-300 flex items-center justify-between">
            Background
            <input type="color" value={bgColor} onChange={(event) => setBgColor(event.target.value)} className="h-8 w-8 rounded" />
          </label>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 text-mono uppercase mb-2">Size ({size}px)</label>
          <input
            type="range"
            min={140}
            max={320}
            step={10}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-full accent-[#00d1ff]"
          />
        </div>

        <div className="rounded-xl border border-[#00d1ff]/30 bg-[#00d1ff]/5 p-4 flex justify-center">
          <QRCodeCanvas value={safeValue} size={size} fgColor={fgColor} bgColor={bgColor} includeMargin />
        </div>
      </section>
    </main>
  );
}