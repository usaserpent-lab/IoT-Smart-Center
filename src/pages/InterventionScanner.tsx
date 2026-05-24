import { useState } from 'react';
import { QrCode, CheckCircle2, AlertTriangle, RotateCcw, User } from 'lucide-react';
import CustomScanner from '@/components/CustomScanner';
import { fetchNodeRed, postNodeRed } from '@/lib/api';

type Step = 'scan-machine' | 'scan-tech' | 'confirm' | 'done';

type TechResponse = {
  id: string;
  name: string;
  quality: number;
  status?: string;
};

const UID_FALLBACK_NAMES: Record<string, string> = {
  '37EECE06': 'AHMED',
  '4711CF06': 'AZIZ',
  D455D006: 'CHEF LIGNE',
};

function extractMachineId(raw: string): string | null {
  const text = raw.trim().toUpperCase();
  if (text === 'M1' || text === 'M-001' || text === 'M001') return 'M001';
  try {
    const parsed = JSON.parse(raw) as { machine?: string; machineId?: string };
    const machine = (parsed.machine || parsed.machineId || '').toString().toUpperCase();
    if (machine === 'M1' || machine === 'M-001' || machine === 'M001') return 'M001';
  } catch {
    // Ignore parse errors for non JSON QR payloads
  }
  return null;
}

function extractTechUid(raw: string): string | null {
  const direct = raw.trim().toUpperCase();
  if (/^[0-9A-F]{8}$/.test(direct)) return direct;
  try {
    const parsed = JSON.parse(raw) as { uid?: string };
    const uid = (parsed.uid || '').toString().toUpperCase();
    if (/^[0-9A-F]{8}$/.test(uid)) return uid;
  } catch {
    // Ignore parse errors for non JSON QR payloads
  }
  return null;
}

export default function InterventionScanner() {
  const [step, setStep] = useState<Step>('scan-machine');
  const [machineId, setMachineId] = useState('M001');
  const [techName, setTechName] = useState('');
  const [techUid, setTechUid] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleMachineDetected = (rawValue: string) => {
    if (step !== 'scan-machine') return;
    const id = extractMachineId(rawValue);
    if (!id) {
      setError('Invalid machine QR. Use machine QR that contains M1.');
      return;
    }
    setMachineId(id);
    setError('');
    setStep('scan-tech');
  };

  const handleTechDetected = async (rawValue: string) => {
    if (step !== 'scan-tech') return;
    const uid = extractTechUid(rawValue);
    if (!uid) {
      setError('Invalid technician QR. UID must be 8 hex chars.');
      return;
    }

    try {
      const profile = await fetchNodeRed<TechResponse>(`/tech?id=${uid}`);
      setTechUid(uid);
      setTechName(profile.name || 'UNKNOWN');
      setError('');
      setStep('confirm');
    } catch {
      const fallbackName = UID_FALLBACK_NAMES[uid] || `UID ${uid}`;
      setTechUid(uid);
      setTechName(fallbackName);
      setError('');
      setStep('confirm');
    }
  };

  const handleConfirm = async () => {
    try {
      await postNodeRed('/intervention', {
        machine: machineId,
        machineId,
        technician: techUid,
        techUid,
        timestamp: new Date().toISOString(),
      });

      const cacheKey = `tech-history-${techUid}`;
      const history = JSON.parse(localStorage.getItem(cacheKey) || '[]') as Array<{ date: string; result: string }>;
      const updatedHistory = [{ date: new Date().toLocaleDateString(), result: 'Successful Maintenance' }, ...history].slice(0, 20);
      localStorage.setItem(cacheKey, JSON.stringify(updatedHistory));

      // Global machine history page uses this feed.
      const machineHistory = JSON.parse(localStorage.getItem('machine-history') || '[]') as Array<{ date: string; machine: string; uid: string; technician: string; result: string }>;
      machineHistory.unshift({
        date: new Date().toLocaleString(),
        machine: machineId,
        uid: techUid,
        technician: techName || 'UNKNOWN',
        result: 'Maintenance started',
      });
      localStorage.setItem('machine-history', JSON.stringify(machineHistory.slice(0, 100)));

      setWarning('');
      setStep('done');
    } catch {
      // Command can still execute even when Node-RED does not return a proper HTTP response.
      setWarning('Intervention command sent, but endpoint response is invalid/missing.');
      setError('');
      setStep('done');
    }
  };

  const handleReset = () => {
    setStep('scan-machine');
    setMachineId('M001');
    setTechName('');
    setTechUid('');
    setError('');
    setWarning('');
  };

  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="w-full max-w-md mx-auto pt-6 pb-4">
        <h1 className="text-xl font-bold text-glow">Intervention</h1>
        <p className="text-[10px] text-mono text-slate-500 tracking-widest mt-1">QR SCAN WORKFLOW</p>
      </div>

      <div className="w-full max-w-md mx-auto flex items-center gap-2 mb-6">
        {['scan-machine', 'scan-tech', 'confirm', 'done'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                step === s ? 'bg-[#00d1ff] text-black' : ['scan-machine', 'scan-tech', 'confirm', 'done'].indexOf(step) > i ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {i + 1}
            </div>
            {i < 3 && <div className={`flex-1 h-px ${['scan-machine', 'scan-tech', 'confirm', 'done'].indexOf(step) > i ? 'bg-green-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md mx-auto scada-panel p-6 animate-fade-in">
        {step === 'scan-machine' && (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#00d1ff]/10 border border-[#00d1ff]/30 flex items-center justify-center">
                <QrCode size={32} className="text-[#00d1ff]" />
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold text-white">Scan Machine QR</h2>
                <p className="text-[11px] text-slate-400 mt-1">Point camera at machine QR code</p>
              </div>
            </div>
            <CustomScanner key="machine" title="Scanner" hint="Align machine QR (M001) inside the frame" enabled={step === 'scan-machine'} onDetected={handleMachineDetected} />
            {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle size={12} />{error}</p>}
            <p className="text-center text-[11px] text-slate-500 font-mono uppercase tracking-widest">Waiting for machine QR scan...</p>
          </div>
        )}

        {step === 'scan-tech' && (
          <div className="space-y-5">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-400" />
              <div>
                <p className="text-[9px] text-slate-400 font-mono">Machine confirmed</p>
                <p className="text-sm font-bold text-white">Machine {machineId}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#00d1ff]/10 border border-[#00d1ff]/30 flex items-center justify-center">
                <User size={32} className="text-[#00d1ff]" />
              </div>
              <div className="text-center">
                <h2 className="text-base font-bold text-white">Scan Technician Badge</h2>
                <p className="text-[11px] text-slate-400 mt-1">Point camera at technician badge</p>
              </div>
            </div>
            <CustomScanner key="tech" title="Scanner" hint="Align technician UID QR inside the frame" enabled={step === 'scan-tech'} onDetected={handleTechDetected} />
            {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle size={12} />{error}</p>}
            <p className="text-center text-[11px] text-slate-500 font-mono uppercase tracking-widest">Waiting for technician QR scan...</p>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-white text-center">Confirm Intervention</h2>
            <div className="space-y-3">
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-[9px] text-slate-500 font-mono uppercase mb-1">Machine</p>
                <p className="text-sm font-bold text-white">{machineId}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-[9px] text-slate-500 font-mono uppercase mb-1">Technician</p>
                <p className="text-sm font-bold text-white">{techName || 'Unknown'}</p>
                <p className="text-[10px] text-slate-500 font-mono">{techUid}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-[9px] text-slate-500 font-mono uppercase mb-1">Timestamp</p>
                <p className="text-sm font-bold text-white">{new Date().toLocaleString()}</p>
              </div>
            </div>
            {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle size={12} />{error}</p>}
            <button onClick={handleConfirm} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold h-11 rounded-xl flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 size={16} /> Start Intervention
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Intervention Started!</h2>
              <p className="text-xs text-slate-400 mt-1">{techName || techUid} is now assigned to machine {machineId}</p>
            </div>
            {warning && <p className="text-center text-[10px] text-amber-400 font-mono">{warning}</p>}
            <div className="w-full bg-black/40 rounded-xl p-4 border border-green-500/20 text-center">
              <p className="text-[9px] text-slate-500 font-mono uppercase">Session ID</p>
              <p className="text-base font-mono font-bold text-[#00d1ff] mt-1">INT-{Date.now().toString().slice(-6)}</p>
            </div>
            <button onClick={handleReset} className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 font-bold h-11 rounded-xl flex items-center justify-center gap-2 text-sm">
              <RotateCcw size={16} /> New Intervention
            </button>
          </div>
        )}
      </div>
    </main>
  );
}