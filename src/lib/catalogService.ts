import { db } from "./db";
import { Product } from "../types";

export interface CatalogQueryOptions {
  category?: string;
  skin_type?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface CatalogResponse {
  success: boolean;
  data: Array<Product & { quantity_available: number; is_low_stock: boolean }>;
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
  cached: boolean;
  cached_at?: string;
}

export class CatalogService {
  private static cache: Map<string, { data: CatalogResponse; timestamp: number }> = new Map();
  private static readonly CACHE_TTL_MS = 300 * 1000; // 5 minutes cache TTL

  /**
   * Fetch paginated and filtered product catalog with in-memory caching (REQ-F-003, REQ-F-004).
   */
  public static getProducts(options: CatalogQueryOptions = {}): CatalogResponse {
    const cacheKey = JSON.stringify(options);
    const now = Date.now();

    // Cache hit check
    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry && (now - cachedEntry.timestamp) < this.CACHE_TTL_MS) {
      return {
        ...cachedEntry.data,
        cached: true,
        cached_at: new Date(cachedEntry.timestamp).toISOString()
      };
    }

    let allProducts = Array.from(db.products.values()).filter(p => p.is_active);

    // 1. Filter by category (REQ-F-004)
    if (options.category && options.category !== "All Categories" && options.category !== "all") {
      const categoryLower = options.category.toLowerCase();
      allProducts = allProducts.filter(p => p.category.toLowerCase() === categoryLower);
    }

    // 2. Filter by skin-type (REQ-F-004)
    if (options.skin_type && options.skin_type !== "All Skin Types" && options.skin_type !== "All" && options.skin_type !== "all") {
      const skinTypeLower = options.skin_type.toLowerCase();
      allProducts = allProducts.filter(p => p.skin_type.toLowerCase() === skinTypeLower || p.skin_type.toLowerCase() === "all");
    }

    // 3. Search filter
    if (options.search && options.search.trim().length > 0) {
      const q = options.search.trim().toLowerCase();
      allProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    // 4. Price range filter
    if (options.minPrice !== undefined) {
      allProducts = allProducts.filter(p => p.price >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      allProducts = allProducts.filter(p => p.price <= options.maxPrice!);
    }

    const totalItems = allProducts.length;
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const offset = (page - 1) * limit;

    const pagedProducts = allProducts.slice(offset, offset + limit).map(p => {
      const inv = db.inventory.get(p.product_id);
      const available = inv ? (inv.quantity_available - inv.reserved_quantity) : 0;
      const isLowStock = inv ? (inv.quantity_available <= inv.safety_stock_threshold) : false;
      return {
        ...p,
        quantity_available: Math.max(0, available),
        is_low_stock: isLowStock
      };
    });

    const response: CatalogResponse = {
      success: true,
      data: pagedProducts,
      pagination: {
        total_items: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit
      },
      cached: false
    };

    // Store in cache
    this.cache.set(cacheKey, { data: response, timestamp: now });

    return response;
  }

  public static getProductById(id: string): (Product & { quantity_available: number; is_low_stock: boolean }) | null {
    const product = db.products.get(id);
    if (!product || !product.is_active) return null;
    const inv = db.inventory.get(product.product_id);
    const available = inv ? (inv.quantity_available - inv.reserved_quantity) : 0;
    const isLowStock = inv ? (inv.quantity_available <= inv.safety_stock_threshold) : false;
    return {
      ...product,
      quantity_available: Math.max(0, available),
      is_low_stock: isLowStock
    };
  }

  public static getProductBySku(sku: string): (Product & { quantity_available: number; is_low_stock: boolean }) | null {
    const product = Array.from(db.products.values()).find(p => p.sku === sku && p.is_active);
    if (!product) return null;
    return this.getProductById(product.product_id);
  }

  public static invalidateCache(): void {
    this.cache.clear();
  }
}
