"use client";

import { useCompleteOnboarding } from "@/hooks/onboarding";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Etape5Page() {
  const router = useRouter();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="Renford"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Échauffez-vous, l&apos;aventure commence bientôt !
      </h1>

      <p className="text-gray-500 mb-8">
        Nous finalisons la configuration de votre compte...
      </p>

      {isPending && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
    </div>
  );
}
