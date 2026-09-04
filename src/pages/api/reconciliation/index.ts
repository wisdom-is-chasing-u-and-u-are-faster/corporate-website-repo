import { NextApiRequest, NextApiResponse } from "next";
import { ReconciliationJob } from "../../../lib/reconciliationJob";
import { db } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { execution_time } = req.body || {};
    const report = ReconciliationJob.runDailyReconciliation(execution_time);
    return res.status(200).json({ success: true, report });
  }

  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: db.reconciliationReports });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
