"use client";

import { H1 } from "@/components/ui/typography";
import { useCompleteRenfordOnboarding } from "@/hooks/onboarding";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Etape8RenfordPage() {
  const router = useRouter();
  const { mutate: completeOnboarding, isPending } =
    useCompleteRenfordOnboarding();

  useEffect(() => {
    completeOnboarding(undefined, {
      onSuccess: () => {
        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      },
    });
  }, [completeOnboarding, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-secondary-background">
      <div className="mb-8">
        <Image
          src="/logo-dark.png"
          alt="Renford"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>

      <H1 className="text-2xl font-bold text-gray-900 mb-4">
        Échauffez-vous, l&apos;aventure commence bientôt !
      </H1>

      {isPending && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
    </div>
  );
}
