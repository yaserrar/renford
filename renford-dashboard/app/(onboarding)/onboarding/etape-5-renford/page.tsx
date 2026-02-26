"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DocumentUploadDialog from "@/components/common/document-upload-dialog";
import { Combobox } from "@/components/ui/combobox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateRenfordQualifications } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import { cn } from "@/lib/utils";
import {
  DIPLOME_KEYS,
  DIPLOME_LABELS,
  NIVEAU_EXPERIENCE,
  NIVEAU_EXPERIENCE_LABELS,
} from "@/validations/profil-renford";
import {
  onboardingRenfordQualificationsSchema,
  OnboardingRenfordQualificationsSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { OnboardingCard } from "../-components";

const diplomeOptions = DIPLOME_KEYS.map((key) => ({
  value: key,
  label: DIPLOME_LABELS[key],
}));

export default function Etape5RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordQualifications();
  const [diplomeDialogOpen, setDiplomeDialogOpen] = useState(false);
  const [carteProDialogOpen, setCarteProDialogOpen] = useState(false);
  const [activeDiplomeForUpload, setActiveDiplomeForUpload] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm<
    z.input<typeof onboardingRenfordQualificationsSchema>,
    unknown,
    OnboardingRenfordQualificationsSchema
  >({
    resolver: zodResolver(onboardingRenfordQualificationsSchema),
    defaultValues: {
      niveauExperience: user?.profilRenford?.niveauExperience || undefined,
      diplomes: user?.profilRenford?.diplomes || [],
      justificatifDiplomeChemins:
        user?.profilRenford?.justificatifDiplomeChemins || [],
      justificatifCarteProfessionnelleChemin:
        user?.profilRenford?.justificatifCarteProfessionnelleChemin || "",
      tarifHoraire: user?.profilRenford?.tarifHoraire || undefined,
      proposeJournee: user?.profilRenford?.proposeJournee || false,
      tarifJournee: user?.profilRenford?.tarifJournee || undefined,
      proposeDemiJournee: user?.profilRenford?.proposeDemiJournee || false,
      tarifDemiJournee: user?.profilRenford?.tarifDemiJournee || undefined,
    },
  });

  const proposeJournee = watch("proposeJournee");
  const proposeDemiJournee = watch("proposeDemiJournee");
  const diplomesSelectionnes = watch("diplomes") || [];
  const justificatifDiplomeChemins = watch("justificatifDiplomeChemins") || [];
  const justificatifCartePro = watch("justificatifCarteProfessionnelleChemin");
  const justificatifCarteProFileName = useMemo(
    () => (justificatifCartePro ? justificatifCartePro.split("/").pop() : null),
    [justificatifCartePro],
  );

  const onSubmit = (data: OnboardingRenfordQualificationsSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-6-renford");
      },
    });
  };

  const handleDiplomeUploaded = useCallback(
    (path: string) => {
      if (!activeDiplomeForUpload) return;

      const diplomes = getValues("diplomes") || [];
      const index = diplomes.findIndex(
        (diplome) => diplome === activeDiplomeForUpload,
      );

      if (index < 0) return;

      const updatedChemins = [
        ...(getValues("justificatifDiplomeChemins") || []),
      ];
      updatedChemins[index] = path;

      setValue("justificatifDiplomeChemins", updatedChemins, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      setActiveDiplomeForUpload(null);
    },
    [activeDiplomeForUpload, getValues, setValue],
  );

  const handleCarteProUploaded = useCallback(
    (path: string) => {
      setValue("justificatifCarteProfessionnelleChemin", path, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

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
                      "w-full flex text-sm items-center gap-3 px-4 py-2 rounded-full border-1 transition-all text-left",
                      field.value === niveau
                        ? "border-primary bg-primary"
                        : "border-gray-200 hover:border-gray-300",
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
          <Label htmlFor="diplomes">Diplôme(s)*</Label>
          <Controller
            name="diplomes"
            control={control}
            render={({ field }) => (
              <Combobox
                multiple
                value={field.value || []}
                onValueChange={(value) => {
                  const nextDiplomes = value as string[];
                  const currentDiplomes = field.value || [];
                  const currentChemins =
                    getValues("justificatifDiplomeChemins") || [];

                  const cheminByDiplome = new Map(
                    currentDiplomes.map((diplome, index) => [
                      diplome,
                      currentChemins[index] || "",
                    ]),
                  );

                  const nextChemins = nextDiplomes.map(
                    (diplome) => cheminByDiplome.get(diplome) || "",
                  );

                  field.onChange(nextDiplomes);
                  setValue("justificatifDiplomeChemins", nextChemins, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                options={diplomeOptions as { value: string; label: string }[]}
                placeholder="Sélectionner un ou plusieurs diplômes"
                searchPlaceholder="Rechercher un diplôme"
                emptyMessage="Aucun diplôme trouvé"
              />
            )}
          />
          <p className="text-xs text-secondary-dark mt-2">
            Sélection multiple selon l&apos;annexe des diplômes sport.
          </p>
          <ErrorMessage>{errors.diplomes?.message}</ErrorMessage>
        </div>

        <div>
          <Label>Justificatifs de diplôme *</Label>
          {diplomesSelectionnes.length === 0 ? (
            <div className="w-full p-6 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 text-center">
                Sélectionnez au moins un diplôme pour ajouter ses justificatifs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {diplomesSelectionnes.map((diplome, index) => {
                const chemin = justificatifDiplomeChemins[index] || "";
                const fileName = chemin ? chemin.split("/").pop() : null;

                return (
                  <div
                    key={diplome}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <p className="text-sm font-medium mb-2">
                      {DIPLOME_LABELS[diplome as keyof typeof DIPLOME_LABELS]}
                    </p>

                    {chemin ? (
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Document téléchargé
                          </p>
                          <p className="text-xs text-gray-500">
                            {fileName || "Cliquez pour modifier"}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveDiplomeForUpload(diplome);
                            setDiplomeDialogOpen(true);
                          }}
                        >
                          Modifier
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = [...justificatifDiplomeChemins];
                            updated[index] = "";
                            setValue("justificatifDiplomeChemins", updated, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                          Aucun justificatif ajouté pour ce diplôme.
                        </p>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            setActiveDiplomeForUpload(diplome);
                            setDiplomeDialogOpen(true);
                          }}
                        >
                          Télécharger un document
                        </Button>
                      </div>
                    )}

                    <ErrorMessage>
                      {
                        (errors.justificatifDiplomeChemins as any)?.[index]
                          ?.message
                      }
                    </ErrorMessage>
                  </div>
                );
              })}
            </div>
          )}
          <ErrorMessage>
            {(errors.justificatifDiplomeChemins as any)?.message}
          </ErrorMessage>
        </div>

        <div>
          <Label>Justificatif carte professionnelle *</Label>
          {Boolean(justificatifCartePro) ? (
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
                  setValue("justificatifCarteProfessionnelleChemin", "", {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full p-6 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 text-center">
                Ajoutez votre justificatif de carte professionnelle
              </p>
              <Button
                variant="outline"
                type="button"
                onClick={() => setCarteProDialogOpen(true)}
              >
                Télécharger un document
              </Button>
            </div>
          )}
          <ErrorMessage>
            {errors.justificatifCarteProfessionnelleChemin?.message}
          </ErrorMessage>
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
                  className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Exemple : 50€/heure"
                  {...register("tarifHoraire", { valueAsNumber: true })}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-xs border border-input"
                    >
                      ?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-left leading-relaxed">
                    Indiquez ici le montant que vous facturez à l'heure. Les
                    utilisateurs verront cette information lorsqu'ils
                    examineront votre profil. Les tarifs en IDF varient selon
                    les domaines mais sont généralement compris entre 30 et 45
                    euros pour les débutants et jusqu’à 80 euros pour les
                    profils expérimentés.
                  </TooltipContent>
                </Tooltip>
              </div>

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
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Exemple : 300€ pour une journée de service"
                    {...register("tarifJournee", { valueAsNumber: true })}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-xs border border-input"
                      >
                        ?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-left leading-relaxed">
                      Indiquez ici le montant que vous facturez pour une
                      prestation complète, quel que soit le nombre d'heures
                      travaillées. Les tarifs en IDF varient selon les domaines
                      mais sont généralement compris entre 200 et 500 euros par
                      jour.
                    </TooltipContent>
                  </Tooltip>
                </div>

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
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Exemple : 150€ pour une demi-journée"
                    {...register("tarifDemiJournee", { valueAsNumber: true })}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full text-xs border border-input"
                      >
                        ?
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-left leading-relaxed">
                      Indiquez ici votre tarif de base pour une prestation
                      complète. Vous pouvez également indiquer des tarifs
                      dégressifs en fonction du nombre d'élèves présents à la
                      session (ex : 1 à 5 élèves = 300€, 6 à 10 élèves = 250€,
                      etc.).
                    </TooltipContent>
                  </Tooltip>
                </div>

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

      <DocumentUploadDialog
        open={diplomeDialogOpen}
        setOpen={setDiplomeDialogOpen}
        setFileValue={handleDiplomeUploaded}
        path="documents/diplomes"
        name={`justificatif-diplome-${activeDiplomeForUpload ?? "renford"}`}
        accept=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={10}
      />

      <DocumentUploadDialog
        open={carteProDialogOpen}
        setOpen={setCarteProDialogOpen}
        setFileValue={handleCarteProUploaded}
        path="documents/carte-pro"
        name="justificatif-carte-professionnelle"
        accept=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={10}
      />
    </OnboardingCard>
  );
}
