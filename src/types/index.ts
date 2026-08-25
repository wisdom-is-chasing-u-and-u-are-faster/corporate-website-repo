export type SkinType = "All" | "Oily" | "Dry" | "Combination" | "Sensitive";
export type ProductCategory = "All Categories" | "Skincare" | "Makeup" | "Lip Care" | "Body Care";
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "SUSPENDED_RECONCILIATION";
export type PaymentGateway = "RAZORPAY" | "PAYPAL";

export interface Product {
  product_id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  weight_grams: number;
  category: string;
  skin_type: SkinType;
  ingredients: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  product_id: string;
  quantity_available: number;
  safety_stock_threshold: number; // default 10
  reserved_quantity: number;
  updated_at: string;
}

export interface StockReservation {
  reservation_id: string;
  order_id?: string;
  items: Array<{ product_id: string; quantity: number }>;
  expires_at: number; // timestamp in ms (5 minutes)
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "RELEASED";
  created_at: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
}

export interface Order {
  order_id: string;
  user_id?: string | null;
  guest_email?: string;
  status: OrderStatus;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  tracking_number?: string;
  payment_gateway?: PaymentGateway;
  gateway_transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  payment_id: string;
  order_id: string;
  gateway: PaymentGateway;
  gateway_transaction_id: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: number;
  created_at: string;
}

export interface AlertNotification {
  alert_id: string;
  type: "LOW_STOCK" | "RECONCILIATION_VARIANCE" | "SYSTEM_ERROR";
  channel: "SLACK" | "ADMIN_DASHBOARD" | "FINANCE_EMAIL";
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
  acknowledged: boolean;
}

export interface ReconciliationReport {
  reconciliation_id: string;
  executed_at: string;
  total_orders_audited: number;
  total_payments_audited: number;
  matched_count: number;
  variance_count: number;
  flagged_orders: string[];
  status: "SUCCESS" | "VARIANCE_DETECTED";
}
