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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="NIM / Email Kampus"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs pl-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs pl-3" />
              </FormItem>
            )}
          />

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

          <Button
            className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-300 shadow-lg shadow-slate-500/30 border-0 h-11"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "SIGN IN"}
          </Button>

          <Button
            className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-300 shadow-lg shadow-slate-500/30 border-0 h-11"
            size="lg"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/user/dashboard" })}
          >
            Daftar
          </Link>
        </div>
      </form>
    </ModernLoginLayout>
  );
}
