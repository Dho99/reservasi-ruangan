"use client"

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LoginLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  welcomeTitle?: string;
  welcomeDescription?: string;
  sideImageBg?: string;
}

export function ModernLoginLayout({
  children,
  title = "Hello!",
  description = "Sign in to your account",
  welcomeTitle = "Welcome Back!",
  welcomeDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra magna nisl.",
  sideImageBg = "bg-gradient-to-br from-purple-600 to-blue-600",
}: LoginLayoutProps) {

  const pathname = usePathname();

  const isLoginPage = pathname.includes("/login");

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 transition-colors duration-300">
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Form */}
        <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2 lg:p-12 z-10 relative">
          <div className="w-full max-w-sm space-y-8 text-center md:text-left">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="text-slate-500">{description}</p>
            </div>
            
            {children}

            <div className="mt-4 text-center text-sm text-slate-500">
              {isLoginPage ? "Don't" : ""} have an account?{" "}
              <Link href={`/user/${isLoginPage ? "register" : "login"}`} className="font-medium text-blue-600 hover:underline">
                {isLoginPage ? "Register here" : "Login here"}
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Decor */}
        <div className={cn("relative hidden w-1/2 md:block overflow-hidden", sideImageBg)}>
            {/* Wave SVG */}
            <div className="absolute left-0 top-0 h-full w-full z-10">
                 <svg
                    className="h-full w-auto text-white fill-current"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    <path d="M0 0 C 50 0 50 100 100 100 V 0 Z" fill="currentColor" opacity="0" /> 
                    {/* Custom Wave Shape matching the image style more closely */}
                    <path d="M0,0 L0,100 C50,80 20,20 100,0 Z" className="hidden" />
                 </svg>
                 
                 {/* Actual Wave Overlay */}
                 <div className="absolute left-[-1px] top-0 bottom-0 w-16 overflow-hidden">
                     <svg 
                        viewBox="0 0 500 150" 
                        preserveAspectRatio="none" 
                        className="h-full w-full text-white fill-current transform scale-y-[2.5] origin-top"
                        style={{ transform: 'rotate(90deg) scale(2, 1) translateY(-30%)' }}
                     >
                        <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" />
                     </svg>
                 </div>
            </div>

            <div className="flex h-full flex-col items-center justify-center px-12 text-center text-white z-20 relative">
                <h2 className="mb-4 text-3xl font-bold">{welcomeTitle}</h2>
                <p className="text-blue-100">
                    {welcomeDescription}
                </p>
            </div>
            
        </div>
      </div>
    </div>
  );
}
