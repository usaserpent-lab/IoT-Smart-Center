# ✅ Connection Checklist: Web App → Node-RED

## Quick Connection Guide (5 Minutes)

### Step 1: Find Your Node-RED IP Address ⏱️ 30 seconds

**Windows:**
```cmd
ipconfig
```
Look for **IPv4 Address** (e.g., `192.168.1.100`)

**Linux/Mac:**
```bash
ifconfig
```
Look for **inet** address

---

### Step 2: Update Web App Configuration ⏱️ 1 minute

Create/edit `.env` file in web app root:

```env
VITE_NODE_RED_URL=http://YOUR-IP-HERE:1880
```

Example:
```env
VITE_NODE_RED_URL=http://192.168.1.100:1880
```

---

### Step 3: Import Node-RED Flow ⏱️ 2 minutes

1. Open Node-RED: http://localhost:1880
2. Click **Menu** (☰) → **Import**
3. Open `node-red/flows.json` from this repo
4. Copy all content
5. Paste into import dialog
6. Click **Import**
7. Click **Deploy** (top right)

---

### Step 4: Create Database Tables ⏱️ 1 minute

1. In Node-RED, add a **sqlite** node
2. Database: `maintain.db`
3. SQL Query: Copy content from `node-red/database_schema.sql`
4. Deploy

Or run manually:
```bash
sqlite3 maintain.db < node-red/database_schema.sql
```

---

### Step 5: Test Connection ⏱️ 1 minute

**Start web app:**
```bash
npm run dev
```

**Open browser:** http://localhost:5173

**Login:**
- Username: `PFE26`
- Password: `PFE2026`

**Test API directly:**
```bash
curl http://YOUR-IP:1880/api/technicians
```

Should return JSON with technician list.

---

## 🔍 Troubleshooting

### ❌ "API Offline" in Web App

**Check:**
1. Node-RED is running
2. Flow is deployed (green checkmark)
3. IP address in `.env` is correct
4. Port 1880 is not blocked by firewall

**Test:**
```bash
curl http://YOUR-IP:1880/api/technicians
```

---

### ❌ "Cannot connect to server"

**Check:**
1. Node-RED server is on same network
2. Firewall allows port 1880
3. IP address is correct (not localhost if on different machine)

**Windows Firewall:**
```
Control Panel → Windows Defender Firewall → Advanced Settings
→ Inbound Rules → New Rule → Port → TCP 1880 → Allow
```

---

### ❌ QR Scanner Not Working

**Check:**
1. Camera permission granted in browser
2. Using HTTPS (required for camera on some browsers)
3. Browser supports `getUserMedia` API

**Test camera:**
Visit: https://webcamtests.com/

---

### ❌ Realtime Updates Not Working

**Check:**
1. Socket.IO node installed in Node-RED
2. Socket.IO server node configured
3. WebSocket not blocked by firewall

**Test WebSocket:**
Open browser console on web app, look for:
```
[MQTT] Connected to Node-RED
```

---

## 📱 Mobile Access

### Access from Phone

1. Ensure phone is on same WiFi network
2. Find your computer's IP (Step 1)
3. On phone browser: `http://YOUR-IP:5173`

**If using vite dev server:**
Ensure `vite.config.ts` has:
```ts
server: {
  host: '0.0.0.0',
  port: 5173
}
```

---

## 🎯 Expected Behavior

### ✅ Working Connection

1. **Login page appears** → Can login with PFE26/PFE2026
2. **Dashboard loads** → Shows "RUNNING" state
3. **Technicians page** → Shows 4 technicians (Ahmed, Aziz, etc.)
4. **Machine page** → QR scanner opens when clicking "Start Intervention"
5. **Realtime updates** → Changes in Node-RED appear instantly in web app

### ❌ Broken Connection

1. **Login works but...** → Dashboard shows "DISCONNECTED"
2. **Technicians page empty** → API not responding
3. **QR scanner errors** → Camera permission or HTTPS issue
4. **No realtime updates** → Socket.IO not configured

---

## 📊 Data Flow Test

### Test Complete Workflow:

1. **Web App** → Open Machine M1 page
2. **Click** → "Start Intervention"
3. **Scan** → Any QR code (or type test UID)
4. **Check** → Web app shows "MAINTENANCE" state
5. **Check** → Node-RED debug shows intervention created
6. **Click** → "End Intervention"
7. **Check** → Web app shows "RUNNING" state
8. **Check** → History page shows new entry

---

## 🔐 Security Notes

### For Production:

- [ ] Change default login credentials
- [ ] Enable HTTPS for web app
- [ ] Add authentication to Node-RED API
- [ ] Use environment variables for sensitive data
- [ ] Don't commit `.env` to GitHub
- [ ] Don't commit `flows_cred.json` to GitHub

### Current Defaults:

```
Web App Login: PFE26 / PFE2026
Node-RED Admin: (none by default)
MQTT Broker: broker.emqx.io (public)
```

---

## 📞 Still Having Issues?

1. **Check Node-RED Debug Tab** → Shows flow errors
2. **Check Browser Console** → Shows API/WebSocket errors
3. **Check ESP32 Serial Monitor** → Shows MQTT status
4. **Review SETUP_GUIDE.md** → Detailed instructions
5. **Review ARCHITECTURE.md** → System overview

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Web app login succeeds
- ✅ Dashboard shows machine state
- ✅ Technicians list displays 4 names
- ✅ QR scanner activates on Machine page
- ✅ Intervention start/end works
- ✅ History page shows events
- ✅ Reports show statistics
- ✅ Realtime updates appear without refresh
- ✅ Mobile access works from phone
- ✅ ESP32 responds to MQTT commands

**Congratulations! Your system is fully connected! 🎉**
