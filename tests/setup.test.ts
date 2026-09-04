import { db } from "../src/lib/db";

describe("Step 1: Project Setup & Seed Verification", () => {
  it("should initialize database with seed products", () => {
    expect(db.products.size).toBeGreaterThanOrEqual(5);
    const serum = db.products.get("p1111111-1111-1111-1111-111111111111");
    expect(serum).toBeDefined();
    expect(serum?.name).toBe("Radiant Hydration Serum");
    expect(serum?.price).toBe(65.0);
  });

  it("should initialize inventory levels with default safety threshold of 10", () => {
    const inv = db.inventory.get("p1111111-1111-1111-1111-111111111111");
    expect(inv).toBeDefined();
    expect(inv?.quantity_available).toBe(142);
    expect(inv?.safety_stock_threshold).toBe(10);
  });
});
