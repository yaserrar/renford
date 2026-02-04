"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

interface InputPasswordProps extends React.ComponentProps<"input"> {
  isRTL?: boolean;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, isRTL = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div>
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-12 w-full rounded-sm px-3 py-1 text-sm transition-colors file:border-0",
            "file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-primary-dark/30 focus-visible:outline-none",
            "bg-primary-background focus-visible:border-primary/60 focus-visible:ring-0 focus-visible:ring-secondary/60 disabled:cursor-not-allowed disabled:opacity-50",
            isRTL ? "pr-10 pl-3" : "pr-10 pl-3",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors",
            isRTL ? "left-3" : "right-3"
          )}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
