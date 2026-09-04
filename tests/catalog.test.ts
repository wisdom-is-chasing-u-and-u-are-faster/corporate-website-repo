import { db } from "../src/lib/db";
import { CatalogService } from "../src/lib/catalogService";

describe("Step 4: Product Catalog & Multi-Criteria Filtering", () => {
  beforeEach(() => {
    db.seed();
    CatalogService.invalidateCache();
  });

  it("REQ-F-003: should provide cached product catalog responses", () => {
    const firstCall = CatalogService.getProducts();
    expect(firstCall.success).toBe(true);
    expect(firstCall.cached).toBe(false);

    const secondCall = CatalogService.getProducts();
    expect(secondCall.success).toBe(true);
    expect(secondCall.cached).toBe(true);
  });

  it("REQ-F-004: should filter products by category", () => {
    const skincareProducts = CatalogService.getProducts({ category: "Skincare" });
    expect(skincareProducts.success).toBe(true);
    expect(skincareProducts.data.length).toBeGreaterThan(0);
    expect(skincareProducts.data.every(p => p.category === "Skincare")).toBe(true);
  });

  it("REQ-F-004: should filter products by skin-type", () => {
    const sensitiveProducts = CatalogService.getProducts({ skin_type: "Sensitive" });
    expect(sensitiveProducts.success).toBe(true);
    expect(sensitiveProducts.data.some(p => p.skin_type === "Sensitive")).toBe(true);
  });

  it("should support text search across product names and descriptions", () => {
    const searchResult = CatalogService.getProducts({ search: "Lipstick" });
    expect(searchResult.success).toBe(true);
    expect(searchResult.data.length).toBe(1);
    expect(searchResult.data[0].name).toBe("Velvet Matte Lipstick");
  });
});
