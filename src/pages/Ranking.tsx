import { useEffect, useMemo, useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { fetchNodeRed } from '@/lib/api';

type RankingItem = {
  rank: number;
  name: string;
  quality: number;
};

type RankingApiItem = {
  name?: string;
  quality?: number;
};

function getMedalIcon(rank: number) {
  if (rank === 1) return <Trophy size={18} className="text-amber-400" />;
  if (rank === 2) return <Medal size={18} className="text-slate-300" />;
  if (rank === 3) return <Medal size={18} className="text-amber-700" />;
  return <span className="text-slate-500 text-sm font-mono">#{rank}</span>;
}

export default function Ranking() {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  useEffect(() => {
    const pullRanking = async () => {
      try {
        const response = await fetchNodeRed<RankingApiItem[]>('/ranking');
        const normalized = (Array.isArray(response) ? response : [])
          .map((row, index) => ({
            rank: index + 1,
            name: row.name || `TECH ${index + 1}`,
            quality: Number.isFinite(Number(row.quality)) ? Number(row.quality) : 0,
          }))
          .sort((a, b) => b.quality - a.quality)
          .map((row, index) => ({ ...row, rank: index + 1 }));

        setRanking(normalized);
      } catch {
        setRanking([]);
      } finally {
        setLoading(false);
      }
    };

    pullRanking();
    const interval = setInterval(pullRanking, 5000);
    return () => clearInterval(interval);
  }, []);

  const podium = useMemo(() => {
    if (ranking.length < 3) return null;
    return { first: ranking[0], second: ranking[1], third: ranking[2] };
  }, [ranking]);

  return (
    <main className="min-h-screen grid-bg pb-24 p-4">
      <div className="w-full max-w-md mx-auto pt-6 pb-4">
        <h1 className="text-xl font-bold text-glow">Ranking</h1>
        <p className="text-[10px] text-mono text-slate-500 tracking-widest mt-1">LIVE TECHNICIAN LEADERBOARD</p>
      </div>

      {podium && (
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="flex items-end justify-center gap-3">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center mb-2"><Medal size={20} className="text-slate-300" /></div>
              <p className="text-[10px] text-slate-300 font-bold text-center font-mono">{podium.second.name}</p>
              <div className="w-full bg-slate-800/80 rounded-t-xl h-16 mt-2 flex items-center justify-center border border-slate-700"><span className="text-slate-400 font-bold text-sm">2nd</span></div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(251,191,36,0.3)]"><Trophy size={24} className="text-amber-400" /></div>
              <p className="text-[11px] text-white font-bold text-center font-mono">{podium.first.name}</p>
              <div className="w-full bg-amber-500/10 rounded-t-xl h-24 mt-2 flex items-center justify-center border border-amber-500/30"><span className="text-amber-400 font-bold text-sm">1st</span></div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-900/30 border border-amber-800 flex items-center justify-center mb-2"><Medal size={20} className="text-amber-700" /></div>
              <p className="text-[10px] text-amber-700 font-bold text-center font-mono">{podium.third.name}</p>
              <div className="w-full bg-amber-900/20 rounded-t-xl h-10 mt-2 flex items-center justify-center border border-amber-900/40"><span className="text-amber-700 font-bold text-sm">3rd</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto space-y-3">
        {loading && <div className="scada-panel p-4 text-center text-[10px] text-slate-400 font-mono uppercase tracking-widest">FETCHING DATA...</div>}
        {!loading && ranking.map((item) => (
          <div key={item.rank} className="scada-panel p-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center">{getMedalIcon(item.rank)}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{item.name}</p>
                <div className="mt-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
                  <div
                    className={`${item.quality >= 80 ? 'bg-green-500' : item.quality >= 50 ? 'bg-amber-500' : 'bg-red-500'} h-full rounded-full`}
                    style={{ width: `${Math.max(0, Math.min(item.quality, 100))}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end"><Star size={10} className="text-amber-400 fill-amber-400" /><span className="text-sm font-bold text-white">{item.quality}%</span></div>
                <p className="text-[9px] text-slate-500 font-mono">QUALITY</p>
              </div>
            </div>
          </div>
        ))}
        {!loading && ranking.length === 0 && <div className="scada-panel p-4 text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">NO RANKING DATA AVAILABLE</div>}
      </div>
    </main>
  );
}