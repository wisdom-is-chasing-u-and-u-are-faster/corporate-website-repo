import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(10);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchMetrics = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleUpdateInventory = async (productId: string) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          quantity_available: editStock,
          safety_stock_threshold: editThreshold
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage("Inventory & safety threshold updated successfully!");
        setEditingSku(null);
        fetchMetrics();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleTriggerReconciliation = async () => {
    try {
      const res = await fetch("/api/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ execution_time: new Date().toISOString() })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Daily 02:00 UTC Reconciliation Completed! Audited: ${data.report.total_orders_audited} orders. Variances: ${data.report.variance_count}`);
        fetchMetrics();
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ADMIN SIDEBAR (Matching Variant A Admin Mockup) */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <Link href="/" className="logo text-2xl font-bold font-serif block mb-8 text-gray-900 dark:text-white">
            Aura<span className="text-[#F9A8B6]">.</span>{" "}
            <span className="font-sans font-normal text-gray-400 text-sm">Admin</span>
          </Link>
          <ul className="space-y-2 list-none p-0 m-0">
            <li>
              <a href="#" className="block px-4 py-2.5 rounded-lg font-semibold bg-pink-50 dark:bg-pink-950/40 text-[#E97188]">
                Dashboard & Stock
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2.5 rounded-lg font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                Orders
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2.5 rounded-lg font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                Products
              </a>
            </li>
            <li>
              <button
                onClick={handleTriggerReconciliation}
                className="w-full text-left px-4 py-2.5 rounded-lg font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Run 02:00 Reconciliation
              </button>
            </li>
          </ul>
        </div>
        <div>
          <Link href="/" className="block px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* MAIN ADMIN VIEW */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif">Elena&apos;s Operations Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time inventory engine, low-stock alerts, & reconciliation controls.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleTriggerReconciliation}
              className="btn btn-secondary text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              Run 02:00 UTC Audit
            </button>
            <Link href="/product-catalog" className="btn btn-primary text-sm px-4 py-2 text-white rounded-lg bg-gradient-to-r from-[#F9A8B6] to-[#D4AF7A]">
              View Storefront
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 mb-6 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 rounded-xl border border-green-200 text-sm font-medium">
            ✓ {statusMessage}
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="label text-xs font-semibold text-gray-500 uppercase mb-1">Total Revenue</p>
            <p className="value text-3xl font-bold font-serif text-gray-900 dark:text-white">
              ${metrics.stats.total_revenue.toLocaleString()}
            </p>
          </div>
          <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="label text-xs font-semibold text-gray-500 uppercase mb-1">Today&apos;s Sales</p>
            <p className="value text-3xl font-bold font-serif text-gray-900 dark:text-white">
              ${metrics.stats.today_sales.toLocaleString()}
            </p>
          </div>
          <div className="stat-card bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="label text-xs font-semibold text-gray-500 uppercase mb-1">Active Orders</p>
            <p className="value text-3xl font-bold font-serif text-gray-900 dark:text-white">
              {metrics.stats.new_orders}
            </p>
          </div>
        </div>

        {/* ALERTS SECTION (REQ-F-014, REQ-F-015) */}
        {metrics.alerts && metrics.alerts.length > 0 && (
          <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
            <h3 className="text-lg font-bold font-serif text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
              <span>🔔</span> Active Low-Stock & System Alerts ({metrics.alerts.length})
            </h3>
            <div className="space-y-2">
              {metrics.alerts.map((alert: any) => (
                <div key={alert.alert_id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-amber-900 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 mr-2">
                      {alert.channel}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{alert.message}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(alert.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVENTORY TABLE (Matching Variant A Admin Mockup) */}
        <div className="card bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h4 className="text-lg font-bold font-serif">Products & Real-Time Inventory Control</h4>
            <span className="text-xs text-gray-500">Default Safety Threshold: 10 units</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Stock Available</th>
                  <th className="p-4 font-semibold">Safety Threshold</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.products.map((item: any) => (
                  <tr key={item.product_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 font-mono text-gray-500 text-xs">{item.sku}</td>
                    <td className="p-4 font-bold">
                      {editingSku === item.sku ? (
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded dark:bg-gray-900 text-sm font-bold"
                          value={editStock}
                          onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                        />
                      ) : (
                        item.stock
                      )}
                    </td>
                    <td className="p-4 text-gray-500">
                      {editingSku === item.sku ? (
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded dark:bg-gray-900 text-sm"
                          value={editThreshold}
                          onChange={(e) => setEditThreshold(parseInt(e.target.value) || 10)}
                        />
                      ) : (
                        item.threshold
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`badge font-semibold px-2.5 py-1 rounded-full text-xs ${
                          item.badge === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                            : item.badge === "warning"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {editingSku === item.sku ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdateInventory(item.product_id)}
                            className="btn btn-primary text-xs px-3 py-1.5 text-white rounded bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSku(null)}
                            className="btn btn-secondary text-xs px-3 py-1.5 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingSku(item.sku);
                            setEditStock(item.stock);
                            setEditThreshold(item.threshold);
                          }}
                          className="text-[#E97188] hover:underline font-semibold text-xs"
                        >
                          Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
