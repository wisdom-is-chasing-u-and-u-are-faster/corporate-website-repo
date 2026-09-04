import { NextApiRequest, NextApiResponse } from "next";
import { InventoryEngine } from "../../../lib/inventoryEngine";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { reservation_id } = req.body;

    if (reservation_id) {
      const released = InventoryEngine.releaseReservation(reservation_id, "RELEASED");
      return res.status(200).json({ success: released, message: released ? "Reservation released" : "Reservation not found" });
    }

    // Auto-release all expired reservations
    const expiredCount = InventoryEngine.releaseExpiredReservations();
    return res.status(200).json({
      success: true,
      released_count: expiredCount,
      message: `Released ${expiredCount} expired stock reservation(s) back to inventory pool.`
    });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
