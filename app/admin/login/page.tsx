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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 text-slate-400" />
                      <Input
                        {...field}
                        placeholder="Email"
                        type="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={isLoading}
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
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
                        disabled={isLoading}
                        className="pl-10 bg-slate-50 border-slate-200 focus:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-300 shadow-lg shadow-slate-500/30 border-0 h-11" 
              size="lg"
            >
              {isLoading ? "Loading..." : "SIGN IN"}
            </Button>

            <Button
                className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-300 shadow-lg shadow-slate-500/30 border-0 h-11"
                size="lg"
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
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

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
          <p>🔒 Admin access only</p>
          <p>Use your @unsil.ac.id email</p>
        </div>
      </form>
    </ModernLoginLayout>
  );
}
