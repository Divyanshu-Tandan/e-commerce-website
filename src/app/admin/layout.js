"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === "admin") {
            setIsAdmin(true);
          } else {
            router.push("/");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/admin" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === "/admin" ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"}`}>
            Dashboard
          </Link>
          <Link href="/admin/products" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === "/admin/products" ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50"}`}>
            Products
          </Link>
          <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-500 transition-colors mt-4">
            ← Back to Store
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold">Store Management</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-black/50">
          {children}
        </div>
      </main>
    </div>
  );
}
