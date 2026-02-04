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
        alt="CAP'Lecture Maroc"
        src="/logo.png"
        width={250}
        height={120}
        className="animate-bounce"
      />
    </main>
  );
};

export default LoadingScreen;
