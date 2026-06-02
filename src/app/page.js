"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Scene from "@/components/Scene";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setTrending((data.products || []).slice(0, 4));
        }
      } catch (error) {
        console.error("Trending fetch failed:", error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col relative selection:bg-blue-500/30 overflow-hidden">
      {/* Background ambient effect */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-bl from-blue-500/20 to-violet-500/20 blur-[120px] pointer-events-none rounded-full mix-blend-screen opacity-50 dark:opacity-30"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 w-full max-w-7xl mx-auto z-10 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-zinc-100 dark:text-zinc-900 font-bold text-xl leading-none tracking-tighter">S</span>
          </div>
          <span className="font-semibold tracking-tight text-xl">Store</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-300 font-bold">
            Catalog
          </Link>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors hidden sm:block">
                Cart
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {user.username ? user.username[0] : "U"}
                </div>
                <span className="text-sm font-medium mr-2">{user.username}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-300">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300 shadow-sm hover:shadow-md active:scale-95">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 z-10 relative flex flex-col justify-center py-20 lg:py-32">
        <div className="max-w-3xl animate-fade-in-up" style={{ animationFillMode: "both" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New Collection Dropped
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Elevate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              digital lifestyle.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            Discover our curated collection of premium electronics, ergonomic furniture, and modern accessories designed to inspire your best work.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/products" className="group flex items-center justify-center gap-2 h-14 px-8 w-full sm:w-auto rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/10 text-lg">
              Shop Collection
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform duration-300"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
            {!user && (
              <Link href="/register" className="group flex items-center justify-center gap-2 h-14 px-8 w-full sm:w-auto rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-300 active:scale-95 text-lg">
                Create Account
              </Link>
            )}
          </div>

        </div>

        {/* 3D Model Container positioned to the right */}
        <div className="absolute hidden lg:block top-1/3 -translate-y-72 right-0 w-full lg:w-[45%] h-[50vh] min-h-[300px] pointer-events-none lg:pointer-events-auto opacity-30 lg:opacity-100 -z-10 lg:z-10 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <Scene />
        </div>

        {/* Trending Section */}
        {trending.length > 0 && (
          <div className="mt-32 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
              <Link href="/products" className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm flex items-center gap-1">
                View all <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product) => (
                <Link href={`/products/${product._id}`} key={product._id} className="group flex flex-col gap-3">
                  <div className="w-full aspect-square relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:shadow-xl transition-all duration-300">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-sm">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
                    <p className="font-medium text-sm text-zinc-500">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
