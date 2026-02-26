import { cn } from "@/lib/utils";
import Image from "next/image";
import { H4 } from "../ui/typography";

type Props = {
  className?: string;
  size?: "sm" | "lg" | "xl";
};

export function Logo({ className, size }: Props) {
  return (
    <div className={cn("flex items-center gap-2 text-black", className)}>
      <Image src="/logo.png" alt="Renford" width={40} height={40} />
      <H4>renford</H4>
    </div>
  );
}
