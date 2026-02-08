import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
};

const LoadingScreen = ({ className }: Props) => {
  return (
    <main
      className={cn(
        "flex h-screen w-full items-center justify-center",
        className
      )}
    >
      <Image
        alt="Renford Logo"
        src="/logo.png"
        width={150}
        height={150}
        className="animate-bounce"
      />
    </main>
  );
};

export default LoadingScreen;
