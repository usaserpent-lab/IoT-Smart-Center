# 🏭 Maintain App - Industrial Maintenance System

Complete IoT maintenance solution with ESP32, Node-RED, MQTT, SQLite, and React web interface.

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Overview

This system provides real-time industrial machine monitoring and maintenance tracking with:

- **ESP32 Hardware**: RFID scanner, LEDs, failure button
- **Node-RED Backend**: Workflow logic, SQLite database, MQTT broker
- **React Web App**: Mobile-responsive interface for technicians
- **Realtime Sync**: WebSocket + MQTT for instant updates

## 🏗️ Architecture

```
┌─────────────┐      MQTT       ┌─────────────┐     HTTP/WS     ┌─────────────┐
│   ESP32     │◄───────────────►│  Node-RED   │◄───────────────►│  Web App    │
│  + RFID     │                 │  + SQLite   │                 │  (React)    │
│  + LEDs     │                 │  Backend    │                 │             │
└─────────────┘                 └─────────────┘                 └─────────────┘
```

## 📁 Project Structure

```
.
├── src/                    # React web application
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature pages (Dashboard, Machine, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API & MQTT services
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
│
├── node-red/               # Node-RED flows
│   ├── flows.json          # Main flow (import to Node-RED)
│   ├── database_schema.sql # SQLite table definitions
│   └── README.md           # Node-RED setup guide
│
├── arduino/                # ESP32 firmware
│   └── esp32_logic.ino     # Arduino sketch
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # System architecture
│   └── SETUP_GUIDE.md      # Complete setup instructions
│
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/usaserpent-lab/Maintain-App.git
cd Maintain-App
```

### 2. Install Web App Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Node-RED IP address
```

### 4. Setup Node-RED

1. Open Node-RED (http://localhost:1880)
2. Install packages: `node-red-contrib-socketio`, `node-red-contrib-sqlite`
3. Import `node-red/flows.json`
4. Deploy flow

### 5. Create Database

Run SQL from `node-red/database_schema.sql` in Node-RED SQLite node

### 6. Start Web App

```bash
npm run dev
```

Access at: http://localhost:5173

**Login:**
- Username: `PFE26`
- Password: `PFE2026`

## 🔌 Node-RED Integration

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/technicians` | GET | List technicians |
| `/api/machine/status` | GET | Machine state |
| `/api/intervention/start` | POST | Start intervention |
| `/api/intervention/end` | POST | End intervention |
| `/api/reports` | GET | Dashboard stats |
| `/api/history/machine` | GET | Event history |

### WebSocket Events

- `machine:state` - Machine state updates
- `intervention:update` - Intervention changes
- `technician:status` - Technician status
- `event:log` - System logs

### MQTT Topics

- `factory/machine/+/state` - Machine state (ESP32 → Node-RED)
- `factory/machine/+/cmd` - Commands (Node-RED → ESP32)
- `factory/intervention/+` - Intervention events
- `factory/technician/+/status` - Technician updates

## 📱 Features

### Dashboard
- Real-time machine state
- State duration timer
- Live event log
- Connection status

### Machine M1
- 3-step QR intervention workflow
- Camera QR scanner
- Active intervention display
- Manual end intervention

### Technicians
- QR profile lookup
- Real-time status (Available, Maintaining, etc.)
- Quality ranking table
- Intervention history

### History
- Machine event timeline
- Technician actions
- Filterable logs
- SQLite-backed storage

### Reports
- Failure statistics
- Successful repairs
- Escalation tracking
- Technician performance

## 🔐 Authentication

Simple login system (replace with Node-RED auth in production):

```
Username: PFE26
Password: PFE2026
```

## 🛠️ Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- Socket.IO Client (realtime)
- Axios (HTTP client)
- html5-qrcode (QR scanner)

**Backend:**
- Node-RED (workflow engine)
- SQLite (database)
- Socket.IO (WebSocket)
- MQTT (IoT protocol)

**Hardware:**
- ESP32-WROOM-32
- RFID-RC522
- WS2812B LEDs
- Push buttons

## 📖 Documentation

- **[SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Complete setup instructions
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture details
- **[node-red/README.md](node-red/README.md)** - Node-RED flow documentation

## 🔧 Configuration

### Environment Variables

```env
VITE_NODE_RED_URL=http://192.168.1.100:1880
VITE_MQTT_BROKER_URL=broker.emqx.io
VITE_MQTT_BROKER_PORT=1883
```

### Network Setup

1. Find Node-RED server IP: `ipconfig` or `ifconfig`
2. Update `VITE_NODE_RED_URL` in `.env`
3. Allow port 1880 in firewall
4. Access web app from network: `http://YOUR-IP:5173`

##  Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
# Output: dist/ folder
```

### Docker (Optional)

```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

- **usaserpent-lab** - Initial work

## 🙏 Acknowledgments

- ISET Sousse
- TADREEX
- ESP32 Community
- Node-RED Team

## 📞 Support

For issues and questions:
- Open GitHub Issue
- Check documentation
- Review Node-RED debug logs

---

**Made for industrial maintenance excellence** 🏭
