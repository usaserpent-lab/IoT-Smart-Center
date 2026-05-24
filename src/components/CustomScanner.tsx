import { useEffect, useMemo, useRef, useState } from 'react';
import { ScanLine, Camera, CameraOff } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface CustomScannerProps {
  title: string;
  hint: string;
  enabled?: boolean;
  onDetected?: (value: string) => void;
}

export default function CustomScanner({ title, hint, enabled = true, onDetected }: CustomScannerProps) {
  const [error, setError] = useState('');
  const [active, setActive] = useState(false);
  const scannerId = useMemo(() => `qr-reader-${Math.random().toString(36).slice(2, 10)}`, []);
  const onDetectedRef = useRef(onDetected);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    if (!enabled || !onDetected) return;

    let cancelled = false;
    const scanner = new Html5Qrcode(scannerId);

    const start = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            if (!cancelled) {
              onDetectedRef.current?.(decodedText.trim());
            }
          },
          () => {
            // Ignore scan frame errors while waiting for a valid QR
          }
        );
        if (!cancelled) {
          setActive(true);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError('Camera blocked. Use HTTPS on phone and allow camera permission.');
          setActive(false);
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      if (scanner.isScanning) {
        scanner.stop().then(() => scanner.clear()).catch(() => undefined);
      } else {
        try {
          scanner.clear();
        } catch {
          // Ignore clear errors during unmount
        }
      }
    };
  }, [enabled, scannerId]);

  return (
    <div className="rounded-2xl border border-[#00d1ff]/30 bg-[#00d1ff]/5 p-4">
      <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-xl border border-slate-700 bg-[#020817]">
        <div id={scannerId} className="min-h-52 w-full" />
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#020817]/80 text-[#00d1ff]">
            {error ? <CameraOff size={36} /> : <Camera size={36} />}
          </div>
        )}
        {active && (
          <>
            <div className="pointer-events-none absolute inset-4 border border-[#00d1ff]/40" />
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-8 animate-[scan_2s_linear_infinite] bg-gradient-to-b from-[#00d1ff]/35 to-transparent" />
            <div className="pointer-events-none absolute bottom-3 right-3 text-[#00d1ff]/70">
              <ScanLine size={16} />
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-white">{title}</p>
      <p className="text-center text-[11px] text-slate-400">{hint}</p>
      {error && (
        <p className="mt-2 text-center text-[10px] text-red-400">
          {error}
        </p>
      )}
      {!enabled && (
        <p className="mt-2 text-center text-[10px] text-slate-500 font-mono">
          Scanner paused
        </p>
      )}
    </div>
  );
}