# Node-RED Flows for Maintain App

## Import Instructions

1. Open Node-RED (http://localhost:1880)
2. Menu (☰) → Import
3. Copy content from `flows.json`
4. Paste and click Import
5. Click Deploy

## Required Packages

Install via Manage Palette:

```
node-red-contrib-socketio
node-red-contrib-sqlite
node-red-dashboard
```

## Configuration

### MQTT Broker

Edit the MQTT broker node with your settings:
- **Broker**: `broker.emqx.io` (cloud) or your local IP
- **Port**: `1883`

### SQLite Database

The flow uses `maintain.db` in Node-RED user directory.

First run: Create tables using SQL in `database_schema.sql`

### Socket.IO

The Socket.IO server node should be configured to:
- **Server**: `http://localhost:1880`
- **Transport**: `websocket,polling`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/technicians` | List all technicians |
| GET | `/api/machine/status` | Current machine state |
| POST | `/api/intervention/start` | Start intervention (QR) |
| POST | `/api/intervention/end` | End intervention |
| GET | `/api/reports` | Dashboard statistics |
| GET | `/api/history/machine` | Machine event history |

## MQTT Topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `factory/machine/+/state` | ESP32 → Node-RED | Machine state updates |
| `factory/machine/+/cmd` | Node-RED → ESP32 | Control commands |
| `factory/intervention/+` | Both | Intervention events |
| `factory/technician/+/status` | Node-RED → Web | Technician status |

## WebSocket Events

| Event | Data | Description |
|-------|------|-------------|
| `machine:state` | Machine object | Machine state changes |
| `intervention:update` | Intervention object | Intervention started/ended |
| `technician:status` | Technician[] array | Technician status updates |
| `event:log` | Log message | System event logs |
| `factory:update` | Any update | General factory updates |

## Troubleshooting

### API Returns 404
- Check flow is deployed
- Verify HTTP In node URLs match exactly
- Check for leading/trailing slashes

### Socket.IO Not Connecting
- Ensure `node-red-contrib-socketio` is installed
- Check Socket.IO server node configuration
- Verify port 1880 is accessible

### MQTT Not Working
- Check broker address and port
- Verify ESP32 uses same broker
- Use MQTT.fx to monitor topics

### Database Errors
- Ensure `maintain.db` exists
- Check table schema matches queries
- Verify file permissions

## Version History

- **v1.0.0** - Initial release with web app integration
  - API endpoints for technicians, machine, interventions
  - Socket.IO realtime updates
  - MQTT integration for ESP32
  - SQLite database storage
