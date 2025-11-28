"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernLoginLayout } from "@/components/auth/ModernLoginLayout";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
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
import { api } from "@/lib/services/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { services } from "@/lib/services";
import { useRouter } from "next/navigation";

const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email atau NIM harus diisi")
      .email("Format email tidak valid"),
    nama: z
      .string()
      .min(3, "Nama Lengkap harus diisi minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;

export default function UserRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
      const { url, method } = services.auth.register();
      api({
        method,
        url,
        data
      }).then(() => {
        toast.success("Registrasi berhasil");
        router.push('/user/login');
        // window.location.href = "/user/login";
      }).catch((error) => {
        console.log(error);
        if(error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Terjadi kesalahan saat registrasi");
        }
      }).finally(() => {
        setIsLoading(false);
      });
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
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="Nama Lengkap"
                      type="text"
                      autoCapitalize="none"
                      autoComplete=""
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
                      autoComplete=""
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" />
                    <Input
                      {...field}
                      placeholder="Konfirmasi Password"
                      type="password"
                      autoComplete="new-password"
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
            {isLoading ? "Loading..." : "REGISTER"}
          </Button>

          <Button
            className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-lg shadow-slate-500/30 border-0 h-11"
            size="lg"
            type="button"
            onClick={() => signIn("google")}
          >
            SIGN IN WITH GOOGLE
          </Button>
        </form>
      </Form>
    </ModernLoginLayout>
  );
}
