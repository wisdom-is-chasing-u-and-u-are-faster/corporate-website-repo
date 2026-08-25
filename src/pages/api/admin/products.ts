import { NextApiRequest, NextApiResponse } from "next";
import { AdminService } from "../../../lib/adminService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const metrics = AdminService.getDashboardMetrics();
    return res.status(200).json({ success: true, ...metrics });
  }

  if (req.method === "POST") {
    const { sku, name, description, price, weight_grams, category, skin_type, ingredients, initial_stock, safety_stock_threshold } = req.body;

    if (!sku || !name || price === undefined || !category) {
      return res.status(400).json({ success: false, message: "sku, name, price, and category are required" });
    }

    const newProduct = AdminService.addProduct({
      sku,
      name,
      description: description || "",
      price: Number(price),
      weight_grams: weight_grams ? Number(weight_grams) : 50,
      category,
      skin_type,
      ingredients,
      initial_stock: initial_stock !== undefined ? Number(initial_stock) : 50,
      safety_stock_threshold: safety_stock_threshold !== undefined ? Number(safety_stock_threshold) : 10
    });

    return res.status(201).json({ success: true, data: newProduct });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
