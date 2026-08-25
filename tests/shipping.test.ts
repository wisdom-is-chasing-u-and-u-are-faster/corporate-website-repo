import { db } from "../src/lib/db";
import { ShippingWorker } from "../src/lib/shippingWorker";

describe("Step 6.1: Event-Driven Shipping Worker", () => {
  beforeEach(() => {
    db.seed();
  });

  it("REQ-F-009: should automatically generate shipping label and tracking code for paid order", () => {
    const orderId = "ord_ship_101";
    db.orders.set(orderId, {
      order_id: orderId,
      status: "PAID",
      subtotal: 65.0,
      shipping_fee: 0.0,
      tax: 5.85,
      total_amount: 70.85,
      shipping_address: {
        first_name: "Elena",
        last_name: "Rostova",
        address_line1: "123 Warehouse Rd.",
        city: "Los Angeles",
        state: "CA",
        postal_code: "90001",
        country: "USA"
      },
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const payload = ShippingWorker.processPaidOrder(orderId);
    expect(payload).toBeDefined();
    expect(payload?.tracking_number).toContain("AU-TRK-");
    expect(payload?.label_url).toContain(".pdf");

    const order = db.orders.get(orderId)!;
    expect(order.tracking_number).toBe(payload?.tracking_number);
    expect(order.status).toBe("PROCESSING");
  });
});
