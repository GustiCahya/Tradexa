"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FadeIn } from "../components/PageAnimate";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(64, "Full name must be at most 64 characters.")
    .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const json = await res.json();
        setServerError(json.message || "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 my-14 relative z-10">
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
              <h1 className="text-3xl font-bold text-white tracking-tight">Create an account</h1>
              <p className="text-gray-400 mt-2">Start journaling your trades today.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              {serverError && (
                <div className="mb-6 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="John Doe"
                    className={`w-full h-12 px-4 rounded-lg bg-white/5 border text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                      errors.name
                        ? "border-orange-500 focus:border-orange-500 focus:ring-orange-500"
                        : "border-white/10 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-orange-400 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    type="text"
                    inputMode="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full h-12 px-4 rounded-lg bg-white/5 border text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                      errors.email
                        ? "border-orange-500 focus:border-orange-500 focus:ring-orange-500"
                        : "border-white/10 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-orange-400 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className={`w-full h-12 px-4 rounded-lg bg-white/5 border text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all ${
                      errors.password
                        ? "border-orange-500 focus:border-orange-500 focus:ring-orange-500"
                        : "border-white/10 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.password && (
                    <p className="text-xs text-orange-400 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline transition-all">
                  Log in
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
