import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border border-input placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border border-transparent bg-white px-3 py-2 text-sm",
        "shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
