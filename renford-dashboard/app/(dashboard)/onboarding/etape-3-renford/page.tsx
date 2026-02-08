"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateRenfordIdentite } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import { useUploadFile } from "@/hooks/uploads";
import {
  onboardingRenfordIdentiteSchema,
  OnboardingRenfordIdentiteSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape3RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordIdentite();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const [attestationVigilance, setAttestationVigilance] = useState<
    string | null
  >(user?.profilRenford?.attestationVigilanceChemin || null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordIdentiteSchema>({
    resolver: zodResolver(onboardingRenfordIdentiteSchema),
    defaultValues: {
      siret: user?.profilRenford?.siret || "",
      attestationAutoEntrepreneur:
        user?.profilRenford?.attestationAutoEntrepreneur || false,
      adresse: user?.profilRenford?.adresse || "",
      codePostal: user?.profilRenford?.codePostal || "",
      ville: user?.profilRenford?.ville || "",
      pays: user?.profilRenford?.pays || "France",
      dateNaissance: user?.profilRenford?.dateNaissance
        ? new Date(user.profilRenford.dateNaissance)
        : undefined,
      attestationVigilanceChemin:
        user?.profilRenford?.attestationVigilanceChemin || undefined,
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({ file, path: "documents/vigilance" });
      setAttestationVigilance(result.path);
      setValue("attestationVigilanceChemin", result.path, {
        shouldDirty: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    }
  };

  const removeFile = () => {
    setAttestationVigilance(null);
    setValue("attestationVigilanceChemin", undefined, { shouldDirty: true });
  };

  const onSubmit = (data: OnboardingRenfordIdentiteSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-4-renford");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={3}
      totalSteps={8}
      title="Génial, confirmons votre activité et identité légales"
      subtitle="Ces informations restent confidentielles"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="flex items-center gap-2">
          <Controller
            name="attestationAutoEntrepreneur"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="attestationAutoEntrepreneur"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor="attestationAutoEntrepreneur"
            className="cursor-pointer font-normal"
          >
            J&apos;atteste être auto-entrepreneur
          </Label>
        </div>

        <div>
          <Label htmlFor="adresse">Adresse*</Label>
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

        <div>
          <Label htmlFor="pays">Pays*</Label>
          <Input id="pays" placeholder="France" {...register("pays")} />
          <ErrorMessage>{errors.pays?.message}</ErrorMessage>
        </div>

        <div>
          <Label>Date de naissance*</Label>
          <Controller
            name="dateNaissance"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner une date"
              />
            )}
          />
          <ErrorMessage>{errors.dateNaissance?.message}</ErrorMessage>
        </div>

        <div>
          <Label>Attestation de vigilance (optionnel)</Label>
          <p className="text-sm text-gray-500 mb-2">
            Document attestant de votre situation administrative
          </p>

          {attestationVigilance ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Document téléchargé</p>
                <p className="text-xs text-gray-500">Cliquez pour modifier</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Cliquez pour télécharger
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, JPG ou PNG (max 5 Mo)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          )}
          <ErrorMessage>
            {errors.attestationVigilanceChemin?.message}
          </ErrorMessage>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isPending || !isDirty}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Continuer
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
