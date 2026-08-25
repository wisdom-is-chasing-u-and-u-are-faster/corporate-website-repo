import { NextApiRequest, NextApiResponse } from "next";
import { InventoryEngine } from "../../../lib/inventoryEngine";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { items, order_id, duration_minutes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items array required for stock reservation" });
    }

    const result = InventoryEngine.reserveStock(items, order_id, duration_minutes || 5);

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error || "INSUFFICIENT_STOCK",
        message: "Failed to reserve stock. Some items are out of stock."
      });
    }

    return res.status(200).json({
      success: true,
      reservation_id: result.reservation_id,
      expires_in_minutes: duration_minutes || 5,
      expires_at: Date.now() + (duration_minutes || 5) * 60 * 1000,
      message: "Stock successfully reserved for 5 minutes."
    });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
