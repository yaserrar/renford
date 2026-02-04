"use client";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  value: string | number;
  className?: string;
  isRTL?: boolean;
};

export function Field({ label, value, className, isRTL = false }: FieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p
        className={cn(
          "text-base text-gray-500",
          isRTL && "text-right font-arabic"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-base font-medium text-gray-900",
          isRTL && "text-right font-arabic"
        )}
      >
        {value || "-"}
      </p>
    </div>
  );
}
