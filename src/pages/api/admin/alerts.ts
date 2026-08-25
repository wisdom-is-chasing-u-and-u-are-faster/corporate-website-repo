import { NextApiRequest, NextApiResponse } from "next";
import { AdminService } from "../../../lib/adminService";
import { db } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const alerts = db.alerts;
    return res.status(200).json({ success: true, data: alerts, count: alerts.length });
  }

  if (req.method === "POST") {
    const { alert_id } = req.body;
    if (!alert_id) {
      return res.status(400).json({ success: false, message: "alert_id is required" });
    }

    const success = AdminService.acknowledgeAlert(alert_id);
    return res.status(200).json({ success, message: success ? "Alert acknowledged" : "Alert not found" });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
