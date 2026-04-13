"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  maxStars?: number;
  size?: number;
  className?: string;
};

export default function StarRating({
  rating,
  maxStars = 5,
  size = 20,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "transition-colors",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-amber-400/40",
          )}
          size={size}
        />
      ))}
    </div>
  );
}
