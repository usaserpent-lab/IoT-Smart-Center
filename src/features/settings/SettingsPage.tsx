import { Save } from 'lucide-react';
import { getNodeRedUrl, setNodeRedUrl } from '../../utils/nodeRed';
import { useState } from 'react';

export const SettingsPage = () => {
  const [url, setUrl] = useState(getNodeRedUrl());

  const handleSave = () => {
    setNodeRedUrl(url);
    window.location.reload(); // Reload to apply changes
  };

  return (
    <div className="space-y-6">
      <div className="card-dark p-8">
        <h3 className="text-lg font-black text-white mb-6">Node-RED Connection</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://192.168.1.100:1880"
              className="w-full bg-[#0B0E14] border border-[#212733] text-white px-4 py-3 rounded-lg outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              <Save className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="card-dark p-6">
        <h4 className="text-sm font-black text-white mb-4">Current Configuration</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Node-RED URL:</span>
            <span className="text-indigo-400 font-mono">{url}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Timeout:</span>
            <span className="text-slate-300">3.5 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};