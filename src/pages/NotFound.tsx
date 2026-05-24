import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <p className="text-6xl font-mono font-bold text-[#00d1ff]">404</p>
        <p className="text-slate-400 text-sm font-mono">PAGE NOT FOUND</p>
        <Link to="/" className="inline-block mt-4 text-[#00d1ff] border border-[#00d1ff]/30 px-4 py-2 rounded-xl text-sm font-mono hover:bg-[#00d1ff]/10">
          ← Return Home
        </Link>
      </div>
    </main>
  );
}
