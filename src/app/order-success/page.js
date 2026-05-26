"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        if (res.ok) {
          setConfirmed(true);
        }
      } catch (err) {
        console.error("Order confirmation failed:", err);
      } finally {
        setLoading(false);
      }
    };
    confirmOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col items-center justify-center px-6 relative selection:bg-blue-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-green-500/10 to-blue-500/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="w-full max-w-lg text-center z-10 animate-fade-in-up">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Payment Successful!</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {orderId && (
          <p className="text-sm text-zinc-500 mb-10 font-mono bg-zinc-100 dark:bg-zinc-900 inline-block px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
            Order ID: {orderId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/orders" className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md">
            View My Orders
          </Link>
          <Link href="/products" className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
