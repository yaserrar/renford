import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  className?: string;
};

const Loading = ({ className }: Props) => {
  return (
    <main
      className={cn(
        "flex h-[600px] w-full items-center justify-center bg-secondary-background border rounded-lg",
        className,
      )}
    >
      <Loader2 size={30} className="animate-spin text-secondary" />
    </main>
  );
};

export default Loading;
