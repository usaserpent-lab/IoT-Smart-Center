import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // ADD THIS SERVER BLOCK:
  server: {
    host: '0.0.0.0', // Exposes the server on your local WiFi network
    port: 5173,      // Matches the port in your React file's PHONE_APP_HTTPS_URL
    strictPort: true // Prevents Vite from shifting to 5174 if 5173 is temporarily busy
  }
});