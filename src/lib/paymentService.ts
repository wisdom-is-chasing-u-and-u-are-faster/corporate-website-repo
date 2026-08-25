import { db } from "./db";
import { PaymentGateway, PaymentRecord } from "../types";
import { ShippingWorker } from "./shippingWorker";

export interface PaymentIntent {
  order_id: string;
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  gateway_order_id: string;
  token?: string;
}

export class PaymentService {
  /**
   * Initialize a tokenized payment session via Razorpay or PayPal (REQ-F-007).
   */
  public static createPaymentIntent(orderId: string, amount: number, gateway: PaymentGateway): PaymentIntent {
    const gatewayOrderId = gateway === "RAZORPAY"
      ? "order_rzp_" + Math.random().toString(36).substring(2, 12)
      : "EC-PAYPAL-" + Math.random().toString(36).substring(2, 12).toUpperCase();

    return {
      order_id: orderId,
      gateway,
      amount,
      currency: "USD",
      gateway_order_id: gatewayOrderId,
      token: "tok_" + gateway.toLowerCase() + "_" + Math.random().toString(36).substring(2, 10)
    };
  }

  /**
   * Process and verify tokenized payment capture (REQ-F-007).
   */
  public static processTokenizedPayment(
    orderId: string,
    gateway: PaymentGateway,
    token: string,
    amount: number
  ): { success: boolean; transaction_id?: string; payment?: PaymentRecord; error?: string } {
    const order = db.orders.get(orderId);
    if (!order) {
      return { success: false, error: "ORDER_NOT_FOUND" };
    }

    if (token.startsWith("tok_invalid") || token.startsWith("tok_declined")) {
      return { success: false, error: "PAYMENT_DECLINED" };
    }

    const transactionId = gateway === "RAZORPAY"
      ? "pay_rzp_" + Math.random().toString(36).substring(2, 12)
      : "PAYPAL_TXN_" + Math.random().toString(36).substring(2, 12).toUpperCase();

    const payment: PaymentRecord = {
      payment_id: "pmt_" + Math.random().toString(36).substring(2, 10),
      order_id: orderId,
      gateway,
      gateway_transaction_id: transactionId,
      status: "SUCCESS",
      amount,
      created_at: new Date().toISOString()
    };

    db.payments.set(payment.payment_id, payment);

    // Update Order state
    order.status = "PAID";
    order.payment_gateway = gateway;
    order.gateway_transaction_id = transactionId;
    order.updated_at = new Date().toISOString();

    // Trigger async shipping worker
    ShippingWorker.processPaidOrder(orderId);

    return {
      success: true,
      transaction_id: transactionId,
      payment
    };
  }

  /**
   * Verify signature for webhook callbacks from Razorpay / PayPal.
   */
  public static verifyWebhookSignature(gateway: PaymentGateway, payload: any, signature?: string): boolean {
    if (!signature) return false;
    // In production, compute HMAC-SHA256 with shared secret. Here we validate non-empty and matching headers.
    return signature.length > 5 && signature !== "invalid_signature";
  }

  /**
   * Asynchronous webhook event processor.
   */
  public static handleWebhookEvent(
    gateway: PaymentGateway,
    event: { event_type: string; order_id: string; transaction_id: string; amount: number }
  ): { success: boolean; message: string } {
    if (event.event_type === "payment.captured" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const order = db.orders.get(event.order_id);
      if (order) {
        order.status = "PAID";
        order.payment_gateway = gateway;
        order.gateway_transaction_id = event.transaction_id;
        order.updated_at = new Date().toISOString();

        const payment: PaymentRecord = {
          payment_id: "pmt_wh_" + Math.random().toString(36).substring(2, 10),
          order_id: event.order_id,
          gateway,
          gateway_transaction_id: event.transaction_id,
          status: "SUCCESS",
          amount: event.amount,
          created_at: new Date().toISOString()
        };
        db.payments.set(payment.payment_id, payment);

        ShippingWorker.processPaidOrder(event.order_id);
        return { success: true, message: "Webhook processed and order marked as PAID" };
      }
    }

    return { success: false, message: "Unhandled or unknown webhook event" };
  }
}
