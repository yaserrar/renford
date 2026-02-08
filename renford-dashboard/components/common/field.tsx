"use client";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  value: string | number;
  className?: string;
};

export function Field({ label, value, className }: FieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className={cn("text-base text-gray-500")}>{label}</p>
      <p className={cn("text-base font-medium text-gray-900")}>
        {value || "-"}
      </p>
    </div>
  );
}
