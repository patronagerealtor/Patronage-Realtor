import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { writeFileSync } from "fs";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

/**
 * Writes the IndexNow key file at site root so Bing can verify ownership.
 * Key must be 8–128 chars: alphanumeric (a-z, A-Z, 0-9) and optionally hyphens (-).
 * Set INDEXNOW_KEY at build time (e.g. in Vercel Build env) to generate the file.
 */
function indexNowKeyFilePlugin() {
  return {
    name: "indexnow-key-file",
    writeBundle(options: { dir?: string }) {
      const key = process.env.INDEXNOW_KEY;
      if (!key || typeof key !== "string") return;
      const trimmed = key.trim();
      if (trimmed.length < 8 || trimmed.length > 128 || !/^[a-zA-Z0-9-]+$/.test(trimmed)) {
        console.warn("[indexnow-key-file] INDEXNOW_KEY invalid (8–128 alphanumeric/hyphen chars); skipping key file.");
        return;
      }
      const outDir = options.dir;
      if (!outDir) return;
      const keyPath = path.join(outDir, `${trimmed}.txt`);
      writeFileSync(keyPath, trimmed, "utf8");
      console.log("[indexnow-key-file] Wrote", keyPath);
    },
  };
}

export default defineConfig({
  // Load .env from repo root so VITE_SUPABASE_* are available
  envDir: path.resolve(import.meta.dirname, "../../"),
  plugins: [
    react(),
    tailwindcss(),
    metaImagesPlugin(),
    indexNowKeyFilePlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@shared": path.resolve(import.meta.dirname, "../shared/src"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: import.meta.dirname,
  build: {
    outDir:
      process.env.BUILD_FOR_SERVER === "1"
        ? path.resolve(import.meta.dirname, "../server/dist/public")
        : path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1024,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
