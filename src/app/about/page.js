"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Trusted Tech Partner
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              We build scalable, secure, and user-centric web applications that
              drive real business results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-2">Scalability</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Built on modern architecture to handle millions of users seamlessly.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-2">Security</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Enterprise-grade security with end-to-end encryption and regular audits.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-2">Performance</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Optimized for speed and efficiency, ensuring fast response times.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Ready to Scale?</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}