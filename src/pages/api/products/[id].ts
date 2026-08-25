import { NextApiRequest, NextApiResponse } from "next";
import { CatalogService } from "../../../lib/catalogService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (typeof id !== "string") {
      return res.status(400).json({ success: false, message: "Invalid ID parameter" });
    }

    const product = CatalogService.getProductById(id) || CatalogService.getProductBySku(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product Not Found" });
    }

    return res.status(200).json({ success: true, data: product });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
