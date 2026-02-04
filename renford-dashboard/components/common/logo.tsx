import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
  size?: "sm" | "lg" | "xl";
};

export function Logo({ className, size }: Props) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center justify-center">
        <Image
          alt="CAP'Lecture Maroc Logo"
          src="/logo.png"
          width={
            size == "sm" ? 50 : size == "lg" ? 80 : size == "xl" ? 130 : 60
          }
          height={
            size == "sm" ? 50 : size == "lg" ? 80 : size == "xl" ? 130 : 60
          }
        />
      </div>
    </div>
  );
}
