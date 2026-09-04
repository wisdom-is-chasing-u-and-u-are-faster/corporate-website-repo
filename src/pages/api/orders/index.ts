import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db";
import { InventoryEngine } from "../../../lib/inventoryEngine";
import { PaymentService } from "../../../lib/paymentService";
import { Order, OrderItem, PaymentGateway } from "../../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      user_id,
      guest_email,
      shipping_address,
      items,
      payment_gateway,
      payment_token,
      reservation_id
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "CART_EMPTY", message: "Cart items are required" });
    }

    if (!shipping_address || !shipping_address.address_line1 || !shipping_address.city) {
      return res.status(400).json({ success: false, error: "INVALID_SHIPPING_ADDRESS", message: "Shipping address is required" });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: OrderItem[] = [];
    const orderId = "ord_" + Math.random().toString(36).substring(2, 11);

    for (const item of items) {
      const product = db.products.get(item.product_id);
      if (!product) {
        return res.status(404).json({ success: false, error: "PRODUCT_NOT_FOUND", message: `Product ${item.product_id} not found` });
      }

      // Check stock availability
      if (!reservation_id && !InventoryEngine.checkAvailability(item.product_id, item.quantity)) {
        return res.status(422).json({
          success: false,
          error: "INSUFFICIENT_STOCK",
          message: `Item ${product.name} has insufficient stock to complete checkout.`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        order_item_id: "oit_" + Math.random().toString(36).substring(2, 8),
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_per_unit: product.price
      });
    }

    const shippingFee = subtotal > 50 ? 0.0 : 5.0;
    const tax = Number((subtotal * 0.09).toFixed(2));
    const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

    // Handle reservation or direct stock lock
    if (reservation_id) {
      const commitRes = InventoryEngine.commitReservation(reservation_id);
      if (!commitRes.success) {
        return res.status(422).json({
          success: false,
          error: commitRes.error || "INSUFFICIENT_STOCK",
          message: "Stock reservation expired or invalid. Please refresh cart."
        });
      }
    } else {
      // Direct deduction
      for (const item of items) {
        const deductRes = InventoryEngine.deductStockAtomic(item.product_id, item.quantity);
        if (!deductRes.success) {
          return res.status(422).json({
            success: false,
            error: deductRes.error || "INSUFFICIENT_STOCK",
            message: "Stock unavailable."
          });
        }
      }
    }

    const order: Order = {
      order_id: orderId,
      user_id: user_id || null,
      guest_email: guest_email || shipping_address.email,
      status: "PENDING",
      subtotal,
      shipping_fee: shippingFee,
      tax,
      total_amount: totalAmount,
      shipping_address,
      items: orderItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.orders.set(orderId, order);

    // Process payment if token provided
    let paymentResult = null;
    const gateway: PaymentGateway = (payment_gateway as PaymentGateway) || "RAZORPAY";

    if (payment_token) {
      paymentResult = PaymentService.processTokenizedPayment(orderId, gateway, payment_token, totalAmount);
    } else {
      // Create payment intent
      const intent = PaymentService.createPaymentIntent(orderId, totalAmount, gateway);
      return res.status(201).json({
        success: true,
        order_id: orderId,
        status: order.status,
        total_amount: totalAmount,
        payment_intent: intent
      });
    }

    return res.status(201).json({
      success: true,
      order_id: orderId,
      status: order.status,
      total_amount: totalAmount,
      tracking_number: order.tracking_number,
      payment: paymentResult
    });
  }

  if (req.method === "GET") {
    const orders = Array.from(db.orders.values());
    return res.status(200).json({ success: true, data: orders });
  }

  return res.status(405).json({ success: false, message: "Method Not Allowed" });
}
