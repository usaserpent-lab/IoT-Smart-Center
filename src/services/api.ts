// src/services/api.ts

import { fetchNodeRed, postNodeRed } from '../utils/nodeRed';
import type { 
  ApiResponse, 
  Machine, 
  Technician, 
  Intervention, 
  MachineEvent, 
  Reports,
  TechnicianRanking,
  StartInterventionRequest,
  EndInterventionRequest,
} from '../types';

// MACHINE SERVICE
export const machineService = {
  getStatus: async (): Promise<ApiResponse<Machine>> => {
    const data = await fetchNodeRed<any>('/api/machine/status');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  getHistory: async (limit = 50): Promise<ApiResponse<MachineEvent[]>> => {
    const data = await fetchNodeRed<any>(`/api/history/machine?limit=${limit}`);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },
};

// INTERVENTION SERVICE
export const interventionService = {
  start: async (request: StartInterventionRequest): Promise<ApiResponse<Intervention>> => {
    const data = await postNodeRed<any>('/api/intervention/start', request);
    return {
      success: data.success || data.ok || true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  end: async (request: EndInterventionRequest): Promise<ApiResponse<Intervention>> => {
    const data = await postNodeRed<any>('/api/intervention/end', request);
    return {
      success: data.success || data.ok || true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  getActive: async (): Promise<ApiResponse<Intervention | null>> => {
    try {
      const data = await fetchNodeRed<any>('/api/intervention/active');
      return {
        success: true,
        timestamp: new Date().toISOString(),
        data: data.data || data,
      };
    } catch {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        data: null,
      };
    }
  },
};

// TECHNICIAN SERVICE
export const technicianService = {
  getAll: async (): Promise<ApiResponse<Technician[]>> => {
    const data = await fetchNodeRed<any>('/api/technicians');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  getProfile: async (uid: string): Promise<ApiResponse<Technician>> => {
    const data = await fetchNodeRed<any>(`/api/technicians/${uid}`);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  getRanking: async (): Promise<ApiResponse<TechnicianRanking[]>> => {
    const data = await fetchNodeRed<any>('/api/technicians/ranking');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  getHistory: async (uid: string): Promise<ApiResponse<Intervention[]>> => {
    const data = await fetchNodeRed<any>(`/api/technicians/${uid}/history`);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },
};

// REPORTS SERVICE
export const reportsService = {
  getDashboard: async (): Promise<ApiResponse<Reports>> => {
    const data = await fetchNodeRed<any>('/api/reports');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },
};

// HISTORY SERVICE
export const historyService = {
  getMachineHistory: async (limit = 50): Promise<ApiResponse<MachineEvent[]>> => {
    const data = await fetchNodeRed<any>(`/api/history/machine?limit=${limit}`);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },

  getTechnicianHistory: async (uid: string, limit = 50): Promise<ApiResponse<Intervention[]>> => {
    const data = await fetchNodeRed<any>(`/api/history/technician?id=${uid}&limit=${limit}`);
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data || data,
    };
  },
};

export default { fetchNodeRed, postNodeRed };