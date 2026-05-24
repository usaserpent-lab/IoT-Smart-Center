import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#020817]/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-sm font-semibold text-white">Maintain-App</Link>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <Link to="/about" className="hover:text-[#00d1ff]">About</Link>
          <Link to="/login" className="hover:text-[#00d1ff]">Login</Link>
        </div>
      </div>
    </header>
  );
}