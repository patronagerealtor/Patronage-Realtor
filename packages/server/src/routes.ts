import type { Express } from "express";
import type { Server } from "http";
import { registerAuthRoutes } from "./routes/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerAuthRoutes(app);
  return httpServer;
}
