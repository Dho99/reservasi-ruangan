"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernLoginLayout } from "@/components/auth/ModernLoginLayout";
import { FiMail, FiLock } from "react-icons/fi";
import { signIn } from "next-auth/react";

export default function UserLoginPage() {
  return (
    <ModernLoginLayout
      title="Hello!"
      description="Sign in to your account"
      welcomeTitle="Welcome Back!"
      welcomeDescription="Akses layanan reservasi ruangan kampus dengan mudah dan cepat. Masuk untuk melanjutkan."
      sideImageBg="bg-gradient-to-br from-slate-800 to-black"
    >
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-slate-400" />
            <Input
              id="email"
              placeholder="NIM / Email Kampus"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
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
              autoComplete="current-password"
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
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
              className="text-slate-500 cursor-pointer select-none"
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
          className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg shadow-slate-500/30 border-0 h-11"
          size="lg"
        >
          <Link href="/user/dashboard" className="w-full">
            SIGN IN
          </Link>
        </Button>

        <Button
          className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg shadow-slate-500/30 border-0 h-11"
          size="lg"
        onClick={() => signIn("google")}
        >
          SIGN IN WITH GOOGLE
        </Button>
      </div>
    </ModernLoginLayout>
  );
}
