import { create } from 'zustand';
import type { MachineState, Technician, Intervention, LogEntry } from '../types';
import { machineService, interventionService, technicianService, reportsService, historyService } from '../services/api';
import mqttService from '../services/mqtt';

interface AppState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  machineState: MachineState;
  stateDuration: number;
  activeIntervention: Intervention | null;
  technicians: Technician[];
  logs: LogEntry[];
  history: any[];
  stats: {
    failures: number;
    repairs: number;
    escalations: number;
    maintenance: number;
    critical: number;
  };
  nodeRedStatus: 'connected' | 'disconnected';
  nodeRedUrl: string;
  initialize: () => void;
  fetchData: () => Promise<void>;
  startIntervention: (qrUid: string, machineId: string) => Promise<void>;
  endIntervention: (machineId: string) => Promise<void>;
  addLog: (message: string, type?: LogEntry['type']) => void;
  syncStatus: (data: any) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  machineState: 'RUNNING',
  stateDuration: 0,
  activeIntervention: null,
  technicians: [
    { id: '1', name: 'Ahmed', role: 'Technician', rfid_uid: '37EECE86', qr_uid: '37EECE86', status: 'Available', interventions_count: 0, escalations_count: 0, successful_repairs: 0, avatar: '👤' },
    { id: '2', name: 'Aziz', role: 'Technician', rfid_uid: '4711CFB6', qr_uid: '4711CFB6', status: 'Available', interventions_count: 0, escalations_count: 0, successful_repairs: 0, avatar: '👤' },
    { id: '3', name: 'Chef Ligne', role: 'Line Lead', rfid_uid: 'D455D886', qr_uid: 'D455D886', status: 'Available', interventions_count: 0, escalations_count: 0, successful_repairs: 0, avatar: '👔' },
    { id: '4', name: 'Chef Atelier', role: 'Workshop Lead', rfid_uid: '86EC12BF', qr_uid: '86EC12BF', status: 'Available', interventions_count: 0, escalations_count: 0, successful_repairs: 0, avatar: '💼' },
  ],
  logs: [],
  history: [],
  stats: {
    failures: 0,
    repairs: 0,
    escalations: 0,
    maintenance: 0,
    critical: 0,
  },
  nodeRedStatus: 'disconnected',
  nodeRedUrl: 'http://localhost:1880',

  login: async (username: string, password: string) => {
    if (username === 'PFE26' && password === 'PFE2026') {
      set({ isAuthenticated: true });
      get().initialize();
      return true;
    }
    return false;
  },

  logout: () => {
    mqttService.disconnect();
    set({ isAuthenticated: false });
  },

  initialize: () => {
    mqttService.connect();
    mqttService.subscribe((_topic: string, _message: any) => {
      // MQTT messages handled in components
    });
    get().fetchData();
  },

  fetchData: async () => {
    try {
      const [machine, techs, historyData, stats] = await Promise.all([
        machineService.getStatus(),
        technicianService.getAll(),
        historyService.getMachineHistory(),
        reportsService.getDashboard(),
      ]);

      set({
        technicians: techs.data,
        machineState: machine.data.state,
        stateDuration: machine.data.state_duration,
        activeIntervention: machine.data.active_intervention || null,
        history: historyData.data,
        stats: {
          failures: stats.data.machine_failures || 0,
          repairs: stats.data.successful_repairs || 0,
          escalations: stats.data.escalations || 0,
          maintenance: stats.data.maintenance_starts || 0,
          critical: stats.data.critical_events || 0,
        },
        nodeRedStatus: 'connected',
      });
    } catch (error) {
      console.warn('[Store] API offline, using mock data');
      set({ nodeRedStatus: 'disconnected' });
    }
  },

  startIntervention: async (qrUid: string, machineId: string) => {
    try {
      const response = await interventionService.start({ qr_uid: qrUid, machine_id: machineId });
      if (response.success) {
        get().addLog(`Intervention started by ${response.data.technician_name}`, 'success');
        set({ activeIntervention: response.data, machineState: 'MAINTENANCE' });
      }
    } catch (error: any) {
      get().addLog(`Start Failed: ${error.message}`, 'error');
    }
  },

  endIntervention: async (machineId: string) => {
    try {
      const response = await interventionService.end({ machine_id: machineId });
      if (response.success) {
        get().addLog('Intervention ended', 'success');
        set({ activeIntervention: null, machineState: 'RUNNING' });
      }
    } catch (error: any) {
      get().addLog(`End Failed: ${error.message}`, 'error');
    }
  },

  addLog: (message: string, type: LogEntry['type'] = 'info') =>
    set((state) => ({
      logs: [{ id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), message, type }, ...state.logs].slice(0, 50),
    })),

  syncStatus: (data: any) => {
    if (data.type === 'MACHINE_UPDATE') {
      set({
        machineState: data.state,
        activeIntervention: data.active_intervention || null,
        stateDuration: data.duration || 0,
      });
    }
    if (data.type === 'TECHNICIAN_UPDATE') {
      set({ technicians: data.technicians });
    }
    if (data.type === 'LOG') {
      get().addLog(data.message, data.logType);
    }
  },
}));
