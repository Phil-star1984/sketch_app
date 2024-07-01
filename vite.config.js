import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "Millionpainter Sketch App",
        short_name: "SketchApp",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo_bunt.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
