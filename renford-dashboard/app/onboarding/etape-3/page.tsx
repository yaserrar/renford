"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateProfilEtablissement } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  TYPE_ETABLISSEMENT,
  TYPE_ETABLISSEMENT_LABELS,
} from "@/validations/etablissement";
import {
  onboardingEtablissementSchema,
  OnboardingEtablissementSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape3Page() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateProfilEtablissement();
  const [showSiegeAddress, setShowSiegeAddress] = useState(
    !!user?.profilEtablissement?.adresseSiege,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<OnboardingEtablissementSchema>({
    resolver: zodResolver(onboardingEtablissementSchema),
    defaultValues: {
      raisonSociale: user?.profilEtablissement?.raisonSociale || "",
      siret: user?.profilEtablissement?.siret || "",
      adresse: user?.profilEtablissement?.adresse || "",
      codePostal: user?.profilEtablissement?.codePostal || "",
      ville: user?.profilEtablissement?.ville || "",
      typeEtablissement:
        user?.profilEtablissement?.typeEtablissement || undefined,
      adresseSiegeDifferente: !!user?.profilEtablissement?.adresseSiege,
      adresseSiege: user?.profilEtablissement?.adresseSiege || "",
      codePostalSiege: user?.profilEtablissement?.codePostalSiege || "",
      villeSiege: user?.profilEtablissement?.villeSiege || "",
    },
  });

  const onSubmit = (data: OnboardingEtablissementSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-4");
      },
    });
  };

  return (
    <OnboardingCard currentStep={3} title="Confirmons vos informations">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="raisonSociale">Raison sociale*</Label>
          <Input
            id="raisonSociale"
            placeholder="Nom de votre entreprise"
            {...register("raisonSociale")}
          />
          <ErrorMessage>{errors.raisonSociale?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="siret">Numéro SIRET (14 chiffres)*</Label>
          <Input
            id="siret"
            placeholder="12345678901234"
            maxLength={14}
            {...register("siret")}
          />
          <ErrorMessage>{errors.siret?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="adresse">Adresse de l&apos;établissement*</Label>
          <Input
            id="adresse"
            placeholder="123 rue de la Paix"
            {...register("adresse")}
          />
          <ErrorMessage>{errors.adresse?.message}</ErrorMessage>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codePostal">Code postal*</Label>
            <Input
              id="codePostal"
              placeholder="75001"
              maxLength={5}
              {...register("codePostal")}
            />
            <ErrorMessage>{errors.codePostal?.message}</ErrorMessage>
          </div>
          <div>
            <Label htmlFor="ville">Ville*</Label>
            <Input id="ville" placeholder="Paris" {...register("ville")} />
            <ErrorMessage>{errors.ville?.message}</ErrorMessage>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSiegeAddress(!showSiegeAddress)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Plus size={16} />
          Ajouter l&apos;adresse du siège social si différente
        </button>

        {showSiegeAddress && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="adresseSiege">Adresse du siège</Label>
              <Input
                id="adresseSiege"
                placeholder="Adresse du siège social"
                {...register("adresseSiege")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codePostalSiege">Code postal</Label>
                <Input
                  id="codePostalSiege"
                  placeholder="75001"
                  maxLength={5}
                  {...register("codePostalSiege")}
                />
              </div>
              <div>
                <Label htmlFor="villeSiege">Ville</Label>
                <Input
                  id="villeSiege"
                  placeholder="Paris"
                  {...register("villeSiege")}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label>Type d&apos;établissement*</Label>
          <Controller
            name="typeEtablissement"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_ETABLISSEMENT.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_ETABLISSEMENT_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage>{errors.typeEtablissement?.message}</ErrorMessage>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/onboarding/etape-2")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending && <Loader2 className="animate-spin" />}
            Suivant
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
