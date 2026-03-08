import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
};

const LoadingScreen = ({ className }: Props) => {
  return (
    <main
      className={cn(
        "flex h-screen w-full items-center justify-center bg-secondary-background",
        className
      )}
    >
      <Image
        src="/logo-dark.png"
        alt="logo"
        height={200}
        width={200}
        className="h-[100px] w-auto animate-pulse"
      />
    </main>
  );
};

export default LoadingScreen;
