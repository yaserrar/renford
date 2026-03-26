"use client";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdateRenfordBancaire,
  useSkipRenfordStep,
} from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingRenfordBancaireSchema,
  OnboardingRenfordBancaireSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape6RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordBancaire();
  const { mutate: skipStep, isPending: isSkipping } = useSkipRenfordStep();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordBancaireSchema>({
    resolver: zodResolver(onboardingRenfordBancaireSchema),
    defaultValues: {
      iban: user?.profilRenford?.iban || "",
    },
  });

  const onSubmit = (data: OnboardingRenfordBancaireSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-7-renford");
      },
    });
  };

  const handleSkip = () => {
    skipStep(6, {
      onSuccess: () => {
        router.push("/onboarding/etape-7-renford");
      },
    });
  };

  return (
    <>
      <OnboardingCard
        currentStep={6}
        totalSteps={8}
        title="Informations bancaires"
        subtitle="Pour recevoir vos paiements"
        description="Renford s’appuie sur Stripe pour la gestion, la sécurisation et la
          vérification de vos informations bancaires. Vos données (IBAN)
          sont transmises de manière chiffrée à Stripe, qui les traite
          conformément aux obligations légales (KYC) et
          aux normes de sécurité internationales. Renford n’accède jamais à vos
          données bancaires. En continuant, vous acceptez le
          traitement de ces informations par Stripe conformément à sa politique
          de confidentialité."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="iban">IBAN*</Label>
            <Input
              id="iban"
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              {...register("iban")}
            />
            <ErrorMessage>{errors.iban?.message}</ErrorMessage>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-4">
            <Button
              type="button"
              variant="link"
              onClick={handleSkip}
              disabled={isPending || isSkipping}
              className="text-gray-500"
            >
              {isSkipping && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Passer cette étape
            </Button>

            <div className="flex flex-col md:flex-row md:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending || isSkipping}
              >
                Retour
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Suivant
              </Button>
            </div>
          </div>
        </form>
      </OnboardingCard>
    </>
  );
}
