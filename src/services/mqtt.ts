import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = 'wss://broker.emqx.io:8084/mqtt';

export type MessageHandler = (topic: string, message: any) => void;

export class MqttService {
  private client: MqttClient | null = null;
  private handlers: MessageHandler[] = [];
  private isConnected = false;

  connect() {
    if (this.client?.connected) {
      console.log('[MQTT] Already connected');
      return;
    }

    console.log('[MQTT] Connecting to', MQTT_BROKER_URL);

    this.client = mqtt.connect(MQTT_BROKER_URL, {
      clientId: 'webapp_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      reconnectPeriod: 5000,
    });

    this.client.on('connect', () => {
      console.log('[MQTT] Connected to broker');
      this.isConnected = true;
      this.subscribeTopics();
    });

    this.client.on('error', (error: Error) => {
      console.error('[MQTT] Error:', error.message);
      this.isConnected = false;
    });

    this.client.on('message', (topic: string, message: Buffer) => {
      try {
        const parsed = JSON.parse(message.toString());
        console.log('[MQTT] Message received:', topic, parsed);
        this.notifyHandlers(topic, parsed);
      } catch (e) {
        console.warn('[MQTT] Failed to parse message');
      }
    });
  }

  private subscribeTopics() {
    if (!this.client) return;
    
    this.client.subscribe([
      'factory/machine/+/state',
      'factory/machine/+/cmd',
      'factory/intervention/+',
      'factory/technician/+/status',
      'webapp/intervention/+',
    ]);
    
    console.log('[MQTT] Subscribed to topics');
  }

  subscribe(handler: MessageHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  private notifyHandlers(topic: string, message: any) {
    this.handlers.forEach(handler => {
      try {
        handler(topic, message);
      } catch (error) {
        console.error('[MQTT] Handler error:', error);
      }
    });
  }

  publish(topic: string, message: any) {
    if (!this.client?.connected) {
      console.warn('[MQTT] Not connected');
      return;
    }
    this.client.publish(topic, JSON.stringify(message), { qos: 1 });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const mqttService = new MqttService();

export default mqttService;
