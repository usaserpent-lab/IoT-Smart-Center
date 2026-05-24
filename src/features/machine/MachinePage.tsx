import { useState, useEffect } from 'react';
import { 
  Camera, 
  QrCode, 
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';
import { Html5QrcodeScanner } from 'html5-qrcode';

export const MachinePage = () => {
  const { machineState, activeIntervention, startIntervention, endIntervention } = useStore();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [scannedUid, setScannedUid] = useState('');

  useEffect(() => {
    if (activeIntervention) {
      setCurrentStep(3);
    } else if (scannedUid) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [activeIntervention, scannedUid]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (scannerVisible) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scanner.render(onScanSuccess, () => {});
    }

    function onScanSuccess(decodedText: string) {
      setScannedUid(decodedText);
      setScannerVisible(false);
      if (scanner) {
        scanner.clear();
      }
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scannerVisible, startIntervention]);

  const handleStartIntervention = async () => {
    if (!scannedUid) return;
    await startIntervention(scannedUid, 'M1');
  };

  const resetWorkflow = () => {
    setScannedUid('');
    setScannerVisible(false);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-white tracking-tight">Intervention</h2>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">QR Scan Workflow</p>
      </div>

      <div className="flex items-center gap-8 py-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
              currentStep >= step ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "bg-[#151921] text-slate-700 border border-[#212733]"
            )}>
              {step}
            </div>
            {step < 3 && (
              <div className={cn(
                "w-24 h-px mx-4",
                currentStep > step ? "bg-blue-500" : "bg-[#212733]"
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="card-dark p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <span className="text-8xl font-black text-white opacity-[0.03] select-none tracking-tighter">M1</span>
        </div>
        
        <div className="relative">
          <h2 className="text-3xl font-black text-white tracking-tight">Machine M1</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            factory/machine1 • Integrated Node-RED Control
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
              machineState === 'RUNNING' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
              machineState === 'MAINTENANCE' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
              "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              <div className={cn("w-2 h-2 rounded-full", 
                machineState === 'RUNNING' ? "bg-green-500" : 
                machineState === 'MAINTENANCE' ? "bg-orange-500" : "bg-red-500"
              )} />
              {machineState}
            </div>
          </div>

          {activeIntervention && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 border-t border-[#212733] pt-8">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Technician</p>
                <p className="text-sm font-black text-white uppercase">{activeIntervention.technician_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Started At</p>
                <p className="text-sm font-black text-white">{new Date(activeIntervention.start_time).toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Intervention ID</p>
                <p className="text-sm font-black text-white truncate">{activeIntervention.id}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card-dark p-12 flex flex-col items-center justify-center min-h-[500px] border-[#1e293b]">
          {currentStep === 1 && (
            <div className="w-full max-w-md flex flex-col items-center gap-8">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <QrCode className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Step 1 - Scan Technician QR</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Start intervention and open camera</p>
              </div>
              {scannerVisible ? (
                <div className="w-full bg-[#0B0E14] rounded-3xl p-6 border border-[#212733] shadow-inner">
                  <div id="qr-reader" className="bg-black rounded-2xl overflow-hidden aspect-video" />
                  <div className="mt-6 text-center space-y-2">
                    <h4 className="text-xs font-black text-white uppercase">Scanner</h4>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Align technician QR inside the frame</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setScannerVisible(true)}
                  className="flex items-center gap-3 px-10 py-5 bg-blue-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  Open Camera
                </button>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full max-w-md flex flex-col items-center gap-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Step 2 - Confirm UID</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Shows UID and start button</p>
              </div>
              <div className="w-full rounded-2xl border border-[#212733] bg-[#0B0E14] p-5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanned UID</p>
                <p className="mt-2 text-xl font-black text-white tracking-wider">{scannedUid}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleStartIntervention}
                  className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  Start Intervention
                </button>
                <button
                  onClick={() => {
                    setScannedUid('');
                    setScannerVisible(true);
                    setCurrentStep(1);
                  }}
                  className="px-6 py-4 bg-[#0B0E14] border border-[#212733] text-slate-300 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#151921]"
                >
                  Rescan
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="w-full max-w-lg flex flex-col items-center gap-8 text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                <CheckCircle2 className="w-8 h-8 text-orange-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Step 3 - End Intervention</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">End intervention point button</p>
              </div>
              <div className="w-full rounded-2xl border border-[#212733] bg-[#0B0E14] p-5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Technician</p>
                <p className="mt-2 text-xl font-black text-white tracking-wider">{activeIntervention?.technician_name ?? 'Unknown'}</p>
              </div>
              <button
                onClick={async () => {
                  await endIntervention('M1');
                  resetWorkflow();
                }}
                className="flex items-center gap-3 px-10 py-5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-500/20 transition-all shadow-xl shadow-red-500/5 active:scale-95"
              >
                End Intervention
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
