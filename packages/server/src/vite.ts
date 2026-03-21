import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  // Dynamic import to avoid composite project file boundary issues
  const viteConfig = await import("../../client/vite.config.js").then((m) => m.default);
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      template = await vite.transformIndexHtml(url, template);

      // 1. Load the server entry
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      
      // 2. Render the app string
      const appHtml = await render(url);
      
      // 3. Inject it into the HTML
      const page = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      
      const errMsg = (e as Error).message || String(e);
      if (errMsg.includes("window is not defined") || errMsg.includes("document is not defined") || errMsg.includes("navigator is not defined")) {
        console.error("\n❌ [SSR Execution Error]");
        console.error(`Your React code tried to access a browser-only API during Server-Side Rendering (Node.js).`);
        console.error(`Error: ${errMsg}\n`);
        console.error(`👉 Quick Fix: Wrap the code accessing window/document inside a useEffect() hook, or gate it with: if (typeof window !== "undefined") { ... }\n`);
      } else {
        console.error("\n❌ [SSR Render Error]:", e, "\n");
      }
      
      next(e);
    }
  });
}
