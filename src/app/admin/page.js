"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch these from an API
    // For now, we simulate fetching stats
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setStats((prev) => ({ ...prev, products: data.products?.length || 0 }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 mb-1">Total Products</h3>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 mb-1">Total Orders</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-500 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
      </div>
    </div>
  );
}
