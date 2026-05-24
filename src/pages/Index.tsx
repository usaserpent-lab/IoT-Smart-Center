import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function Index() {
  return (
    <main className="min-h-screen grid-bg">
      <Navbar />
      <section className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-5xl items-center px-4">
        <div>
          <p className="text-[#00d1ff] text-sm font-semibold">Maintain-App</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Smart Factory Maintenance Control</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Monitor machine status, launch interventions with QR scanning, and track technician performance.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/login" className="rounded-xl bg-[#00d1ff] px-4 py-2 text-sm font-semibold text-black">Open Dashboard</Link>
            <Link to="/about" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300">Learn More</Link>
          </div>
        </div>
      </section>
    </main>
  );
}