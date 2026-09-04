import { NextApiRequest, NextApiResponse } from "next";
import { AdminService } from "../../../lib/adminService";
import { db } from "../../../lib/db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const inventoryList = Array.from(db.inventory.values()).map(inv => {
      const product = db.products.get(inv.product_id);
      return {
        ...inv,
        product_name: product ? product.name : "Unknown",
        sku: product ? product.sku : "Unknown"
      };
    });
    return res.status(200).json({ success: true, data: inventoryList });
  }

  if (req.method === "PUT") {
    const { product_id, quantity_available, safety_stock_threshold } = req.body;

    if (!product_id || quantity_available === undefined) {
      return res.status(400).json({ success: false, message: "product_id and quantity_available are required" });
    }

    const updated = AdminService.updateInventory(
      product_id,
      Number(quantity_available),
      safety_stock_threshold !== undefined ? Number(safety_stock_threshold) : undefined
    );

    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
