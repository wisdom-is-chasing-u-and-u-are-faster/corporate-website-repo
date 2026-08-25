import { db } from "../src/lib/db";
import { PaymentService } from "../src/lib/paymentService";
import { InventoryEngine } from "../src/lib/inventoryEngine";

describe("Step 5: Checkout Process & Payment Integration", () => {
  beforeEach(() => {
    db.seed();
  });

  it("REQ-F-005 & REQ-F-007: should process tokenized payment with Razorpay", () => {
    const orderId = "ord_test_001";
    db.orders.set(orderId, {
      order_id: orderId,
      status: "PENDING",
      subtotal: 65.0,
      shipping_fee: 0.0,
      tax: 5.85,
      total_amount: 70.85,
      shipping_address: {
        first_name: "Sophia",
        last_name: "Chen",
        address_line1: "1234 Market St.",
        city: "San Francisco",
        state: "CA",
        postal_code: "94103",
        country: "USA"
      },
      items: [
        {
          order_item_id: "oit_1",
          order_id: orderId,
          product_id: "p1111111-1111-1111-1111-111111111111",
          quantity: 1,
          price_per_unit: 65.0
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const paymentRes = PaymentService.processTokenizedPayment(
      orderId,
      "RAZORPAY",
      "tok_razorpay_valid123",
      70.85
    );

    expect(paymentRes.success).toBe(true);
    expect(paymentRes.transaction_id).toBeDefined();

    const order = db.orders.get(orderId)!;
    expect(order.status).toBe("PROCESSING"); // Updated by shipping worker trigger
    expect(order.payment_gateway).toBe("RAZORPAY");
  });

  it("REQ-F-007: should process tokenized payment with PayPal", () => {
    const orderId = "ord_test_002";
    db.orders.set(orderId, {
      order_id: orderId,
      status: "PENDING",
      subtotal: 32.0,
      shipping_fee: 5.0,
      tax: 2.88,
      total_amount: 39.88,
      shipping_address: {
        first_name: "Marcus",
        last_name: "Sterling",
        address_line1: "500 Howard St.",
        city: "San Francisco",
        state: "CA",
        postal_code: "94105",
        country: "USA"
      },
      items: [
        {
          order_item_id: "oit_2",
          order_id: orderId,
          product_id: "p2222222-2222-2222-2222-222222222222",
          quantity: 1,
          price_per_unit: 32.0
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const paymentRes = PaymentService.processTokenizedPayment(
      orderId,
      "PAYPAL",
      "tok_paypal_valid456",
      39.88
    );

    expect(paymentRes.success).toBe(true);
    const order = db.orders.get(orderId)!;
    expect(order.payment_gateway).toBe("PAYPAL");
  });
});
