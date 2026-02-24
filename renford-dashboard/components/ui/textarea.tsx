import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-3xl px-3 py-2 text-sm transition-colors border border-gray-200",
        "placeholder:text-gray-400 focus-visible:outline-none bg-white focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-secondary/60",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
