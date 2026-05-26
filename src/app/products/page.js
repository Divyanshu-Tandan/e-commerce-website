"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = ["All", "Laptops", "Smartphones", "Audio", "Accessories", "Monitors", "Furniture", "Gaming"];

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchQuery, activeCategory);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategory]);

  const fetchProducts = async (search = "", category = "All") => {
    setLoading(true);
    try {
      let url = "/api/products?";
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (category && category !== "All") url += `category=${encodeURIComponent(category)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col relative selection:bg-blue-500/30">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 to-violet-500/10 blur-3xl pointer-events-none rounded-full mix-blend-screen opacity-50 dark:opacity-20"></div>

      <header className="flex items-center justify-between px-6 py-6 w-full max-w-7xl mx-auto z-10 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-zinc-100 dark:text-zinc-900 font-bold text-xl leading-none tracking-tighter">S</span>
          </div>
          <span className="font-semibold tracking-tight text-xl">Store</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/wishlist" className="text-zinc-600 dark:text-zinc-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span className="hidden sm:inline">Wishlist</span>
          </Link>
          <Link href="/cart" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors duration-300 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-4 lg:py-10 z-10 relative">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">All Products</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-zinc-900 dark:text-zinc-50"
              />
            </div>
            {/* Category Pills */}
            <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0 px-2 md:px-0 no-scrollbar hide-scroll">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md" 
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col space-y-4 animate-pulse">
                <div className="w-full aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-zinc-500">We couldn't find anything matching your search.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-6 text-blue-600 dark:text-blue-400 font-medium hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            {products.map((product) => (
              <Link href={`/products/${product._id}`} key={product._id} className="group flex flex-col gap-4">
                <div className="w-full aspect-square relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:shadow-xl group-hover:border-blue-500/30 transition-all duration-300">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                      No Image
                    </div>
                  )}
                  {product.stockCount <= 5 && product.stockCount > 0 && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                      Only {product.stockCount} left
                    </div>
                  )}
                  {product.stockCount === 0 && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-bold rounded-full">
                        Out of Stock
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-zinc-500 line-clamp-1">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
