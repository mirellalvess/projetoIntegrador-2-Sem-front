import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/projetoIntegrador-2-Sem-front",

  plugins: [
    react(), // único plugin necessário
  ],

  css: {
    postcss: "./postcss.config.js",
  },

  server: {
    port: 5173,
    open: true,
  },
});