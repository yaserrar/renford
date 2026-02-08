"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import * as React from "react";

interface InputPasswordProps extends React.ComponentProps<"input"> {}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-12 w-full rounded-full px-3 py-1 text-sm transition-colors file:border-0 border border-gray-200",
            "file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none",
            "bg-white focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-secondary/60 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            "absolute top-1/2 right-4 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
          )}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeClosed className="h-5 w-5 " />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    );
  }
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
