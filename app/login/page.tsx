"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Activity } from "lucide-react";
import { signIn } from "next-auth/react";

import { FadeIn } from "../components/PageAnimate";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Check if we just registered
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered")) {
      setSuccessMsg("Account created. Please log in.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Intercept for local storage test before NextAuth connects to Neon
      const localUser = localStorage.getItem("tradexa_temp_user");
      if (localUser) {
        const parsed = JSON.parse(localUser);
        if (parsed.email === formData.email && parsed.password === formData.password) {
           // Simulate a successful local login for testing
           setTimeout(() => {
             router.push("/overview");
           }, 500);
           return;
        }
      }

      // 2. Use NextAuth signIn to authenticate against Neon Postgres Database
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/overview");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <FadeIn delay={0.1}>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="text-gray-400 mt-2">Log in to your Tradexa account.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              {successMsg && (
                <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                  {successMsg}
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input 
                    type="text"
                    inputMode="email" 
                    required
                    tabIndex={1}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <Link href="#" tabIndex={4} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    required
                    tabIndex={2}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  tabIndex={3}
                  disabled={isLoading}
                  className="w-full h-12 mt-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-white hover:underline transition-all">
                  Sign up
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
