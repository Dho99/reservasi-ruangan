"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernLoginLayout } from "@/components/auth/ModernLoginLayout";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function UserLoginPage() {
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

      // Redirect to dashboard after successful login
      router.push("/user/dashboard");
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
        callbackUrl: "/user/dashboard",
      });
    } catch (err) {
      setError("Gagal login dengan Google");
      setIsLoading(false);
    }
  };

  return (
    <ModernLoginLayout
      title="Hello!"
      description="Sign in to your account"
      welcomeTitle="Welcome Back!"
      welcomeDescription="Akses layanan reservasi ruangan kampus dengan mudah dan cepat. Masuk untuk melanjutkan."
      sideImageBg="bg-gradient-to-br from-slate-800 to-black"
    >
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-slate-400" />
            <Input
              id="email"
              placeholder="NIM / Email Kampus"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
            />
          </div>
        </div>

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
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
            />
            <label
              htmlFor="remember"
              className="text-slate-500 cursor-pointer select-none dark:text-slate-400"
            >
              Remember me
            </label>
          </div>
          <Link
            href="#"
            className="font-medium text-slate-600 hover:underline dark:text-slate-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg shadow-slate-500/30 border-0 h-11"
          size="lg"
        >
          {isLoading ? "Signing in..." : "SIGN IN"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
              Atau
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="w-full rounded-full h-11 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Belum punya akun?{" "}
          <Link
            href="/user/register"
            className="font-medium text-slate-600 hover:underline dark:text-slate-400"
          >
            Daftar
          </Link>
        </div>
      </form>
    </ModernLoginLayout>
  );
}
