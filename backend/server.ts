import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/sensors', async (req, res) => {
  const sensors = await prisma.sensorData.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' }
  });
  res.json(sensors);
});

app.post('/api/interventions', async (req, res) => {
  const intervention = await prisma.intervention.create({
    data: req.body
  });
  res.json(intervention);
});

// Node-RED Webhook
app.post('/api/node-red/webhook', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'sensor_update') {
    io.emit('sensor_update', data);
    // Optionally save to DB
    await prisma.sensorData.create({ data });
  }
  
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('Client connected');
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
