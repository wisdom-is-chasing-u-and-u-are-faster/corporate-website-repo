import { db } from "./db";
import { InventoryItem, StockReservation, AlertNotification } from "../types";

export class InventoryEngine {
  private static readonly DEFAULT_RESERVATION_MINUTES = 5;
  private static readonly DEFAULT_SAFETY_STOCK_THRESHOLD = 10;

  /**
   * Check if requested quantity is available for purchase.
   */
  public static checkAvailability(productId: string, quantity: number): boolean {
    this.releaseExpiredReservations();
    const item = db.inventory.get(productId);
    if (!item) return false;
    return (item.quantity_available - item.reserved_quantity) >= quantity;
  }

  /**
   * Reserve stock for 5 minutes during single-page checkout initiation (REQ-F-011).
   */
  public static reserveStock(
    items: Array<{ product_id: string; quantity: number }>,
    orderId?: string,
    durationMinutes: number = InventoryEngine.DEFAULT_RESERVATION_MINUTES
  ): { success: boolean; reservation_id?: string; error?: string } {
    this.releaseExpiredReservations();

    // Verify all items are available before locking
    for (const item of items) {
      const inv = db.inventory.get(item.product_id);
      if (!inv || (inv.quantity_available - inv.reserved_quantity) < item.quantity) {
        return {
          success: false,
          error: "INSUFFICIENT_STOCK"
        };
      }
    }

    // Atomic reservation lock
    const reservationId = "res_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    const now = Date.now();
    const expiresAt = now + durationMinutes * 60 * 1000;

    for (const item of items) {
      const inv = db.inventory.get(item.product_id)!;
      inv.reserved_quantity += item.quantity;
      inv.updated_at = new Date().toISOString();
    }

    const reservation: StockReservation = {
      reservation_id: reservationId,
      order_id: orderId,
      items: items.map(i => ({ ...i })),
      expires_at: expiresAt,
      status: "ACTIVE",
      created_at: now
    };

    db.reservations.set(reservationId, reservation);

    return {
      success: true,
      reservation_id: reservationId
    };
  }

  /**
   * Complete checkout and permanently deduct stock from reservation (REQ-F-012).
   */
  public static commitReservation(reservationId: string): { success: boolean; error?: string } {
    const reservation = db.reservations.get(reservationId);
    if (!reservation || reservation.status !== "ACTIVE") {
      return { success: false, error: "RESERVATION_NOT_FOUND_OR_EXPIRED" };
    }

    // Check if expired
    if (Date.now() > reservation.expires_at) {
      this.releaseReservation(reservationId, "EXPIRED");
      return { success: false, error: "RESERVATION_EXPIRED" };
    }

    // Convert reservation to permanent deduction
    for (const item of reservation.items) {
      const inv = db.inventory.get(item.product_id);
      if (inv) {
        if (inv.quantity_available < item.quantity) {
          return { success: false, error: "INSUFFICIENT_STOCK" };
        }
        inv.quantity_available -= item.quantity;
        inv.reserved_quantity = Math.max(0, inv.reserved_quantity - item.quantity);
        inv.updated_at = new Date().toISOString();

        // Check if low-stock threshold is breached (REQ-F-014, REQ-F-015)
        this.evaluateLowStockAlerts(inv);
      }
    }

    reservation.status = "COMPLETED";
    return { success: true };
  }

  /**
   * Release expired reservations back to available pool after 5 minutes (REQ-F-013).
   */
  public static releaseExpiredReservations(): number {
    const now = Date.now();
    let releasedCount = 0;

    for (const [resId, res] of db.reservations.entries()) {
      if (res.status === "ACTIVE" && now > res.expires_at) {
        this.releaseReservation(resId, "EXPIRED");
        releasedCount++;
      }
    }

    return releasedCount;
  }

  /**
   * Manually or automatically release a reservation.
   */
  public static releaseReservation(reservationId: string, status: "RELEASED" | "EXPIRED" = "RELEASED"): boolean {
    const reservation = db.reservations.get(reservationId);
    if (!reservation || reservation.status !== "ACTIVE") {
      return false;
    }

    for (const item of reservation.items) {
      const inv = db.inventory.get(item.product_id);
      if (inv) {
        inv.reserved_quantity = Math.max(0, inv.reserved_quantity - item.quantity);
        inv.updated_at = new Date().toISOString();
      }
    }

    reservation.status = status;
    return true;
  }

  /**
   * Direct atomic stock deduction with zero-oversell rollback safeguard (REQ-F-019).
   */
  public static deductStockAtomic(productId: string, quantity: number): { success: boolean; error?: string } {
    this.releaseExpiredReservations();
    const inv = db.inventory.get(productId);

    if (!inv) {
      return { success: false, error: "PRODUCT_NOT_FOUND" };
    }

    if (quantity <= 0) {
      return { success: false, error: "INVALID_QUANTITY" };
    }

    if ((inv.quantity_available - inv.reserved_quantity) < quantity) {
      return { success: false, error: "INSUFFICIENT_STOCK" };
    }

    inv.quantity_available -= quantity;
    inv.updated_at = new Date().toISOString();

    this.evaluateLowStockAlerts(inv);

    return { success: true };
  }

  /**
   * Update stock levels and safety stock thresholds (REQ-F-010, REQ-F-016).
   */
  public static updateStock(productId: string, quantityAvailable: number, safetyThreshold?: number): InventoryItem {
    let inv = db.inventory.get(productId);
    if (!inv) {
      inv = {
        product_id: productId,
        quantity_available: Math.max(0, quantityAvailable),
        safety_stock_threshold: safetyThreshold ?? InventoryEngine.DEFAULT_SAFETY_STOCK_THRESHOLD,
        reserved_quantity: 0,
        updated_at: new Date().toISOString()
      };
      db.inventory.set(productId, inv);
    } else {
      inv.quantity_available = Math.max(0, quantityAvailable);
      if (safetyThreshold !== undefined) {
        inv.safety_stock_threshold = Math.max(0, safetyThreshold);
      }
      inv.updated_at = new Date().toISOString();
    }

    this.evaluateLowStockAlerts(inv);
    return inv;
  }

  /**
   * Trigger asynchronous notifications to Slack and Admin Dashboard on low-stock breach (REQ-F-014, REQ-F-015).
   */
  public static evaluateLowStockAlerts(inv: InventoryItem): AlertNotification[] {
    const product = db.products.get(inv.product_id);
    const productName = product ? product.name : inv.product_id;
    const sku = product ? product.sku : inv.product_id;
    const generatedAlerts: AlertNotification[] = [];

    if (inv.quantity_available <= inv.safety_stock_threshold) {
      // 1. Slack notification (REQ-F-014)
      const slackAlert: AlertNotification = {
        alert_id: "alt_slack_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        type: "LOW_STOCK",
        channel: "SLACK",
        message: `⚠️ [LOW STOCK ALERT] Product "${productName}" (${sku}) is down to ${inv.quantity_available} units (Safety Threshold: ${inv.safety_stock_threshold}).`,
        metadata: { product_id: inv.product_id, sku, current_stock: inv.quantity_available, threshold: inv.safety_stock_threshold },
        created_at: new Date().toISOString(),
        acknowledged: false
      };
      db.alerts.push(slackAlert);
      generatedAlerts.push(slackAlert);

      // 2. Admin Dashboard alert (REQ-F-015)
      const dashboardAlert: AlertNotification = {
        alert_id: "alt_dash_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        type: "LOW_STOCK",
        channel: "ADMIN_DASHBOARD",
        message: `Low stock warning for ${productName}: ${inv.quantity_available} remaining.`,
        metadata: { product_id: inv.product_id, sku, current_stock: inv.quantity_available, threshold: inv.safety_stock_threshold },
        created_at: new Date().toISOString(),
        acknowledged: false
      };
      db.alerts.push(dashboardAlert);
      generatedAlerts.push(dashboardAlert);
    }

    return generatedAlerts;
  }

  public static getInventoryStatus(productId?: string): InventoryItem[] {
    this.releaseExpiredReservations();
    if (productId) {
      const item = db.inventory.get(productId);
      return item ? [item] : [];
    }
    return Array.from(db.inventory.values());
  }
}
