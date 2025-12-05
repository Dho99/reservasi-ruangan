"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernLoginLayout } from "@/components/auth/ModernLoginLayout";
import { FiUser, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/admin/dashboard",
      });
    } catch (err) {
      setError("Gagal login dengan Google");
      setIsLoading(false);
    }
  };

  return (
    <ModernLoginLayout
      title="Admin Portal"
      description="Sign in to manage system"
      welcomeTitle="System Administrator"
      welcomeDescription="Kelola ruangan, jadwal, dan persetujuan dengan efisiensi tinggi. Selamat bekerja."
      sideImageBg="bg-gradient-to-br from-slate-800 to-black"
    >
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-slate-400" />
            <Input
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-full"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-slate-400" />
            <Input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-full"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
            />
            <label
              htmlFor="remember"
              className="text-slate-500 cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>
          <Link
            href="#"
            className="font-medium text-slate-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-500/30 border-0 h-11"
          size="lg"
        >
          {isLoading ? "Signing in..." : "SIGN IN"}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">
              Atau
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="w-full rounded-full h-11 border-slate-300 hover:bg-slate-50"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>

        {/* Admin Notice */}
        <div className="text-center text-xs text-slate-500 mt-4">
          <p>🔒 Admin access only</p>
          <p>Use your @unsil.ac.id email</p>
        </div>
      </form>
    </ModernLoginLayout>
  );
}


