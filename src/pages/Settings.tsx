import { useState } from 'react';
import { Laptop, Smartphone, Wifi, Globe, Share2, Settings as SettingsIcon, Save, TestTube } from 'lucide-react';

const NETWORK_IP = '192.168.0.140';
const DEFAULT_NODE_RED_URL = `http://${NETWORK_IP}:1880`;
const PHONE_APP_HTTPS_URL = `https://${NETWORK_IP}:5173`;

const Settings = () => {
  const [nodeRedUrl, setNodeRedUrl] = useState(
    localStorage.getItem('nodeRedUrl') || DEFAULT_NODE_RED_URL
  );
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleSave = () => {
    localStorage.setItem('nodeRedUrl', nodeRedUrl);
    setTestResult('✅ URL saved successfully!');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`${nodeRedUrl}/state`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      setTestResult('✅ SUCCESS! Data: ' + JSON.stringify(data));
    } catch {
      setTestResult(`❌ ERROR: Cannot reach ${nodeRedUrl}. Check IP and CORS settings.`);
    }
    setTesting(false);
  };

  return (
    <main className="min-h-screen grid-bg flex flex-col items-center p-4 pb-24">
      <div className="w-full max-w-md py-6">
        <h1 className="text-xl font-bold text-glow">System Settings</h1>
        <p className="text-[10px] text-mono text-slate-500 tracking-widest mt-1">NETWORK & CONFIGURATION</p>
      </div>

      <div className="w-full max-w-md scada-panel p-6 animate-fade-in space-y-6">
        {/* Mobile Access */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#00d1ff]/5 border border-[#00d1ff]/20">
          <Smartphone className="text-[#00d1ff]" size={20} />
          <div>
            <h3 className="text-sm font-bold text-white">Smartphone Access</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-mono">Mobile Link Established</p>
          </div>
        </div>

        {/* Node-RED Config */}
        <div className="bg-black/40 rounded-2xl p-4 border border-[#00d1ff]/30 space-y-3">
          <h4 className="text-[10px] font-bold text-[#00d1ff] uppercase tracking-widest flex items-center gap-2">
            <SettingsIcon size={12} /> Node-RED Server Config
          </h4>
          <p className="text-[10px] text-slate-400 font-mono">
            Current network IP preset: <span className="text-[#00d1ff]">{NETWORK_IP}</span>
          </p>
          <div className="space-y-2">
            <label className="text-[9px] text-slate-500 font-mono">TARGET URL (IP:PORT)</label>
            <input
              type="text"
              value={nodeRedUrl}
              onChange={(e) => setNodeRedUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none focus:border-[#00d1ff]"
            />
            <p className="text-[8px] text-slate-500 italic">Example: {DEFAULT_NODE_RED_URL}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#00d1ff] text-black text-[10px] font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1"
            >
              <Save size={12} /> SAVE
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex-1 border border-[#00d1ff]/30 text-[#00d1ff] text-[10px] font-mono py-2 rounded-lg hover:bg-[#00d1ff]/10 flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <TestTube size={12} /> {testing ? 'TESTING...' : 'TEST SYNC'}
            </button>
          </div>

          {testResult && (
            <div className={`text-[10px] font-mono p-2 rounded-lg ${testResult.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
              {testResult}
            </div>
          )}
        </div>

        {/* Connection Guide */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2 px-1 uppercase tracking-widest">
            <Wifi size={14} /> How to connect from phone
          </h4>
          <div className="bg-black/40 rounded-2xl p-4 border border-slate-800 space-y-4">
            {[
              { n: 1, title: 'Same Network', desc: 'Connect your smartphone to the same WiFi as your PC.' },
              { n: 2, title: 'Get Local IP', desc: 'On PC, open CMD and type ipconfig. Look for IPv4 Address.' },
              { n: 3, title: 'Open Browser', desc: 'On your phone, enter: https://[YOUR-IP]:5173' },
            ].map((step) => (
              <div key={step.n} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-[#00d1ff] text-[10px] font-bold flex items-center justify-center border border-slate-700 shrink-0">
                  {step.n}
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-medium">{step.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[#00d1ff]/30 bg-[#00d1ff]/10 p-3 text-[10px] font-mono text-slate-300">
            <p className="text-[#00d1ff] mb-1">Phone access link</p>
            <p className="break-all">{PHONE_APP_HTTPS_URL}</p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { icon: Globe, label: 'Remote Camera', on: true },
            { icon: Share2, label: 'Network Sharing', on: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-slate-500" />
                <span className="text-xs text-slate-300 font-medium">{item.label}</span>
              </div>
              <div className={`w-8 h-4 ${item.on ? 'bg-[#00d1ff]' : 'bg-slate-700'} rounded-full relative`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${item.on ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
        <div className="flex items-center gap-1"><Laptop size={12} /> Workstation-01</div>
        <div className="w-1 h-1 rounded-full bg-slate-800" />
        <div className="flex items-center gap-1"><Smartphone size={12} /> Mobile-Link Active</div>
      </div>
    </main>
  );
};

export default Settings;
