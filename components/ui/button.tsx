import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
      secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 animate-spin">⚪</span> // Simple loader placeholder
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

