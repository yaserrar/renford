"use client";

import DocumentUploadDialog from "@/components/common/document-upload-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateProfilRenfordQualifications } from "@/hooks/profil-renford";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import {
  NIVEAU_EXPERIENCE,
  NIVEAU_EXPERIENCE_LABELS,
  updateProfilRenfordQualificationsSchema,
  UpdateProfilRenfordQualificationsSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileText, Loader2, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type QualificationEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

export default function QualificationEditDialog({
  open,
  setOpen,
  me,
}: QualificationEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordQualifications();
  const [carteProDialogOpen, setCarteProDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<
    z.input<typeof updateProfilRenfordQualificationsSchema>,
    unknown,
    UpdateProfilRenfordQualificationsSchema
  >({
    resolver: zodResolver(updateProfilRenfordQualificationsSchema),
    defaultValues: {
      niveauExperience: profil?.niveauExperience || undefined,
      justificatifCarteProfessionnelleChemin:
        profil?.justificatifCarteProfessionnelleChemin || "",
      tarifHoraire: profil?.tarifHoraire || undefined,
      proposeJournee: profil?.proposeJournee || false,
      tarifJournee: profil?.tarifJournee || undefined,
      proposeDemiJournee: profil?.proposeDemiJournee || false,
      tarifDemiJournee: profil?.tarifDemiJournee || undefined,
    },
  });

  const proposeJournee = watch("proposeJournee");
  const proposeDemiJournee = watch("proposeDemiJournee");
  const justificatifCartePro = watch("justificatifCarteProfessionnelleChemin");

  const justificatifCarteProFileName = useMemo(
    () => (justificatifCartePro ? justificatifCartePro.split("/").pop() : null),
    [justificatifCartePro]
  );

  const onSubmit = (data: UpdateProfilRenfordQualificationsSchema) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const handleCarteProUploaded = useCallback(
    (path: string) => {
      setValue("justificatifCarteProfessionnelleChemin", path, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Modifier les qualifications</DialogTitle>
              <DialogDescription>
                Gérez votre niveau, justificatif carte pro et vos tarifs.
              </DialogDescription>
            </DialogHeader>

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
                        className={`w-full flex text-sm items-center gap-3 px-4 py-2 rounded-full border transition-all text-left ${
                          field.value === niveau
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-medium">
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
              <Label>Justificatif carte professionnelle *</Label>
              {Boolean(justificatifCartePro) ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Document téléchargé</p>
                    <a
                      href={getUrl(justificatifCartePro)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      {justificatifCarteProFileName || "Ouvrir le document"}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCarteProDialogOpen(true)}
                  >
                    Modifier
                  </Button>
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
                        Indiquez ici le montant que vous facturez à
                        l&apos;heure.
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
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
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
                    <Input
                      id="tarifJournee"
                      type="number"
                      min={100}
                      max={5000}
                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Exemple : 300€"
                      {...register("tarifJournee", { valueAsNumber: true })}
                    />
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
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
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
                    <Input
                      id="tarifDemiJournee"
                      type="number"
                      min={50}
                      max={2000}
                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Exemple : 150€"
                      {...register("tarifDemiJournee", { valueAsNumber: true })}
                    />
                    <ErrorMessage>
                      {errors.tarifDemiJournee?.message}
                    </ErrorMessage>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DocumentUploadDialog
        open={carteProDialogOpen}
        setOpen={setCarteProDialogOpen}
        setFileValue={handleCarteProUploaded}
        path="documents/carte-pro"
        name="justificatif-carte-professionnelle"
        accept=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={10}
      />
    </>
  );
}
