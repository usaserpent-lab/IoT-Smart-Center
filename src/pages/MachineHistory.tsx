import { useEffect, useMemo, useState } from 'react';
import { Clock3, Trash2, QrCode, RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchNodeRed } from '@/lib/api';
import CustomScanner from '@/components/CustomScanner';

type MachineHistoryEntry = {
  date: string;
  time?: string;
  machine: string;
  uid: string;
  technician: string;
  result: string;
  status?: string;
};

type HistoryResponse = {
  success?: boolean;
  history?: MachineHistoryEntry[];
  error?: string;
};

export default function MachineHistory() {
  const [version, setVersion] = useState(0);
  const [selectedMachine, setSelectedMachine] = useState('M001');
  const [scanError, setScanError] = useState('');
  const [remoteHistory, setRemoteHistory] = useState<MachineHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleMachineDetected = (rawValue: string) => {
    const value = rawValue.trim().toUpperCase();
    if (value === 'M001' || value === 'M1' || value === 'M-001') {
      setSelectedMachine('M001');
      setScanError('');
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as { machine?: string; machineId?: string };
      const machine = (parsed.machine || parsed.machineId || '').toString().toUpperCase();
      if (machine === 'M001' || machine === 'M1' || machine === 'M-001') {
        setSelectedMachine('M001');
        setScanError('');
        return;
      }
    } catch {
      // Ignore invalid JSON payloads
    }

    setScanError('Invalid machine QR. Expected M001.');
  };

  // Fetch history from Node-RED
  const loadRemoteHistory = async () => {
    setLoading(true);
    setFetchError('');

    try {
      // Try /machine-history endpoint first
      const data = await fetchNodeRed<HistoryResponse | MachineHistoryEntry[]>('/machine-history');

      let entries: MachineHistoryEntry[] = [];

      if (Array.isArray(data)) {
        entries = data.map(item => ({
          date: item.date || item.time || '',
          machine: item.machine || 'M001',
          uid: item.uid || 'UNKNOWN',
          technician: item.technician || item.uid || 'UNKNOWN',
          result: item.result || item.status || 'Maintenance',
        }));
      } else if (data && data.history) {
        entries = data.history.map(item => ({
          date: item.date || item.time || '',
          machine: item.machine || 'M001',
          uid: item.uid || 'UNKNOWN',
          technician: item.technician || item.uid || 'UNKNOWN',
          result: item.result || item.status || 'Maintenance',
        }));
      }

      setRemoteHistory(entries);
    } catch {
      setFetchError('Could not fetch from Node-RED. Showing local cache only.');
      setRemoteHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemoteHistory();
  }, [version]);

  // Merge remote + local, filter by selected machine
  const rows = useMemo(() => {
    const cached = JSON.parse(localStorage.getItem('machine-history') || '[]') as MachineHistoryEntry[];

    // Combine remote first, then local (avoid duplicates by date+uid)
    const seen = new Set<string>();
    const merged: MachineHistoryEntry[] = [];

    for (const row of [...remoteHistory, ...cached]) {
      const key = `${row.date}-${row.uid}-${row.result}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(row);
      }
    }

    return merged.filter((row) => (row.machine || '').toUpperCase() === selectedMachine);
  }, [version, selectedMachine, remoteHistory]);

  const clearHistory = () => {
    localStorage.removeItem('machine-history');
    setVersion((v) => v + 1);
  };

  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="w-full max-w-md mx-auto pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-glow">Machine History</h1>
          <p className="text-[10px] text-mono text-slate-500 tracking-widest mt-1">LATEST INTERVENTIONS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setVersion((v) => v + 1); loadRemoteHistory(); }}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-500 flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={clearHistory} className="rounded-lg border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-500 flex items-center gap-1">
            <Trash2 size={12} /> Clear
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto scada-panel p-4 mb-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <QrCode size={14} className="text-[#00d1ff]" /> Scan machine QR to filter history
        </div>
        <CustomScanner key="machine-history" title="Machine Scanner" hint="Scan M001 QR" enabled onDetected={handleMachineDetected} />
        <p className="text-[10px] text-slate-500 font-mono">Selected machine: {selectedMachine}</p>
        {scanError && <p className="text-[10px] text-red-400 font-mono">{scanError}</p>}
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div className="w-full max-w-md mx-auto mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-[10px] text-amber-400 flex items-center gap-1">
            <AlertTriangle size={12} /> {fetchError}
          </p>
        </div>
      )}

      <div className="w-full max-w-md mx-auto scada-panel p-4 space-y-2">
        {loading && (
          <div className="text-center py-4">
            <RefreshCw size={20} className="mx-auto text-[#00d1ff] animate-spin mb-2" />
            <p className="text-[10px] text-slate-500 font-mono">Loading history...</p>
          </div>
        )}

        {!loading && rows.length === 0 && (
          <p className="text-center text-[10px] text-slate-500 font-mono py-4">No history for {selectedMachine} yet.</p>
        )}

        {!loading && rows.map((row, index) => (
          <div key={`${row.date}-${index}`} className="rounded-xl border border-slate-800 bg-black/30 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-white">{row.machine}</p>
              <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1"><Clock3 size={10} /> {row.date}</p>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">{row.technician} ({row.uid})</p>
            <p className="text-[11px] text-[#00d1ff] mt-1">{row.result}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
