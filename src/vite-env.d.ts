/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_RED_URL: string;
  readonly VITE_MQTT_BROKER_URL: string;
  readonly VITE_MQTT_BROKER_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
