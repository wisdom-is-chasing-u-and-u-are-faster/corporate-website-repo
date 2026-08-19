/**
 * Express Route Handler for Lead Capture
 * Implements AC-1, AC-2, AC-3, AC-4, AC-5 for ARCH-394
 */

import { Router, Request, Response, NextFunction } from "express";
import { LeadEngineService } from "../services/leadService";

export function createLeadRouter(leadService?: LeadEngineService): Router {
  const router = Router();
  const service = leadService || new LeadEngineService();

  /**
   * POST /api/leads
   * Submits a corporate lead capture request.
   */
  router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body || {};
      const metadata = {
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      };

      const result = await service.processLeadCapture(payload, metadata);

      return res.status(result.statusCode).json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
