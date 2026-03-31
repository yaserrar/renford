import { Briefcase } from "lucide-react";
import Loading from "./loading";

type CenterStateProps = {
  title: string;
  description: string;
  isLoading?: boolean;
  className?: string;
};

function CenterState({
  title,
  description,
  isLoading,
  className,
}: CenterStateProps) {
  return (
    <div
      className={`flex min-h-[360px] items-center justify-center px-4 py-8 border bg-secondary-background rounded-lg ${className}`}
    >
      <div className="w-full max-w-md rounded-2xl border border-dashed border-border bg-white p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary-dark">
          {isLoading ? (
            <Loading className="h-6 w-6 animate-spin" />
          ) : (
            <Briefcase className="h-6 w-6" />
          )}
        </div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default CenterState;
