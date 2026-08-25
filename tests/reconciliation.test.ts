import { db } from "../src/lib/db";
import { ReconciliationJob } from "../src/lib/reconciliationJob";

describe("Step 6.2: Daily Transaction Reconciliation Job", () => {
  beforeEach(() => {
    db.seed();
  });

  it("REQ-F-017: should audit paid transactions against created orders", () => {
    // Setup matched order & payment
    const orderId = "ord_rec_match";
    db.orders.set(orderId, {
      order_id: orderId,
      status: "PAID",
      total_amount: 50.0,
      subtotal: 50.0,
      shipping_fee: 0.0,
      tax: 0.0,
      shipping_address: { first_name: "A", last_name: "B", address_line1: "C", city: "D", state: "E", postal_code: "123", country: "US" },
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    db.payments.set("pmt_rec_1", {
      payment_id: "pmt_rec_1",
      order_id: orderId,
      gateway: "RAZORPAY",
      gateway_transaction_id: "txn_1",
      status: "SUCCESS",
      amount: 50.0,
      created_at: new Date().toISOString()
    });

    const report = ReconciliationJob.runDailyReconciliation("2026-08-25T02:00:00Z");
    expect(report.status).toBe("SUCCESS");
    expect(report.matched_count).toBeGreaterThanOrEqual(1);
    expect(report.variance_count).toBe(0);
  });

  it("REQ-F-018: should flag variances as SUSPENDED_RECONCILIATION and dispatch alert", () => {
    db.alerts = [];
    const orderId = "ord_rec_mismatch";
    db.orders.set(orderId, {
      order_id: orderId,
      status: "PAID",
      total_amount: 100.0, // Expected $100
      subtotal: 100.0,
      shipping_fee: 0.0,
      tax: 0.0,
      shipping_address: { first_name: "A", last_name: "B", address_line1: "C", city: "D", state: "E", postal_code: "123", country: "US" },
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    db.payments.set("pmt_rec_mismatch", {
      payment_id: "pmt_rec_mismatch",
      order_id: orderId,
      gateway: "PAYPAL",
      gateway_transaction_id: "txn_mismatch",
      status: "SUCCESS",
      amount: 40.0, // Paid only $40!
      created_at: new Date().toISOString()
    });

    const report = ReconciliationJob.runDailyReconciliation("2026-08-25T02:00:00Z");
    expect(report.status).toBe("VARIANCE_DETECTED");
    expect(report.variance_count).toBe(1);
    expect(report.flagged_orders).toContain(orderId);

    const order = db.orders.get(orderId)!;
    expect(order.status).toBe("SUSPENDED_RECONCILIATION");

    const financeAlert = db.alerts.find(a => a.type === "RECONCILIATION_VARIANCE");
    expect(financeAlert).toBeDefined();
    expect(financeAlert?.channel).toBe("FINANCE_EMAIL");
    expect(financeAlert?.message).toContain("SUSPENDED_RECONCILIATION");
  });
});
