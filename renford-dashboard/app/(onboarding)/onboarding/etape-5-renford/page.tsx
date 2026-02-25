"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRenfordQualifications } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import { useUploadFile } from "@/hooks/uploads";
import { cn } from "@/lib/utils";
import {
  NIVEAU_EXPERIENCE,
  NIVEAU_EXPERIENCE_LABELS,
} from "@/validations/profil-renford";
import {
  onboardingRenfordQualificationsSchema,
  OnboardingRenfordQualificationsSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape5RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordQualifications();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const [justificatifDiplome, setJustificatifDiplome] = useState<string | null>(
    user?.profilRenford?.justificatifDiplomeChemin || null
  );
  const [justificatifCartePro, setJustificatifCartePro] = useState<
    string | null
  >(user?.profilRenford?.justificatifCarteProfessionnelleChemin || null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordQualificationsSchema>({
    resolver: zodResolver(onboardingRenfordQualificationsSchema),
    defaultValues: {
      niveauExperience: user?.profilRenford?.niveauExperience || undefined,
      diplomes: user?.profilRenford?.diplomes || "",
      justificatifDiplomeChemin:
        user?.profilRenford?.justificatifDiplomeChemin || undefined,
      justificatifCarteProfessionnelleChemin:
        user?.profilRenford?.justificatifCarteProfessionnelleChemin ||
        undefined,
      tarifHoraire: user?.profilRenford?.tarifHoraire || undefined,
      proposeJournee: user?.profilRenford?.proposeJournee || false,
      tarifJournee: user?.profilRenford?.tarifJournee || undefined,
      proposeDemiJournee: user?.profilRenford?.proposeDemiJournee || false,
      tarifDemiJournee: user?.profilRenford?.tarifDemiJournee || undefined,
    },
  });

  const proposeJournee = watch("proposeJournee");
  const proposeDemiJournee = watch("proposeDemiJournee");
  const justificatifDiplomeFileName = justificatifDiplome
    ? justificatifDiplome.split("/").pop()
    : null;
  const justificatifCarteProFileName = justificatifCartePro
    ? justificatifCartePro.split("/").pop()
    : null;

  const handleUploadDiplome = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({ file, path: "documents/diplomes" });
      setJustificatifDiplome(result.path);
      setValue("justificatifDiplomeChemin", result.path, { shouldDirty: true });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    }
  };

  const handleUploadCartePro = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({ file, path: "documents/carte-pro" });
      setJustificatifCartePro(result.path);
      setValue("justificatifCarteProfessionnelleChemin", result.path, {
        shouldDirty: true,
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    }
  };

  const onSubmit = (data: OnboardingRenfordQualificationsSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-6-renford");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={5}
      totalSteps={8}
      title="Qualifications et Expériences"
      subtitle="Montrez vos compétences aux établissements"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Niveau d&apos;expérience</Label>
          <Controller
            name="niveauExperience"
            control={control}
            render={({ field }) => (
              <div className="space-y-3 mt-2">
                {NIVEAU_EXPERIENCE.map((niveau) => (
                  <button
                    key={niveau}
                    type="button"
                    onClick={() => field.onChange(niveau)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all text-left",
                      field.value === niveau
                        ? "border-primary bg-primary"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="font-medium text-gray-900">
                      {NIVEAU_EXPERIENCE_LABELS[niveau]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          />
          <ErrorMessage>{errors.niveauExperience?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="diplomes">Diplôme(s)</Label>
          <Textarea
            id="diplomes"
            placeholder="Ex: BPJEPS, CQP ALS, STAPS..."
            rows={2}
            {...register("diplomes")}
          />
          <ErrorMessage>{errors.diplomes?.message}</ErrorMessage>
        </div>

        <div>
          <Label>Justificatif diplôme (optionnel)</Label>
          {justificatifDiplome ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Document téléchargé</p>
                <p className="text-xs text-gray-500">
                  {justificatifDiplomeFileName || "Cliquez pour modifier"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setJustificatifDiplome(null);
                  setValue("justificatifDiplomeChemin", undefined, {
                    shouldDirty: true,
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="w-full p-6 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <>
                  <p className="text-sm text-gray-500 text-center">
                    Ajoutez votre justificatif de diplôme (PDF, JPG, PNG)
                  </p>
                  <Button variant="outline" type="button">
                    Télécharger un document
                  </Button>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleUploadDiplome}
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        <div>
          <Label>Justificatif carte professionnelle (optionnel)</Label>
          {justificatifCartePro ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Document téléchargé</p>
                <p className="text-xs text-gray-500">
                  {justificatifCarteProFileName || "Cliquez pour modifier"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setJustificatifCartePro(null);
                  setValue(
                    "justificatifCarteProfessionnelleChemin",
                    undefined,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="w-full p-6 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <>
                  <p className="text-sm text-gray-500 text-center">
                    Ajoutez votre justificatif de carte professionnelle
                  </p>
                  <Button variant="outline" type="button">
                    Télécharger un document
                  </Button>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleUploadCartePro}
                disabled={isUploading}
              />
            </label>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Tarification</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tarifHoraire">Tarif horaire*</Label>
              <div className="relative">
                <Input
                  id="tarifHoraire"
                  type="number"
                  min={10}
                  max={500}
                  placeholder="Exemple : 50€/heure"
                  {...register("tarifHoraire", { valueAsNumber: true })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  €
                </span>
              </div>
              <p className="text-xs text-secondary-dark mt-2">
                Indiquez ici le montant que vous facturez à l&apos;heure.
              </p>
              <ErrorMessage>{errors.tarifHoraire?.message}</ErrorMessage>
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="proposeJournee"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="proposeJournee"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="proposeJournee"
                className="cursor-pointer font-normal"
              >
                Je propose des prestations facturées à la journée
              </Label>
            </div>

            {proposeJournee && (
              <div>
                <Label htmlFor="tarifJournee">Tarif à la journée</Label>
                <div className="relative">
                  <Input
                    id="tarifJournee"
                    type="number"
                    min={100}
                    max={5000}
                    placeholder="Exemple : 300€ pour une journée de service"
                    {...register("tarifJournee", { valueAsNumber: true })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    €
                  </span>
                </div>
                <p className="text-xs text-secondary-dark mt-2">
                  Indiquez le montant pour une prestation complète, quel que
                  soit le nombre d&apos;heures travaillées.
                </p>
                <ErrorMessage>{errors.tarifJournee?.message}</ErrorMessage>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Controller
                name="proposeDemiJournee"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="proposeDemiJournee"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="proposeDemiJournee"
                className="cursor-pointer font-normal"
              >
                Je propose des prestations facturées à demi-journée
              </Label>
            </div>

            {proposeDemiJournee && (
              <div>
                <Label htmlFor="tarifDemiJournee">
                  Tarif à la demi-journée
                </Label>
                <div className="relative">
                  <Input
                    id="tarifDemiJournee"
                    type="number"
                    min={50}
                    max={2000}
                    placeholder="Exemple : 150€ pour une demi-journée"
                    {...register("tarifDemiJournee", { valueAsNumber: true })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    €
                  </span>
                </div>
                <p className="text-xs text-secondary-dark mt-2">
                  Indiquez votre tarif de base pour une demi-journée de
                  prestation.
                </p>
                <ErrorMessage>{errors.tarifDemiJournee?.message}</ErrorMessage>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Retour
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Suivant
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
