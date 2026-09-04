import { NextApiRequest, NextApiResponse } from "next";
import { CatalogService } from "../../../lib/catalogService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category, skin_type, search, minPrice, maxPrice, page, limit } = req.query;

    const options = {
      category: typeof category === "string" ? category : undefined,
      skin_type: typeof skin_type === "string" ? skin_type : undefined,
      search: typeof search === "string" ? search : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20
    };

    const result = CatalogService.getProducts(options);
    return res.status(200).json(result);
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
