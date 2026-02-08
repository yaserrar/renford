"use client";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateContact } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingContactSchema,
  OnboardingContactSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape1Page() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateContact();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<OnboardingContactSchema>({
    resolver: zodResolver(onboardingContactSchema),
    defaultValues: {
      prenom: user?.prenom || "",
      nom: user?.nom || "",
      telephone: user?.telephone || "",
    },
  });

  const onSubmit = (data: OnboardingContactSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-2");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={1}
      title="Commençons par les informations de contact"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="prenom">Prénom (contact principal)</Label>
          <Input
            id="prenom"
            placeholder="Votre prénom"
            {...register("prenom")}
          />
          <ErrorMessage>{errors.prenom?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="nom">Nom (contact principal)</Label>
          <Input id="nom" placeholder="Votre nom" {...register("nom")} />
          <ErrorMessage>{errors.nom?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="telephone">Numéro de téléphone</Label>
          <Input
            id="telephone"
            type="tel"
            placeholder="+33....."
            {...register("telephone")}
          />
          <ErrorMessage>{errors.telephone?.message}</ErrorMessage>
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Terminé
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
