/**
 * Express Application Configuration
 * Implements AC-1, AC-5 for ARCH-394
 */

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createLeadRouter } from "./routes/leadRouter";
import { LeadEngineService } from "./services/leadService";

export interface AppOptions {
  leadService?: LeadEngineService;
}

export function createApp(options?: AppOptions): Application {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "healthy", service: "corporate-website-lead-engine" });
  });

  // API Routes
  app.use("/api/leads", createLeadRouter(options?.leadService));

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Route not found."
    });
  });

  // Centralized Error Handling Middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
      errors: [{ field: "server", message: err.message || "An unexpected error occurred." }]
    });
  });

  return app;
}
