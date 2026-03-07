import { cn } from "@/lib/utils";
import Image from "next/image";
import { Logo } from "./logo";

type Props = {
  className?: string;
};

const LoadingScreen = ({ className }: Props) => {
  return (
    <main
      className={cn(
        "flex h-screen w-full items-center justify-center",
        className,
      )}
    >
      <Logo size="lg" className="animate-bounce" />
    </main>
  );
};

export default LoadingScreen;
