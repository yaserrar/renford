"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionPlanCardProps {
  name: string;
  missions: string;
  price: string;
  priceLabel?: string;
  description: string[];
  buttonLabel: string;
  onButtonClick?: () => void;
  recommended?: boolean;
  badgeLabel?: string;
  variant?: "default" | "custom";
  isCurrentPlan?: boolean;
}

export default function SubscriptionPlanCard({
  name,
  missions,
  price,
  priceLabel,
  description,
  buttonLabel,
  onButtonClick,
  recommended = false,
  badgeLabel,
  variant = "default",
  isCurrentPlan = false,
}: SubscriptionPlanCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-3xl border bg-card text-center",
        recommended ? "border-3 border-primary" : "border-input",
      )}
    >
      {/* Recommended badge - positioned on top border */}
      {recommended && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-primary text-foreground text-xs font-medium px-3 py-0.5 rounded-sm">
            Recommandé
          </Badge>
        </div>
      )}

      {/* Volume illimitée badge - positioned top right */}
      {badgeLabel && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-secondary text-white text-xs font-medium px-3 py-0.5 rounded-sm">
            {badgeLabel}
          </Badge>
        </div>
      )}

      <div
        className={cn(
          "p-4 rounded-t-3xl bg-gray-100 w-full",
          recommended && "bg-primary-background w-full",
          badgeLabel && "bg-secondary-background w-full",
        )}
      >
        {/* Plan name */}
        <h3 className="text-lg font-bold text-foreground tracking-wide uppercase">
          {name}
        </h3>

        {/* Missions count */}
        <p className="text-sm font-semibold text-foreground mt-1">{missions}</p>
      </div>
      {/* Price */}
      <div className="mt-4 mb-4">
        {variant === "custom" ? (
          <p className="text-base font-semibold text-foreground">{price}</p>
        ) : (
          <div className="flex items-baseline gap-1 justify-center">
            <span className="text-2xl font-bold text-foreground">{price}</span>
            {priceLabel && (
              <span className="text-sm text-muted-foreground">
                {priceLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Description lines */}
      <div className="flex-1 space-y-0.5 mb-6">
        {description.map((line, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            {line}
          </p>
        ))}
      </div>

      {/* CTA Button */}
      {isCurrentPlan ? (
        <Button
          variant="dark"
          className="mx-4 mb-6 opacity-60 cursor-not-allowed bg-gray-300 text-black"
          disabled
        >
          Votre plan actuel
        </Button>
      ) : (
        <Button
          variant={recommended ? "default" : "secondary"}
          className="mx-4 mb-6"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      )}

      {/* "Le plus choisi" label */}
      {recommended && (
        <p className="text-xs mt-2 absolute -bottom-2 bg-white">
          Le plus choisi
        </p>
      )}
    </div>
  );
}
