"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const { id } = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
        } else {
          router.push("/products");
        }
      } catch (err) {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1, action: "add" }),
      });
      if (res.ok) {
        alert("Added to cart!");
      } else if (res.status === 401) {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    setAddingToWishlist(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, action: "add" }),
      });
      if (res.ok) {
        alert("Added to wishlist!");
      } else if (res.status === 401) {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col relative selection:bg-blue-500/30">
      <header className="flex items-center px-6 py-6 w-full max-w-7xl mx-auto z-10 relative">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Store
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 z-10 relative animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Images Section */}
          <div className="space-y-4">
            <div className="w-full aspect-square relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
              {product.images && product.images[0] ? (
                <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  No Image Available
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-blue-500 transition-colors">
                    <img src={img} alt={`${product.name} ${i+2}`} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col pt-4 lg:pt-10">
            <div className="mb-2">
              <span className="text-sm font-medium px-3 py-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full text-zinc-600 dark:text-zinc-400">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="text-2xl font-semibold mb-6 flex items-center gap-4">
              ${product.price.toFixed(2)}
              {product.stockCount > 0 ? (
                <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-lg">
                  In Stock
                </span>
              ) : (
                <span className="text-sm font-medium px-2 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <button 
                onClick={handleAddToCart}
                disabled={product.stockCount === 0 || addingToCart}
                className="w-full sm:flex-1 h-14 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
                {!addingToCart && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
              </button>
              
              <button 
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className="w-full sm:w-auto h-14 px-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!addingToWishlist && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>}
                <span className={addingToWishlist ? "" : "sm:hidden"}>{addingToWishlist ? "Saving..." : "Save to Wishlist"}</span>
              </button>
            </div>
            
            {/* Features / Guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 9h18"/><path d="M9 15h.01"/></svg>
                Secure Payment
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                Fast Shipping
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
