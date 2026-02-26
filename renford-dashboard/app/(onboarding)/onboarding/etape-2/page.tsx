"use client";

import { Button } from "@/components/ui/button";
import { useUpdateType } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import { cn } from "@/lib/utils";
import {
  onboardingTypeSchema,
  OnboardingTypeSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

const typeOptions = [
  {
    value: "etablissement" as const,
    label: "Un Établissement",
    description: "(je cherche du renfort)",
    icon: Building2,
  },
  {
    value: "renford" as const,
    label: "Un Renford",
    description: "(je travaille dans le sport)",
    icon: User,
  },
];

export default function Etape2Page() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateType();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<OnboardingTypeSchema>({
    resolver: zodResolver(onboardingTypeSchema),
    defaultValues: {
      typeUtilisateur:
        user?.typeUtilisateur === "etablissement" ||
        user?.typeUtilisateur === "renford"
          ? user.typeUtilisateur
          : undefined,
    },
  });

  const selectedType = watch("typeUtilisateur");

  const onSubmit = (data: OnboardingTypeSchema) => {
    mutate(data, {
      onSuccess: () => {
        // Selon le type, rediriger vers l'étape appropriée
        if (data.typeUtilisateur === "etablissement") {
          router.push("/onboarding/etape-3");
        } else {
          // Pour les Renfords, on aurait une étape différente
          router.push("/onboarding/etape-3-renford");
        }
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={2}
      title="Prêt à commencer ? Dites-nous qui vous êtes"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="mb-4">Je suis ...</p>

          <Controller
            name="typeUtilisateur"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-full border-1 transition-all text-left",
                      field.value === option.value
                        ? "border-primary bg-primary"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                      <span className="text-gray-900 ml-1">
                        {option.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/onboarding/etape-1")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending || !selectedType}>
            {isPending && <Loader2 className="animate-spin" />}
            Suivant
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
