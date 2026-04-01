import { cn } from "@/lib/utils";
import Image from "next/image";
import { H4 } from "../ui/typography";

type Props = {
  className?: string;
  size?: "sm" | "lg" | "xl";
  onlyIcon?: boolean;
};

export function Logo({ className, size = "lg", onlyIcon }: Props) {
  return (
    <div className={cn("flex items-center gap-2 text-black", className)}>
      <Image
        src="/logo.png"
        alt="Renford"
        width={size === "sm" ? 32 : size === "lg" ? 40 : 56}
        height={size === "sm" ? 32 : size === "lg" ? 40 : 56}
      />
      {!onlyIcon && <H4>renford</H4>}
    </div>
  );
}
