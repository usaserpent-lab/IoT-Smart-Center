-- ============================================
-- Maintain App Database Schema
-- For Node-RED SQLite Node
-- ============================================

-- Technicians Table
CREATE TABLE IF NOT EXISTS technicians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    rfid_uid TEXT UNIQUE NOT NULL,
    qr_uid TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'Available',
    current_machine TEXT,
    interventions_count INTEGER DEFAULT 0,
    escalations_count INTEGER DEFAULT 0,
    successful_repairs INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Machine State Table
CREATE TABLE IF NOT EXISTS machine_state (
    id TEXT PRIMARY KEY,
    name TEXT,
    state TEXT DEFAULT 'RUNNING',
    state_duration INTEGER DEFAULT 0,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    active_intervention_id TEXT,
    location TEXT
);

-- Interventions Table
CREATE TABLE IF NOT EXISTS interventions (
    id TEXT PRIMARY KEY,
    machine_id TEXT NOT NULL,
    machine_name TEXT,
    technician_id TEXT,
    technician_name TEXT,
    technician_uid TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status TEXT DEFAULT 'active',
    mode TEXT DEFAULT 'app',
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Machine Events Table (History)
CREATE TABLE IF NOT EXISTS machine_events (
    id TEXT PRIMARY KEY,
    machine_id TEXT NOT NULL,
    machine_name TEXT,
    event_type TEXT NOT NULL,
    technician_name TEXT,
    technician_uid TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    result TEXT
);

-- Reports Cache Table (Optional - for performance)
CREATE TABLE IF NOT EXISTS reports_cache (
    id TEXT PRIMARY KEY,
    date DATE UNIQUE,
    machine_failures INTEGER DEFAULT 0,
    successful_repairs INTEGER DEFAULT 0,
    escalations INTEGER DEFAULT 0,
    maintenance_starts INTEGER DEFAULT 0,
    critical_events INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_interventions_machine ON interventions(machine_id);
CREATE INDEX IF NOT EXISTS idx_interventions_technician ON interventions(technician_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);
CREATE INDEX IF NOT EXISTS idx_events_machine ON machine_events(machine_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON machine_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON machine_events(event_type);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_rfid ON technicians(rfid_uid);
CREATE INDEX IF NOT EXISTS idx_technicians_qr ON technicians(qr_uid);

-- ============================================
-- Sample Data (Insert on First Setup)
-- ============================================

-- Insert Sample Technicians
INSERT OR REPLACE INTO technicians (id, name, role, rfid_uid, qr_uid, status) VALUES 
    ('1', 'Ahmed', 'Technician', '37EECE86', '37EECE86', 'Available'),
    ('2', 'Aziz', 'Technician', '4711CFB6', '4711CFB6', 'Available'),
    ('3', 'Chef Ligne', 'Line Lead', 'D455D886', 'D455D886', 'Available'),
    ('4', 'Chef Atelier', 'Workshop Lead', '86EC12BF', '86EC12BF', 'Available');

-- Insert Initial Machine State
INSERT OR REPLACE INTO machine_state (id, name, state, state_duration, location) VALUES 
    ('M1', 'Machine M1', 'RUNNING', 0, 'factory/line1');

-- ============================================
-- Useful Queries for Node-RED Functions
-- ============================================

-- Get technician by QR/RFID
-- SELECT * FROM technicians WHERE qr_uid = $qr_uid OR rfid_uid = $rfid_uid

-- Get current machine state
-- SELECT * FROM machine_state WHERE id = 'M1'

-- Get active intervention
-- SELECT * FROM interventions WHERE machine_id = 'M1' AND status = 'active'

-- Get last 50 machine events
-- SELECT * FROM machine_events WHERE machine_id = 'M1' ORDER BY timestamp DESC LIMIT 50

-- Get technician intervention count
-- SELECT COUNT(*) as count FROM interventions WHERE technician_id = $technician_id

-- Update technician status
-- UPDATE technicians SET status = $status, updated_at = datetime('now') WHERE id = $id

-- Update machine state
-- UPDATE machine_state SET state = $state, state_duration = 0, last_update = datetime('now') WHERE id = $id

-- Insert machine event
-- INSERT INTO machine_events (machine_id, event_type, technician_name, technician_uid, result) 
-- VALUES ($machine_id, $event_type, $technician_name, $technician_uid, $result)

-- ============================================
-- Cleanup/Maintenance Queries (Optional)
-- ============================================

-- Delete old events (older than 30 days)
-- DELETE FROM machine_events WHERE timestamp < datetime('now', '-30 days')

-- Reset all machines to RUNNING (emergency)
-- UPDATE machine_state SET state = 'RUNNING', active_intervention_id = NULL

-- Reset all technicians to Available (emergency)
-- UPDATE technicians SET status = 'Available', current_machine = NULL

-- Archive completed interventions
-- UPDATE interventions SET status = 'archived' WHERE status = 'completed' AND end_time < datetime('now', '-7 days')
