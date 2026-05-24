# 🔌 Web App + Node-RED Connection Guide

## Quick Start

### 1. Configure Web App for Your Network

Create `.env` file in the web app root:

```env
VITE_NODE_RED_URL=http://192.168.1.100:1880
```

Replace `192.168.1.100` with your **Node-RED server IP address**.

### 2. Import Node-RED Flow

1. Open Node-RED (http://localhost:1880)
2. Click **Menu** (☰) → **Import**
3. Copy content from `node-red/flows.json`
4. Paste and click **Import**
5. Click **Deploy**

### 3. Create SQLite Database Tables

Add this to your Node-RED flow (or run manually):

```sql
-- technicians table
CREATE TABLE IF NOT EXISTS technicians (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    rfid_uid TEXT UNIQUE,
    qr_uid TEXT UNIQUE,
    status TEXT DEFAULT 'Available',
    interventions_count INTEGER DEFAULT 0,
    escalations_count INTEGER DEFAULT 0,
    successful_repairs INTEGER DEFAULT 0
);

-- machine_state table
CREATE TABLE IF NOT EXISTS machine_state (
    id TEXT PRIMARY KEY,
    name TEXT,
    state TEXT DEFAULT 'RUNNING',
    state_duration INTEGER DEFAULT 0,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    active_intervention_id TEXT
);

-- interventions table
CREATE TABLE IF NOT EXISTS interventions (
    id TEXT PRIMARY KEY,
    machine_id TEXT,
    technician_id TEXT,
    technician_name TEXT,
    start_time DATETIME,
    end_time DATETIME,
    status TEXT DEFAULT 'active',
    mode TEXT DEFAULT 'app',
    result TEXT
);

-- machine_events table
CREATE TABLE IF NOT EXISTS machine_events (
    id TEXT PRIMARY KEY,
    machine_id TEXT,
    event_type TEXT,
    technician_name TEXT,
    technician_uid TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    result TEXT
);

-- Insert sample technicians
INSERT OR REPLACE INTO technicians VALUES 
    ('1', 'Ahmed', 'Technician', '37EECE86', '37EECE86', 'Available', 0, 0, 0),
    ('2', 'Aziz', 'Technician', '4711CFB6', '4711CFB6', 'Available', 0, 0, 0),
    ('3', 'Chef Ligne', 'Line Lead', 'D455D886', 'D455D886', 'Available', 0, 0, 0),
    ('4', 'Chef Atelier', 'Workshop Lead', '86EC12BF', '86EC12BF', 'Available', 0, 0, 0);

-- Insert initial machine state
INSERT OR REPLACE INTO machine_state VALUES 
    ('M1', 'Machine M1', 'RUNNING', 0, datetime('now'), NULL);
```

### 4. Test Connection

**From web app:**
```bash
npm run dev
```

Open browser to `http://localhost:5173` and login with:
- Username: `PFE26`
- Password: `PFE2026`

**Test API directly:**
```bash
curl http://192.168.1.100:1880/api/technicians
curl http://192.168.1.100:1880/api/machine/status
```

---

## 📡 Complete Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WEB APP (React + Vite)                          │
│  http://localhost:5173  or  http://192.168.1.X:5173                     │
│                                                                         │
│  • Login Page                                                           │
│  • Dashboard                                                            │
│  • Machine M1 (QR Scanner)                                              │
│  • Technicians                                                          │
│  • History                                                              │
│  • Reports                                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST API
                                    │ WebSocket (Socket.IO)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         NODE-RED (Backend)                               │
│  http://192.168.1.100:1880                                              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ API Endpoints:                                               │       │
│  │ GET  /api/technicians                                        │       │
│  │ GET  /api/machine/status                                     │       │
│  │ POST /api/intervention/start                                 │       │
│  │ POST /api/intervention/end                                   │       │
│  │ GET  /api/reports                                            │       │
│  │ GET  /api/history/machine                                    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ Socket.IO Events:                                            │       │
│  │ → machine:state                                              │       │
│  │ → intervention:update                                        │       │
│  │ → technician:status                                          │       │
│  │ → event:log                                                  │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ SQLite Database:                                             │       │
│  │ • technicians                                                │       │
│  │ • machine_state                                              │       │
│  │ • interventions                                              │       │
│  │ • machine_events                                             │       │
│  └─────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ MQTT (port 1883)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MQTT BROKER (EMQX)                               │
│  broker.emqx.io:1883  or  local broker                                  │
│                                                                         │
│  Topics:                                                                │
│  • factory/machine/+/state                                              │
│  • factory/machine/+/cmd                                                │
│  • factory/intervention/+                                               │
│  • factory/technician/+/status                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ MQTT
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ESP32 (Physical Device)                          │
│                                                                         │
│  • Reads: factory/machine/M1/cmd                                        │
│  • Publishes: factory/machine/M1/state                                  │
│  • Controls: LEDs, RFID Reader, Buttons                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Node-RED Flow Configuration

### Required Nodes

Install via **Manage Palette** → **Install**:

| Package | Purpose |
|---------|---------|
| `node-red-contrib-socketio` | WebSocket communication |
| `node-red-dashboard` | UI (optional) |
| `node-red-contrib-cors` | CORS headers |
| `node-red-contrib-sqlite` | Database |

### CORS Configuration

Add this **function node** at the start of each API endpoint:

```javascript
msg.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
    'Content-Type': 'application/json'
};
return msg;
```

Or use **http response** node with headers set.

---

## 🌐 Network Configuration

### Find Your Node-RED IP

**Windows:**
```cmd
ipconfig
```

**Linux/Mac:**
```bash
ifconfig
# or
ip addr
```

Look for your local IP (e.g., `192.168.1.100`).

### Update Web App .env

```env
VITE_NODE_RED_URL=http://192.168.1.100:1880
```

### Allow External Access to Node-RED

In Node-RED `settings.js`:

```javascript
ui: {
    path: "/ui"
},
httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
},
```

---

## 📱 Mobile/Phone Access

### Option 1: Deploy Web App to Same Server

```bash
npm run build
# Copy dist/ folder to Node-RED server
# Serve via nginx or Node-RED static file node
```

### Option 2: Access via Network IP

```bash
# In vite.config.ts, ensure:
server: {
  host: '0.0.0.0',
  port: 5173
}

# Then access from phone:
http://192.168.1.X:5173
```

### Option 3: Production Deployment

Build and host on any web server:

```bash
npm run build
# Upload dist/ to:
# - nginx
# - Apache
# - Vercel
# - Netlify
# - Docker container
```

Update `.env` with production Node-RED URL.

---

## 🗄️ Database Schema

### Full SQLite Schema

```sql
-- Technicians
CREATE TABLE technicians (
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

-- Machine State
CREATE TABLE machine_state (
    id TEXT PRIMARY KEY,
    name TEXT,
    state TEXT DEFAULT 'RUNNING',
    state_duration INTEGER DEFAULT 0,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    active_intervention_id TEXT,
    location TEXT
);

-- Interventions
CREATE TABLE interventions (
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

-- Machine Events (History)
CREATE TABLE machine_events (
    id TEXT PRIMARY KEY,
    machine_id TEXT NOT NULL,
    machine_name TEXT,
    event_type TEXT NOT NULL,
    technician_name TEXT,
    technician_uid TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    result TEXT
);

-- Reports Cache (optional, for performance)
CREATE TABLE reports_cache (
    id TEXT PRIMARY KEY,
    date DATE UNIQUE,
    machine_failures INTEGER DEFAULT 0,
    successful_repairs INTEGER DEFAULT 0,
    escalations INTEGER DEFAULT 0,
    maintenance_starts INTEGER DEFAULT 0,
    critical_events INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_interventions_machine ON interventions(machine_id);
CREATE INDEX idx_interventions_technician ON interventions(technician_id);
CREATE INDEX idx_events_machine ON machine_events(machine_id);
CREATE INDEX idx_events_timestamp ON machine_events(timestamp DESC);
```

---

## 🔄 Intervention Workflow Implementation

### Classic Mode (RFID Only)

```
[ESP32] Failure Button Pressed
   │
   ├─ MQTT: factory/machine/M1/state { state: "FAILURE" }
   │
   ▼
[Node-RED] MQTT In Node
   │
   ├─ Update SQLite: machine_state SET state='FAILURE'
   ├─ Emit Socket: machine:state
   │
   ▼
[Web App] Dashboard shows "FAILURE"

---

[ESP32] RFID Scan (Any Technician)
   │
   ├─ MQTT: factory/machine/M1/rfid { uid: "37EECE86" }
   │
   ▼
[Node-RED] Validate RFID
   │
   ├─ Check technician exists
   ├─ Update machine_state SET state='MAINTENANCE'
   ├─ MQTT: factory/machine/M1/cmd { command: "MAINTENANCE" }
   ├─ Emit Socket: machine:state
   │
   ▼
[ESP32] Orange LED ON

---

[ESP32] Same RFID Scan Again
   │
   ├─ MQTT: factory/machine/M1/rfid { uid: "37EECE86" }
   │
   ▼
[Node-RED] End Intervention
   │
   ├─ Update interventions SET status='completed'
   ├─ Update machine_state SET state='RUNNING'
   ├─ MQTT: factory/machine/M1/cmd { command: "RUNNING" }
   │
   ▼
[ESP32] Green LED ON
```

### App Intervention Mode (QR + API)

```
[Web App] Scan Technician QR
   │
   ├─ POST /api/intervention/start { qr_uid: "37EECE86", machine_id: "M1" }
   │
   ▼
[Node-RED] Validate QR
   │
   ├─ SELECT * FROM technicians WHERE qr_uid = '37EECE86'
   ├─ INSERT INTO interventions (...)
   ├─ Update machine_state SET state='MAINTENANCE'
   ├─ MQTT: factory/machine/M1/cmd { command: "MAINTENANCE" }
   ├─ Emit Socket: machine:state, intervention:update
   │
   ▼
[Web App] Shows "MAINTENANCE" + Technician Name
[ESP32] Orange LED ON

---

[Web App] Click "End Intervention"
   │
   ├─ POST /api/intervention/end { machine_id: "M1" }
   │
   ▼
[Node-RED] End Intervention
   │
   ├─ UPDATE interventions SET status='completed'
   ├─ Update machine_state SET state='RUNNING'
   ├─ MQTT: factory/machine/M1/cmd { command: "RUNNING" }
   │
   ▼
[Web App] Shows "RUNNING"
[ESP32] Green LED ON
```

---

## 🐛 Troubleshooting

### Web App Can't Connect to Node-RED

1. **Check CORS**: Ensure Node-RED API returns CORS headers
2. **Check IP**: Verify `VITE_NODE_RED_URL` matches Node-RED server IP
3. **Check Firewall**: Allow port 1880 on Node-RED machine
4. **Test API**: `curl http://NODE-RED-IP:1880/api/technicians`

### Socket.IO Not Connecting

1. Install `node-red-contrib-socketio`
2. Add Socket.IO server node to flow
3. Check browser console for connection errors
4. Verify WebSocket is not blocked by firewall

### MQTT Not Working

1. Check broker address (emqx.io or local)
2. Verify ESP32 and Node-RED use same broker
3. Check topic names match exactly
4. Use MQTT.fx to debug topics

### Database Errors

1. Ensure `maintain.db` file exists
2. Check SQLite node configuration
3. Verify table schema matches queries
4. Check file permissions

---

## 📦 Deployment Options

### Option 1: All-in-One Server

Run everything on one machine:
- Node-RED (port 1880)
- Web App (port 5173 dev, 80 prod)
- MQTT Broker (port 1883)
- SQLite (local file)

### Option 2: Distributed

- **ESP32**: Factory floor
- **MQTT Broker**: Cloud (EMQX) or Raspberry Pi
- **Node-RED + SQLite**: Server/PC
- **Web App**: Hosted (Vercel/Netlify) or local

### Option 3: Docker

```dockerfile
# docker-compose.yml
version: '3'
services:
  node-red:
    image: nodered/node-red
    ports:
      - "1880:1880"
    volumes:
      - ./data:/data
  
  emqx:
    image: emqx/emqx
    ports:
      - "1883:1883"
      - "18083:18083"
  
  web-app:
    build: .
    ports:
      - "80:80"
```

---

## ✅ Connection Checklist

- [ ] Node-RED flow imported and deployed
- [ ] SQLite database created with tables
- [ ] Sample technicians inserted
- [ ] `.env` file configured with correct IP
- [ ] CORS enabled on Node-RED
- [ ] Socket.IO node configured
- [ ] MQTT broker connected
- [ ] Web app builds successfully
- [ ] API endpoints respond (test with curl)
- [ ] WebSocket connects (check browser console)
- [ ] Login works (PFE26 / PFE2026)
- [ ] Dashboard shows data
- [ ] QR scanner works on Machine page
- [ ] Intervention start/end works
- [ ] Realtime updates working

---

## 📞 Need Help?

Check these logs:

**Web App:**
```bash
# Browser DevTools → Console
# Look for API errors, WebSocket errors
```

**Node-RED:**
```bash
# Node-RED Debug Tab
# Look for flow errors, SQL errors
```

**ESP32:**
```bash
# Serial Monitor (115200 baud)
# Look for MQTT connection status
```
