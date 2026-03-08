"use client";

import DocumentUploadDialog from "@/components/common/document-upload-dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import { useUpdateProfilRenfordDiplomes } from "@/hooks/profil-renford";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import {
  DIPLOME_KEYS,
  DIPLOME_LABELS,
  updateProfilRenfordDiplomesSchema,
  UpdateProfilRenfordDiplomesSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileText, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

const diplomeOptions = DIPLOME_KEYS.map((key) => ({
  value: key,
  label: DIPLOME_LABELS[key],
}));

type DiplomesEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

export default function DiplomesEditDialog({
  open,
  setOpen,
  me,
}: DiplomesEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordDiplomes();
  const [diplomeDialogOpen, setDiplomeDialogOpen] = useState(false);
  const [activeDiplomeIndexForUpload, setActiveDiplomeIndexForUpload] =
    useState<number | null>(null);

  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfilRenfordDiplomesSchema>({
    resolver: zodResolver(updateProfilRenfordDiplomesSchema),
    defaultValues: {
      renfordDiplomes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "renfordDiplomes",
  });

  const diplomes = watch("renfordDiplomes") || [];

  const activeDiplomeLabel = useMemo(() => {
    if (activeDiplomeIndexForUpload === null) return "diplome";
    const typeDiplome = getValues(
      `renfordDiplomes.${activeDiplomeIndexForUpload}.typeDiplome`
    );
    if (!typeDiplome) return "diplome";
    return DIPLOME_LABELS[typeDiplome] || "diplome";
  }, [activeDiplomeIndexForUpload, getValues]);

  useEffect(() => {
    if (!open) return;

    reset({
      renfordDiplomes:
        profil?.renfordDiplomes?.map((diplome) => ({
          typeDiplome: diplome.typeDiplome,
          anneeObtention: diplome.anneeObtention,
          mention: diplome.mention,
          etablissementFormation: diplome.etablissementFormation,
          justificatifDiplomeChemin: diplome.justificatifDiplomeChemin,
        })) ?? [],
    });
  }, [open, profil?.renfordDiplomes, reset]);

  const onSubmit = (data: UpdateProfilRenfordDiplomesSchema) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const openDiplomeDialog = (index: number) => {
    setActiveDiplomeIndexForUpload(index);
    setDiplomeDialogOpen(true);
  };

  const handleDiplomeUploaded = (path: string) => {
    if (activeDiplomeIndexForUpload === null) return;

    setValue(
      `renfordDiplomes.${activeDiplomeIndexForUpload}.justificatifDiplomeChemin`,
      path,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );

    setActiveDiplomeIndexForUpload(null);
  };

  return (
    <>
      <DocumentUploadDialog
        key={`diplome-upload-${activeDiplomeIndexForUpload ?? "none"}`}
        open={diplomeDialogOpen}
        setOpen={(value) => {
          setDiplomeDialogOpen(value);
          if (!value) {
            setActiveDiplomeIndexForUpload(null);
          }
        }}
        setFileValue={handleDiplomeUploaded}
        path="documents/diplomes"
        name={`justificatif-diplome-${activeDiplomeLabel
          .toLowerCase()
          .replace(/[\s_]+/g, "-")}`}
        accept=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={10}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Modifier les certifications & formations</DialogTitle>
              <DialogDescription>
                Ajoutez ou supprimez vos diplômes et certifications.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun diplôme ajouté.
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-input p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Diplôme {index + 1}</p>
                    <Button
                      type="button"
                      variant="outline-destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={isPending}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div>
                    <Label>Diplôme*</Label>
                    <Controller
                      name={`renfordDiplomes.${index}.typeDiplome`}
                      control={control}
                      render={({ field }) => (
                        <Combobox
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value as string)}
                          options={diplomeOptions}
                          placeholder="Sélectionner un diplôme"
                          searchPlaceholder="Rechercher un diplôme"
                          emptyMessage="Aucun diplôme trouvé"
                        />
                      )}
                    />
                    <ErrorMessage>
                      {errors.renfordDiplomes?.[index]?.typeDiplome?.message}
                    </ErrorMessage>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Année d&apos;obtention</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 2021"
                        {...register(`renfordDiplomes.${index}.anneeObtention`, {
                          setValueAs: (value) =>
                            value === "" || value === undefined
                              ? null
                              : Number(value),
                        })}
                      />
                      <ErrorMessage>
                        {
                          errors.renfordDiplomes?.[index]?.anneeObtention
                            ?.message
                        }
                      </ErrorMessage>
                    </div>

                    <div>
                      <Label>Établissement</Label>
                      <Input
                        {...register(
                          `renfordDiplomes.${index}.etablissementFormation`
                        )}
                      />
                      <ErrorMessage>
                        {
                          errors.renfordDiplomes?.[index]?.etablissementFormation
                            ?.message
                        }
                      </ErrorMessage>
                    </div>
                  </div>

                  <div>
                    <Label>Mention</Label>
                    <Input {...register(`renfordDiplomes.${index}.mention`)} />
                    <ErrorMessage>
                      {errors.renfordDiplomes?.[index]?.mention?.message}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Label>Justificatif diplôme *</Label>
                    {diplomes[index]?.justificatifDiplomeChemin ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Document téléchargé</p>
                          <a
                            href={getUrl(diplomes[index].justificatifDiplomeChemin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary inline-flex items-center gap-1 hover:underline break-all"
                          >
                            {diplomes[index].justificatifDiplomeChemin
                              .split("/")
                              .pop() || "Ouvrir le document"}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openDiplomeDialog(index)}
                        >
                          Modifier
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setValue(
                              `renfordDiplomes.${index}.justificatifDiplomeChemin`,
                              null,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              }
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full p-4 flex items-center justify-between gap-3 border-2 border-dashed bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">
                          Aucun justificatif ajouté pour ce diplôme.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openDiplomeDialog(index)}
                        >
                          Télécharger un document
                        </Button>
                      </div>
                    )}

                    <ErrorMessage>
                      {
                        errors.renfordDiplomes?.[index]
                          ?.justificatifDiplomeChemin?.message
                      }
                    </ErrorMessage>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline-primary"
                onClick={() =>
                  append({
                    typeDiplome: DIPLOME_KEYS[0],
                    anneeObtention: null,
                    mention: null,
                    etablissementFormation: null,
                    justificatifDiplomeChemin: null,
                  })
                }
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
                Ajouter un diplôme
              </Button>
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
    </>
  );
}
