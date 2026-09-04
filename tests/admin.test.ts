import { db } from "../src/lib/db";
import { AdminService } from "../src/lib/adminService";

describe("Step 7: Admin Dashboard & Stock Operations", () => {
  beforeEach(() => {
    db.seed();
  });

  it("REQ-F-010: should return administrative metrics and inventory status", () => {
    const metrics = AdminService.getDashboardMetrics();
    expect(metrics.stats.total_revenue).toBeGreaterThan(0);
    expect(metrics.products.length).toBeGreaterThanOrEqual(5);

    const lowStockProduct = metrics.products.find(p => p.sku === "SKU-L-205");
    expect(lowStockProduct).toBeDefined();
    expect(lowStockProduct?.status).toBe("Low Stock");
  });

  it("REQ-F-010 & REQ-F-016: should add a new product with default safety threshold of 10", () => {
    const newProduct = AdminService.addProduct({
      sku: "SKU-NEW-999",
      name: "Organic Rosehip Face Oil",
      description: "100% pure cold-pressed organic rosehip seed oil.",
      price: 42.0,
      category: "Skincare",
      skin_type: "Dry",
      initial_stock: 30
    });

    expect(newProduct.sku).toBe("SKU-NEW-999");
    const inv = db.inventory.get(newProduct.product_id);
    expect(inv).toBeDefined();
    expect(inv?.quantity_available).toBe(30);
    expect(inv?.safety_stock_threshold).toBe(10); // REQ-F-016 default
  });

  it("should update stock levels and safety stock thresholds", () => {
    const updated = AdminService.updateInventory("p1111111-1111-1111-1111-111111111111", 200, 15);
    expect(updated.quantity_available).toBe(200);
    expect(updated.safety_stock_threshold).toBe(15);
  });
});
