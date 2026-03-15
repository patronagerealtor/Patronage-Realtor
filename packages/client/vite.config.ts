import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { writeFileSync } from "fs";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

/**
 * IndexNow key file: host a UTF-8 file at the root of your website at https://<your-domain>/<key>.txt
 * whose contents are exactly the key. This plugin writes that file at build time so Bing can verify ownership.
 * Key must be 8–128 chars: alphanumeric (a-z, A-Z, 0-9) and optionally hyphens (-).
 * Set INDEXNOW_KEY at build time (e.g. in Vercel Build env) to generate the file.
 */
function indexNowKeyFilePlugin() {
  return {
    name: "indexnow-key-file",
    writeBundle(options: { dir?: string }) {
      try {
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
      } catch (e) {
        console.warn("[indexnow-key-file] Could not write key file:", e);
      }
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
    // PERF: Enable minification with Terser for smaller bundles
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        pure_funcs: ["console.log", "console.info"],
      },
      format: {
        comments: false,
      },
    },
    // PERF: Optimize rollup bundle splitting for better long-term caching
    rollupOptions: {
      output: {
        // PERF: Manual chunk strategy - vendor libs separated from app code
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-motion": ["framer-motion"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
        // PERF: Consistent chunk naming for cache busting
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === "index") {
            return "chunks/main-[hash].js";
          }
          return "chunks/[name]-[hash].js";
        },
        // PERF: Hash all assets for long-term caching
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg/.test(ext)) {
            return "images/[name]-[hash][extname]";
          } else if (ext === "css") {
            return "css/[name]-[hash][extname]";
          } else if (ext === "woff" || ext === "woff2") {
            return "fonts/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    // PERF: Only generate source maps in dev
    sourcemap: process.env.NODE_ENV !== "production",
    // PERF: Split CSS into separate chunks for better caching
    cssCodeSplit: true,
    cssMinify: "lightningcss",
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
