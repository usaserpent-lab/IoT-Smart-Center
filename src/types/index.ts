// ============================================
// CORE TYPES - Industrial Maintenance System
// ============================================

export type MachineState = 'RUNNING' | 'FAILURE' | 'MAINTENANCE' | 'CRITICAL' | 'ESCALATION';

export type TechnicianStatus = 
  | 'Available' 
  | 'Maintaining' 
  | 'Sleep Mode' 
  | 'Escalation' 
  | 'Restarting';

export type InterventionStatus = 'active' | 'completed' | 'cancelled';

export type InterventionMode = 'classic' | 'app';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// ============================================
// DATA MODELS
// ============================================

export interface Technician {
  id: string;
  name: string;
  role: string;
  rfid_uid: string;
  qr_uid: string;
  status: TechnicianStatus;
  current_machine?: string;
  interventions_count: number;
  escalations_count: number;
  successful_repairs: number;
  avatar: string;
  last_intervention?: string;
}

export interface Machine {
  id: string;
  name: string;
  state: MachineState;
  state_duration: number;
  last_update: string;
  active_intervention?: Intervention;
  location: string;
}

export interface Intervention {
  id: string;
  machine_id: string;
  machine_name: string;
  technician_id: string;
  technician_name: string;
  technician_uid: string;
  start_time: string;
  end_time?: string;
  status: InterventionStatus;
  mode: InterventionMode;
  result?: 'success' | 'failure' | 'escalation';
}

export interface MachineEvent {
  id: string;
  machine_id: string;
  machine_name: string;
  event_type: MachineState;
  technician_name?: string;
  technician_uid?: string;
  timestamp: string;
  result?: string;
}

export interface Reports {
  machine_failures: number;
  successful_repairs: number;
  escalations: number;
  maintenance_starts: number;
  critical_events: number;
  running_machines: number;
  maintenance_machines: number;
  technicians_available: number;
}

export interface TechnicianRanking {
  rank: number;
  technician_id: string;
  name: string;
  quality_score: number;
  interventions: number;
  tech_failures: number;
  escalations: number;
  status: TechnicianStatus;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface StartInterventionRequest {
  qr_uid: string;
  machine_id: string;
}

export interface EndInterventionRequest {
  machine_id: string;
  technician_uid?: string;
}

// ============================================
// MQTT MESSAGE TYPES
// ============================================

export interface MqttMachineUpdate {
  type: 'MACHINE_UPDATE';
  machine_id: string;
  state: MachineState;
  duration: number;
  active_intervention?: Intervention;
  timestamp: string;
}

export interface MqttInterventionUpdate {
  type: 'INTERVENTION_UPDATE';
  intervention: Intervention;
  action: 'started' | 'ended' | 'updated';
  timestamp: string;
}

export interface MqttTechnicianUpdate {
  type: 'TECHNICIAN_UPDATE';
  technicians: Technician[];
  timestamp: string;
}

export interface MqttEventLog {
  type: 'LOG';
  message: string;
  logType: 'info' | 'warning' | 'error' | 'success';
  machine_id?: string;
  technician_id?: string;
  timestamp: string;
}

export type MqttMessage = 
  | MqttMachineUpdate 
  | MqttInterventionUpdate 
  | MqttTechnicianUpdate 
  | MqttEventLog;

// ============================================
// NODE-RED API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  
  // Machine
  MACHINE_STATUS: '/api/machine/status',
  MACHINE_HISTORY: '/api/machine/history',
  
  // Interventions
  INTERVENTION_START: '/api/intervention/start',
  INTERVENTION_END: '/api/intervention/end',
  INTERVENTION_ACTIVE: '/api/intervention/active',
  
  // Technicians
  TECHNICIANS: '/api/technicians',
  TECHNICIAN_PROFILE: '/api/technicians/:uid',
  TECHNICIAN_RANKING: '/api/technicians/ranking',
  TECHNICIAN_HISTORY: '/api/technicians/:uid/history',
  
  // Reports
  REPORTS: '/api/reports',
  REPORTS_DAILY: '/api/reports/daily',
  
  // History
  HISTORY_MACHINE: '/api/history/machine',
  HISTORY_TECHNICIAN: '/api/history/technician',
} as const;

// ============================================
// MQTT TOPICS
// ============================================

export const MQTT_TOPICS = {
  MACHINE_STATE: 'factory/machine/+/state',
  INTERVENTION: 'factory/intervention/+',
  TECHNICIAN: 'factory/technician/+/status',
  EVENTS: 'factory/events',
  COMMANDS: 'factory/machine/+/cmd',
} as const;
