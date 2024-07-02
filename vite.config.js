import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: "robots.txt",
      manifest: {
        name: "Millionpainter Sketch App",
        short_name: "Millionpainter",
        theme_color: "#FFFFFF",
        start_url: "/index.html",
        background_color: "#000000",
        display: "minimal-ui",
        display_override: ["standalone"],
        scope: "/",

        icons: [
          {
            src: "millionpainter_sketchapp_high-res.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "millionpainter_sketchapp_medium-res.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "millionpainter_sketchapp_low-res.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
