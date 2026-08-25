import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PaymentGateway } from "../types";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [reservationExpired, setReservationExpired] = useState<boolean>(false);
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "Sophia",
    lastName: "Chen",
    email: "sophia.chen@example.com",
    address: "1234 Market St.",
    city: "San Francisco",
    state: "CA",
    zip: "94103"
  });

  // Load cart from LocalStorage & initialize 5-minute stock reservation (REQ-F-006, REQ-F-011)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("aura_cart");
      let items = savedCart ? JSON.parse(savedCart) : [];

      // If empty in storage, initialize with sample items from design mockup
      if (items.length === 0) {
        items = [
          {
            product_id: "p1111111-1111-1111-1111-111111111111",
            sku: "SKU-H-101",
            name: "Radiant Hydration Serum",
            price: 65.0,
            quantity: 1,
            image_url: "https://i.ibb.co/LQrM2r2/cosmetic-mockup-1.png"
          },
          {
            product_id: "p2222222-2222-2222-2222-222222222222",
            sku: "SKU-L-205",
            name: "Velvet Matte Lipstick",
            price: 32.0,
            quantity: 1,
            image_url: "https://i.ibb.co/qNbP61k/cosmetic-mockup-2.png"
          }
        ];
        localStorage.setItem("aura_cart", JSON.stringify(items));
      }

      setCartItems(items);

      // Reserve stock for 5 minutes (REQ-F-011)
      fetch("/api/checkout/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i: any) => ({ product_id: i.product_id, quantity: i.quantity })),
          duration_minutes: 5
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReservationId(data.reservation_id);
            setTimeLeft(300);
          } else {
            setError(data.message || "Failed to reserve stock. Items may be out of stock.");
          }
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 5-minute Countdown Timer (REQ-F-011, REQ-F-013)
  useEffect(() => {
    if (timeLeft <= 0) {
      setReservationExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingFee = subtotal > 50 ? 0.0 : 5.0;
  const taxes = Number((subtotal * 0.09).toFixed(2));
  const total = Number((subtotal + shippingFee + taxes).toFixed(2));

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reservationExpired) {
      setError("Your 5-minute cart reservation has expired. Please refresh the page to reserve again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Submit Single-Page Order with Tokenized Payment (REQ-F-005, REQ-F-007, REQ-F-012)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_email: formData.email,
          shipping_address: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            address_line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zip,
            country: "USA"
          },
          items: cartItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
          payment_gateway: paymentGateway,
          payment_token: `tok_${paymentGateway.toLowerCase()}_${Date.now()}`,
          reservation_id: reservationId
        })
      });

      const data = await res.json();

      if (data.success) {
        // Clear LocalStorage cart on completion (REQ-F-006)
        localStorage.removeItem("aura_cart");
        router.push(`/order-confirmation?order_id=${data.order_id}&total=${data.total_amount}&tracking=${data.tracking_number || ""}`);
      } else {
        setError(data.message || "Failed to process order.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
      <Header cartCount={cartItems.length} />

      <main id="main-content" className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold font-serif mb-2">Secure Checkout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Single-page frictionless checkout</p>
          </div>

          {/* 5-MINUTE RESERVATION BANNER (REQ-F-011) */}
          <div className={`p-4 rounded-xl mb-8 flex items-center justify-between border ${
            reservationExpired
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 text-red-800 dark:text-red-300"
              : "bg-pink-50 dark:bg-pink-950/40 border-pink-200 text-pink-900 dark:text-pink-300"
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <p className="font-semibold text-sm">
                  {reservationExpired
                    ? "Cart reservation expired. Items released back to inventory pool."
                    : "Your cart items are reserved for 5 minutes."}
                </p>
                <p className="text-xs opacity-80">
                  {reservationExpired
                    ? "Please reload the checkout page to re-reserve available inventory."
                    : "Stock is locked for you while you complete your purchase."}
                </p>
              </div>
            </div>
            {!reservationExpired && (
              <div className="text-lg font-mono font-bold px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {formatTimer(timeLeft)}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 rounded-xl border border-red-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="checkout-grid grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* LEFT 2 COLUMNS: FORMS */}
            <div className="lg:col-span-2 card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmitOrder}>
                {/* 1. SHIPPING INFORMATION */}
                <div id="checkout-shipping">
                  <h3 className="text-xl font-bold font-serif mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                    1. Shipping Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="email" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Email Address (for order tracking)
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="address" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zip" className="form-label block text-xs font-semibold text-gray-500 uppercase mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        className="form-input w-full px-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. PAYMENT METHOD SELECTION (REQ-F-007) */}
                <div id="checkout-payment" className="mt-10">
                  <h3 className="text-xl font-bold font-serif mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    2. Payment Method
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    All transactions are secure, tokenized, and encrypted.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Razorpay Option */}
                    <div
                      onClick={() => setPaymentGateway("RAZORPAY")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        paymentGateway === "RAZORPAY"
                          ? "border-[#E97188] bg-pink-50/50 dark:bg-pink-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="gateway"
                          checked={paymentGateway === "RAZORPAY"}
                          onChange={() => setPaymentGateway("RAZORPAY")}
                          className="text-[#E97188] focus:ring-[#E97188]"
                        />
                        <div>
                          <p className="font-semibold text-sm">Razorpay Checkout</p>
                          <p className="text-xs text-gray-500">Cards, UPI, Netbanking</p>
                        </div>
                      </div>
                      <img src="https://cdn.razorpay.com/static/assets/logo/rzp-pr-bg.png" alt="Razorpay" className="h-6" />
                    </div>

                    {/* PayPal Option */}
                    <div
                      onClick={() => setPaymentGateway("PAYPAL")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        paymentGateway === "PAYPAL"
                          ? "border-[#B88B4A] bg-amber-50/50 dark:bg-amber-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="gateway"
                          checked={paymentGateway === "PAYPAL"}
                          onChange={() => setPaymentGateway("PAYPAL")}
                          className="text-[#B88B4A] focus:ring-[#B88B4A]"
                        />
                        <div>
                          <p className="font-semibold text-sm">PayPal Express</p>
                          <p className="text-xs text-gray-500">PayPal Wallet, Cards</p>
                        </div>
                      </div>
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.png" alt="PayPal" className="h-6" />
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gray-50 dark:bg-gray-900/60">
                    <label className="form-label block text-xs font-semibold text-gray-500 uppercase mb-2">
                      Card Details (hosted by {paymentGateway === "RAZORPAY" ? "Razorpay" : "PayPal"})
                    </label>
                    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-400 flex items-center justify-between shadow-inner">
                      <span>•••• •••• •••• 4242</span>
                      <span className="text-xs">MM/YY | CVC</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading || reservationExpired}
                    className="btn btn-primary w-full py-4 text-base font-bold text-white rounded-xl bg-gradient-to-r from-[#F9A8B6] to-[#D4AF7A] shadow-md hover:shadow-lg disabled:opacity-50 transition-all text-center"
                  >
                    {loading ? "Processing Secure Order..." : `Place Order ($${total.toFixed(2)})`}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
            <div className="card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 sticky top-24">
              <h4 className="text-lg font-bold font-serif mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Order Summary
              </h4>

              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 object-contain p-1"
                      />
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-medium text-sm">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold font-serif pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🔒 256-Bit SSL Encrypted Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
