import { useEffect, useMemo, useState } from 'react';
import { QrCode, User, Star, Activity, AlertTriangle } from 'lucide-react';
import { fetchNodeRed } from '@/lib/api';
import CustomScanner from '@/components/CustomScanner';

type TechApiResponse = {
  id: string;
  name: string;
  quality: number;
  status?: string;
  stats?: {
    total?: number;
    failures?: number;
    escalations?: number;
  };
};

type HistoryEntry = {
  date: string;
  result: string;
};

const UID_FALLBACK_NAMES: Record<string, string> = {
  '37EECE06': 'AHMED',
  '4711CF06': 'AZIZ',
  D455D006: 'CHEF LIGNE',
};

function extractTechUid(raw: string): string | null {
  const direct = raw.trim().toUpperCase();
  if (/^[0-9A-F]{8}$/.test(direct)) return direct;
  try {
    const parsed = JSON.parse(raw) as { uid?: string };
    const uid = (parsed.uid || '').toString().toUpperCase();
    if (/^[0-9A-F]{8}$/.test(uid)) return uid;
  } catch {
    // Ignore invalid JSON payload
  }
  return null;
}

export default function TechProfile() {
  const [currentUid, setCurrentUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<TechApiResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleTechQrDetected = (value: string) => {
    const uid = extractTechUid(value);
    if (!uid) {
      setError('Invalid technician QR. UID must be 8 hex chars.');
      return;
    }
    if (uid !== currentUid) {
      setCurrentUid(uid);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUid) return;
      setLoading(true);
      setError('');
      try {
        const data = await fetchNodeRed<TechApiResponse>(`/tech?id=${currentUid}`);
        setProfile(data);

        // Optional endpoint if you expose it in Node-RED later
        try {
          const remoteHistory = await fetchNodeRed<HistoryEntry[]>(`/tech-history?id=${currentUid}&limit=5`);
          setHistory(remoteHistory.slice(0, 5));
        } catch {
          const cache = JSON.parse(localStorage.getItem(`tech-history-${currentUid}`) || '[]') as HistoryEntry[];
          setHistory(cache.slice(0, 5));
        }
      } catch {
        const fallbackName = UID_FALLBACK_NAMES[currentUid];
        if (fallbackName) {
          setProfile({
            id: currentUid,
            name: fallbackName,
            quality: 0,
            status: 'No DB row',
            stats: { total: 0, failures: 0, escalations: 0 },
          });
          const cache = JSON.parse(localStorage.getItem(`tech-history-${currentUid}`) || '[]') as HistoryEntry[];
          setHistory(cache.slice(0, 5));
          setError('');
        } else {
          setProfile(null);
          setError('Technician UID not found in database.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUid]);

  const qualityColor = useMemo(() => {
    if (!profile) return 'text-slate-400';
    if (profile.quality >= 80) return 'text-green-400';
    if (profile.quality >= 50) return 'text-amber-400';
    return 'text-red-400';
  }, [profile]);

  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="w-full max-w-md mx-auto pt-6 pb-4">
        <h1 className="text-xl font-bold text-glow">Technicians</h1>
        <p className="text-[10px] text-mono text-slate-500 tracking-widest mt-1">SCAN BADGE TO VIEW QUALITY</p>
      </div>

      {!profile && (
        <div className="w-full max-w-md mx-auto scada-panel p-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#00d1ff]/10 border border-[#00d1ff]/30 flex items-center justify-center">
              <QrCode size={32} className="text-[#00d1ff]" />
            </div>
            <p className="text-sm text-white font-semibold">Scan technician QR badge</p>
          </div>
          <CustomScanner title="Badge scanner" hint="Scan the technician UID QR code" enabled={!loading} onDetected={handleTechQrDetected} />
          {loading && <p className="text-center text-[10px] text-slate-500 font-mono uppercase">Waiting for scan...</p>}
          {error && (
            <p className="text-xs text-red-400 flex items-center justify-center gap-1">
              <AlertTriangle size={12} /> {error}
            </p>
          )}
        </div>
      )}

      {profile && (
        <div className="w-full max-w-md mx-auto scada-panel p-5 animate-fade-in space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00d1ff]/10 border border-[#00d1ff]/20 flex items-center justify-center">
              <User size={28} className="text-[#00d1ff]" />
            </div>
            <div>
              <p className="text-base font-bold text-white">{profile.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">UID: {profile.id}</p>
              <p className="text-[10px] text-slate-500 font-mono">Status: {profile.status || '--'}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className={`text-lg font-bold ${qualityColor}`}>{profile.quality}%</span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono">Quality</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-white">{profile.stats?.total || 0}</p>
              <p className="text-[9px] text-slate-500 font-mono uppercase">T.Maintain</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-red-400">{profile.stats?.failures || 0}</p>
              <p className="text-[9px] text-slate-500 font-mono uppercase">Failed tech</p>
            </div>
            <div className="bg-black/30 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-amber-400">{profile.stats?.escalations || 0}</p>
              <p className="text-[9px] text-slate-500 font-mono uppercase">Escalation</p>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">Last 5 interventions</h3>
            <div className="space-y-2">
              {history.length > 0 &&
                history.map((item, index) => (
                  <div key={`${item.date}-${index}`} className="bg-black/30 rounded-xl px-3 py-2.5 text-sm text-slate-200 flex items-center gap-2">
                    <Activity size={12} className="text-[#00d1ff]" />
                    <span>{item.date} - {item.result}</span>
                  </div>
                ))}
              {history.length === 0 && <p className="text-[10px] text-slate-500 font-mono">No intervention history for this UID yet.</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}