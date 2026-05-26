"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  const statusColor = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    refunded: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400",
  };

  const deliveryColor = {
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    shipped: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col relative selection:bg-blue-500/30">
      <header className="flex items-center px-6 py-6 w-full max-w-5xl mx-auto z-10 relative">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 z-10 relative">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M16 16h6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/><path d="M19 22v-6"/></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-zinc-500 mb-6">Start shopping to see your orders here.</p>
            <Link href="/products" className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Order ID:</span>{" "}
                      <span className="font-mono font-medium">{order._id.slice(-8)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Date:</span>{" "}
                      <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Total:</span>{" "}
                      <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[order.paymentStatus] || ""}`}>
                      {order.paymentStatus}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${deliveryColor[order.deliveryStatus] || ""}`}>
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="w-14 h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">N/A</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product?.name || "Product"}</p>
                        <p className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
