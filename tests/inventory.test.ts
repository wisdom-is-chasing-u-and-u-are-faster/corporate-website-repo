import { db } from "../src/lib/db";
import { InventoryEngine } from "../src/lib/inventoryEngine";

describe("Step 3: Real-Time Inventory Engine & Safeguards", () => {
  beforeEach(() => {
    db.seed();
  });

  it("REQ-F-011: should reserve stock for a maximum of 5 minutes", () => {
    const res = InventoryEngine.reserveStock([
      { product_id: "p1111111-1111-1111-1111-111111111111", quantity: 2 }
    ]);
    expect(res.success).toBe(true);
    expect(res.reservation_id).toBeDefined();

    const inv = db.inventory.get("p1111111-1111-1111-1111-111111111111")!;
    expect(inv.reserved_quantity).toBe(2);
    expect(inv.quantity_available).toBe(142);
  });

  it("REQ-F-012: should convert reservation to permanent deduction upon checkout completion", () => {
    const res = InventoryEngine.reserveStock([
      { product_id: "p1111111-1111-1111-1111-111111111111", quantity: 5 }
    ]);
    expect(res.success).toBe(true);

    const commitRes = InventoryEngine.commitReservation(res.reservation_id!);
    expect(commitRes.success).toBe(true);

    const inv = db.inventory.get("p1111111-1111-1111-1111-111111111111")!;
    expect(inv.quantity_available).toBe(137);
    expect(inv.reserved_quantity).toBe(0);
  });

  it("REQ-F-013: should release expired reservations after 5 minutes back to available pool", () => {
    const res = InventoryEngine.reserveStock(
      [{ product_id: "p1111111-1111-1111-1111-111111111111", quantity: 10 }],
      undefined,
      -1 // Expired 1 minute ago
    );
    expect(res.success).toBe(true);

    const releasedCount = InventoryEngine.releaseExpiredReservations();
    expect(releasedCount).toBeGreaterThanOrEqual(1);

    const inv = db.inventory.get("p1111111-1111-1111-1111-111111111111")!;
    expect(inv.reserved_quantity).toBe(0);
  });

  it("REQ-F-014 & REQ-F-015: should trigger Slack and Admin Dashboard alerts when stock falls below threshold", () => {
    db.alerts = [];
    // Product p2222222-2222-2222-2222-222222222222 has stock 8 (threshold 10)
    const inv = db.inventory.get("p2222222-2222-2222-2222-222222222222")!;
    const alerts = InventoryEngine.evaluateLowStockAlerts(inv);

    expect(alerts.length).toBe(2);
    const slackAlert = alerts.find(a => a.channel === "SLACK");
    const dashAlert = alerts.find(a => a.channel === "ADMIN_DASHBOARD");

    expect(slackAlert).toBeDefined();
    expect(slackAlert?.message).toContain("LOW STOCK ALERT");
    expect(dashAlert).toBeDefined();
    expect(dashAlert?.type).toBe("LOW_STOCK");
  });

  it("REQ-F-019: should reject transactions attempting to reduce stock below zero with INSUFFICIENT_STOCK", () => {
    const res = InventoryEngine.deductStockAtomic("p5555555-5555-5555-5555-555555555555", 9999);
    expect(res.success).toBe(false);
    expect(res.error).toBe("INSUFFICIENT_STOCK");

    const inv = db.inventory.get("p5555555-5555-5555-5555-555555555555")!;
    expect(inv.quantity_available).toBe(24); // unchanged
  });
});
