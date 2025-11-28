"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernLoginLayout } from "@/components/auth/ModernLoginLayout";
import { FiMail, FiLock } from "react-icons/fi";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "Email atau NIM harus diisi").email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function UserLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // Ubah ke false untuk handle manual
        email: data.email,
        password: data.password,
      });
      console.log(result);
      if (result?.error) {

        // Error dari credentials provider
        form.setError("root", {
          type: "manual",
          message: result?.code
        });
      } else if (result?.ok) {
        // Login berhasil, redirect manual
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      form.setError("root", {
        type: "manual",
        message: "Terjadi kesalahan saat login"
      });
    } finally {
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
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
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
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all rounded-full"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs pl-3" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <Link
              href="#"
              className="font-medium text-slate-600 hover:underline dark:text-slate-400"
            >
              Forgot password?
            </Link>
          </div>

          {form.formState.errors.root && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button
            className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg shadow-slate-500/30 border-0 h-11"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "SIGN IN"}
          </Button>

          <Button
            className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg shadow-slate-500/30 border-0 h-11"
            size="lg"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/user/dashboard" })}
          >
            SIGN IN WITH GOOGLE
          </Button>
        </form>
      </Form>
    </ModernLoginLayout>
  );
}
