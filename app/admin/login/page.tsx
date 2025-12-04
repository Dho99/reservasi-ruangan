"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernLoginLayout } from "@/components/auth/ModernLoginLayout";
import { FiUser, FiLock } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function AdminLoginPage() {

    const loginSchema = z.object({
      email: z.string().min(1, "Email atau NIM harus diisi").email("Format email tidak valid"),
      password: z.string().min(6, "Password minimal 6 karakter"),
    });
    
    type LoginFormValues = z.infer<typeof loginSchema>;

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
            router.push("/admin/dashboard");
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

            {form.formState.errors.root && (
              <div className="text-sm text-red-500 text-center">
                {form.formState.errors.root.message}
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded border-slate-300 text-slate-600 focus:ring-slate-500" />
                <label htmlFor="remember" className="text-slate-500 cursor-pointer select-none">Remember me</label>
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
                SIGN IN WITH GOOGLE
          </Button>
          </form>
        </Form>
    </ModernLoginLayout>
  );
}
