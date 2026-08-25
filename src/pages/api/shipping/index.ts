import { NextApiRequest, NextApiResponse } from "next";
import { ShippingWorker } from "../../../lib/shippingWorker";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(400).json({ success: false, message: "order_id is required" });
    }

    const payload = ShippingWorker.processPaidOrder(order_id);
    if (!payload) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: payload });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
