import { NextApiRequest, NextApiResponse } from "next";
import { PaymentService } from "../../../lib/paymentService";
import { PaymentGateway } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const signature = (req.headers["x-razorpay-signature"] as string) || (req.headers["paypal-auth-algo"] as string);
    const gateway: PaymentGateway = req.headers["x-razorpay-signature"] ? "RAZORPAY" : "PAYPAL";

    if (!PaymentService.verifyWebhookSignature(gateway, req.body, signature)) {
      return res.status(401).json({ success: false, error: "INVALID_WEBHOOK_SIGNATURE", message: "Cryptographic webhook signature check failed" });
    }

    const { event_type, order_id, transaction_id, amount } = req.body;
    const result = PaymentService.handleWebhookEvent(gateway, {
      event_type: event_type || "payment.captured",
      order_id,
      transaction_id,
      amount: Number(amount)
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
