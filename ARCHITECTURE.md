# Maintain-App Architecture

Industrial Maintenance Web Companion for ESP32 + Node-RED + MQTT + SQLite System

## 🏗️ System Architecture

```
┌─────────────┐      MQTT       ┌─────────────┐     HTTP/WS     ┌─────────────┐
│   ESP32     │◄───────────────►│  Node-RED   │◄───────────────►│  Web App    │
│  + RFID     │                 │  + SQLite   │                 │  (React)    │
│  + LEDs     │                 │  Backend    │                 │             │
└─────────────┘                 └─────────────┘                 └─────────────┘
     │                                │                                │
     │ • Machine States               │ • Workflow Logic               │ • UI/UX
     │ • RFID Scans                   │ • Database                     │ • QR Scanner
     │ • Failure Button               │ • MQTT Broker                  │ • Realtime Updates
     └────────────────────────────────┴────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── types/              # TypeScript interfaces & type definitions
│   └── index.ts        # All types (Machine, Technician, Intervention, etc.)
│
├── services/           # API & Communication layer
│   ├── api.ts          # REST API client (axios)
│   └── mqtt.ts         # MQTT/Socket.IO realtime service
│
├── hooks/              # React custom hooks
│   └── useRealtime.ts  # Realtime data synchronization hooks
│
├── store/              # State management (Zustand)
│   └── useStore.ts     # Global application state
│
├── features/           # Feature-based pages
│   ├── auth/           # Login page
│   ├── dashboard/      # Main dashboard
│   ├── machine/        # Machine M1 intervention workflow
│   ├── technicians/    # Technician management
│   ├── history/        # Intervention history
│   ├── reports/        # Analytics & reports
│   └── settings/       # System configuration
│
├── components/         # Reusable UI components
│   └── layout/         # Layout components (sidebar, header)
│
└── utils/              # Helper functions
    └── cn.ts           # Class name utility
```

## 🔌 Node-RED Integration

### Required API Endpoints

The frontend expects these endpoints from Node-RED:

#### Authentication
```
POST /api/auth/login
POST /api/auth/logout
```

#### Machine
```
GET  /api/machine/status          → Current machine state
GET  /api/machine/history?limit=50 → Machine event history
```

#### Interventions
```
POST /api/intervention/start   → { qr_uid, machine_id }
POST /api/intervention/end     → { machine_id }
GET  /api/intervention/active  → Current active intervention
```

#### Technicians
```
GET  /api/technicians              → List all technicians
GET  /api/technicians/:uid         → Get technician profile
GET  /api/technicians/ranking      → Quality ranking
GET  /api/technicians/:uid/history → Technician intervention history
```

#### Reports
```
GET /api/reports        → Dashboard statistics
GET /api/reports/daily  → Daily summary
```

#### History
```
GET /api/history/machine?machine_id=M1&limit=50
GET /api/history/technician?technician_uid=XXX&limit=50
```

### WebSocket Events (Socket.IO)

Node-RED should emit these events for realtime updates:

```javascript
// Machine state changes
socket.emit('machine:state', {
  id: 'M1',
  state: 'RUNNING' | 'FAILURE' | 'MAINTENANCE',
  state_duration: 123,
  active_intervention: {...}
});

// Intervention updates
socket.emit('intervention:update', {
  id: 'INT-123',
  machine_id: 'M1',
  technician_name: 'Ahmed',
  start_time: '2024-...',
  status: 'active'
});

// Technician status
socket.emit('technician:status', [
  { id: '1', name: 'Ahmed', status: 'Maintaining', ... }
]);

// Event logs
socket.emit('event:log', {
  message: 'Intervention started',
  logType: 'info' | 'warning' | 'error' | 'success',
  machine_id: 'M1'
});
```

## 📡 MQTT Topics

ESP32 and Node-RED communicate via these MQTT topics:

```
factory/machine/+/state      # Machine state updates
factory/intervention/+       # Intervention commands
factory/technician/+/status  # Technician status
factory/events               # Event log
factory/machine/+/cmd        # Control commands
```

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_NODE_RED_URL=http://192.168.1.100:1880
VITE_MQTT_BROKER_URL=broker.emqx.io
VITE_MQTT_BROKER_PORT=1883
```

## 🎯 Intervention Workflows

### Classic Mode (RFID Only)
```
RUNNING → [Failure Button] → FAILURE
FAILURE → [RFID Scan] → MAINTENANCE
MAINTENANCE → [Same RFID Scan] → RUNNING
```

### App Intervention Mode (QR + RFID)
```
App: Scan QR → POST /api/intervention/start
Node-RED: Validate QR → Create Intervention → MQTT to ESP32
ESP32: Set MAINTENANCE state → Orange LED

End Options:
1. App: Click "End Intervention" button
2. Physical: Same technician RFID scan (ONCE)

Node-RED handles logic to prevent conflicts between modes.
```

## 📱 Realtime Technician Status

Technician statuses are managed by Node-RED based on system state:

- **Available** → No active intervention
- **Maintaining** → Active intervention on machine
- **Sleep Mode** → Inactive for extended period
- **Escalation** → Multiple failed interventions
- **Restarting** → Machine restart after repair

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Connect to Node-RED
1. Update `VITE_NODE_RED_URL` in `.env`
2. Ensure Node-RED has Socket.IO configured
3. Deploy Node-RED flows with API endpoints

## 📊 Data Flow Example

```
1. User scans QR in app
   ↓
2. Frontend → POST /api/intervention/start { qr_uid: "ABC123", machine_id: "M1" }
   ↓
3. Node-RED validates QR against SQLite technicians table
   ↓
4. Node-RED creates intervention record in SQLite
   ↓
5. Node-RED publishes MQTT: factory/machine/M1/cmd { command: "MAINTENANCE" }
   ↓
6. ESP32 receives MQTT, sets orange LED, updates state
   ↓
7. Node-RED emits WebSocket: machine:state { state: "MAINTENANCE", ... }
   ↓
8. Frontend receives update, UI shows "MAINTENANCE" state
```

## 🔧 Adding New Features

1. **New API Endpoint**: Add to `src/services/api.ts`
2. **New Type**: Add to `src/types/index.ts`
3. **New Page**: Create in `src/features/[feature]/`
4. **Realtime Event**: Add to `src/services/mqtt.ts`
5. **State**: Update `src/store/useStore.ts`

## 📝 Notes

- All business logic stays in Node-RED
- Frontend is presentation + user interaction only
- Mock data is used when Node-RED is offline
- All API calls have fallback mock responses for development
- TypeScript ensures type safety across the entire stack
