import { db } from "./db";
import { ReconciliationReport, AlertNotification } from "../types";

export class ReconciliationJob {
  /**
   * Run daily automated reconciliation audit (at 02:00 UTC) (REQ-F-017, REQ-F-018).
   * Audits paid transactions against created orders, flags variances as SUSPENDED_RECONCILIATION.
   */
  public static runDailyReconciliation(executedAt: string = new Date().toISOString()): ReconciliationReport {
    const orders = Array.from(db.orders.values());
    const payments = Array.from(db.payments.values());

    let matchedCount = 0;
    let varianceCount = 0;
    const flaggedOrders: string[] = [];

    // Map payments by order_id
    const paymentsByOrder = new Map<string, number>();
    for (const p of payments) {
      if (p.status === "SUCCESS") {
        paymentsByOrder.set(p.order_id, (paymentsByOrder.get(p.order_id) || 0) + p.amount);
      }
    }

    // Check all orders
    for (const order of orders) {
      if (order.status === "PAID" || order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED") {
        const paidAmount = paymentsByOrder.get(order.order_id) || 0;
        const diff = Math.abs(paidAmount - order.total_amount);

        if (diff > 0.01) {
          // Variance detected!
          varianceCount++;
          flaggedOrders.push(order.order_id);
          order.status = "SUSPENDED_RECONCILIATION";
          order.updated_at = executedAt;

          // Dispatch alert to finance team (REQ-F-018)
          const financeAlert: AlertNotification = {
            alert_id: "alt_fin_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            type: "RECONCILIATION_VARIANCE",
            channel: "FINANCE_EMAIL",
            message: `⚠️ Financial reconciliation variance detected on Order #${order.order_id}. Expected: $${order.total_amount}, Paid: $${paidAmount}. Order marked as SUSPENDED_RECONCILIATION.`,
            metadata: { order_id: order.order_id, expected: order.total_amount, actual_paid: paidAmount },
            created_at: executedAt,
            acknowledged: false
          };
          db.alerts.push(financeAlert);
        } else {
          matchedCount++;
        }
      }
    }

    const report: ReconciliationReport = {
      reconciliation_id: "rec_" + Date.now(),
      executed_at: executedAt,
      total_orders_audited: orders.length,
      total_payments_audited: payments.length,
      matched_count: matchedCount,
      variance_count: varianceCount,
      flagged_orders: flaggedOrders,
      status: varianceCount > 0 ? "VARIANCE_DETECTED" : "SUCCESS"
    };

    db.reconciliationReports.push(report);
    return report;
  }
}
