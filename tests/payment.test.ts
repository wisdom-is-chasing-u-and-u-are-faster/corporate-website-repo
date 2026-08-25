import { PaymentService } from "../src/lib/paymentService";
import { db } from "../src/lib/db";

describe("Step 5.2: Payment Service & Webhook Handling", () => {
  beforeEach(() => {
    db.seed();
  });

  it("should generate valid payment intents for Razorpay and PayPal", () => {
    const razorIntent = PaymentService.createPaymentIntent("ord_123", 100.0, "RAZORPAY");
    expect(razorIntent.gateway).toBe("RAZORPAY");
    expect(razorIntent.token).toContain("tok_razorpay_");

    const paypalIntent = PaymentService.createPaymentIntent("ord_123", 100.0, "PAYPAL");
    expect(paypalIntent.gateway).toBe("PAYPAL");
    expect(paypalIntent.token).toContain("tok_paypal_");
  });

  it("should verify cryptographic webhook signature and reject invalid headers", () => {
    expect(PaymentService.verifyWebhookSignature("RAZORPAY", {}, "valid_signature_hash_12345")).toBe(true);
    expect(PaymentService.verifyWebhookSignature("RAZORPAY", {}, "invalid_signature")).toBe(false);
    expect(PaymentService.verifyWebhookSignature("RAZORPAY", {}, "")).toBe(false);
  });
});
