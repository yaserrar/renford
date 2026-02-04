import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

type Props = {
  className?: string;
  message?: string;
};

const Error = ({ className, message }: Props) => {
  return (
    <main
      className={cn(
        "flex h-40 flex-col items-center justify-center rounded-lg border shadow-lg bg-white",
        className
      )}
    >
      <AlertTriangle size={25} />
      <p className="font-medium">{message ?? "Une erreur s'est produite"}</p>
    </main>
  );
};

export default Error;
