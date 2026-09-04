import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { order_id, total, tracking } = router.query;

  const displayOrderId = typeof order_id === "string" ? order_id : "AU-173649";
  const displayTotal = typeof total === "string" ? `$${parseFloat(total).toFixed(2)}` : "$110.73";
  const displayTracking = typeof tracking === "string" && tracking ? tracking : "AU-TRK-94820194";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
      <Header cartCount={0} />

      <main id="main-content" className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <div className="card bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            {/* CHECKMARK ICON */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2 text-gradient">
              Thank You!
            </h1>
            <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6 font-sans">
              Your order has been placed and payment confirmed.
            </h3>

            <div className="bg-gray-50 dark:bg-gray-900/60 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-left mb-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Reference:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">#{displayOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Paid:</span>
                <span className="font-bold text-gray-900 dark:text-white">{displayTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Carrier Tracking Number:</span>
                <span className="font-mono text-[#E97188] font-bold">{displayTracking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Delivery:</span>
                <span className="font-medium text-gray-900 dark:text-white">3-5 Business Days (USPS Express)</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              We&apos;ve sent a detailed confirmation email with receipt details, ingredient information, and tracking updates.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/product-catalog" className="btn btn-primary px-8 py-3.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[#F9A8B6] to-[#D4AF7A] shadow-md hover:shadow-lg transition-all">
                Continue Shopping
              </Link>
              <Link href="/" className="btn btn-secondary px-8 py-3.5 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
