"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfilRenfordExperiences } from "@/hooks/profil-renford";
import { CurrentUser } from "@/types/utilisateur";
import {
  updateProfilRenfordExperiencesSchema,
  UpdateProfilRenfordExperiencesSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type ExperiencesEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

const asDate = (value: Date | string | null | undefined) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};

export default function ExperiencesEditDialog({
  open,
  setOpen,
  me,
}: ExperiencesEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordExperiences();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    z.input<typeof updateProfilRenfordExperiencesSchema>,
    unknown,
    UpdateProfilRenfordExperiencesSchema
  >({
    resolver: zodResolver(updateProfilRenfordExperiencesSchema),
    defaultValues: {
      experiencesProfessionnelles: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiencesProfessionnelles",
  });

  useEffect(() => {
    if (!open) return;

    reset({
      experiencesProfessionnelles:
        profil?.experiencesProfessionnelles?.map((experience) => ({
          nom: experience.nom,
          etablissement: experience.etablissement,
          missions: experience.missions,
          dateDebut: asDate(experience.dateDebut),
          dateFin: asDate(experience.dateFin) ?? null,
        })) ?? [],
    });
  }, [open, profil?.experiencesProfessionnelles, reset]);

  const onSubmit = (data: UpdateProfilRenfordExperiencesSchema) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Modifier les expériences professionnelles</DialogTitle>
            <DialogDescription>
              Ajoutez ou supprimez vos expériences professionnelles.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune expérience ajoutée.
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-input p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Expérience {index + 1}
                  </p>
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
                  <Label>Poste*</Label>
                  <Input
                    {...register(`experiencesProfessionnelles.${index}.nom`)}
                  />
                  <ErrorMessage>
                    {errors.experiencesProfessionnelles?.[index]?.nom?.message}
                  </ErrorMessage>
                </div>

                <div>
                  <Label>Établissement*</Label>
                  <Input
                    {...register(
                      `experiencesProfessionnelles.${index}.etablissement`
                    )}
                  />
                  <ErrorMessage>
                    {
                      errors.experiencesProfessionnelles?.[index]?.etablissement
                        ?.message
                    }
                  </ErrorMessage>
                </div>

                <div>
                  <Label>Missions*</Label>
                  <Textarea
                    rows={3}
                    {...register(
                      `experiencesProfessionnelles.${index}.missions`
                    )}
                  />
                  <ErrorMessage>
                    {
                      errors.experiencesProfessionnelles?.[index]?.missions
                        ?.message
                    }
                  </ErrorMessage>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Date de début*</Label>
                    <Controller
                      name={`experiencesProfessionnelles.${index}.dateDebut`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sélectionner une date"
                        />
                      )}
                    />
                    <ErrorMessage>
                      {
                        errors.experiencesProfessionnelles?.[index]?.dateDebut
                          ?.message
                      }
                    </ErrorMessage>
                  </div>

                  <div>
                    <Label>Date de fin (optionnel)</Label>
                    <Controller
                      name={`experiencesProfessionnelles.${index}.dateFin`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ?? undefined}
                          onChange={(date) => field.onChange(date ?? null)}
                          placeholder="Sélectionner une date"
                        />
                      )}
                    />
                    <ErrorMessage>
                      {
                        errors.experiencesProfessionnelles?.[index]?.dateFin
                          ?.message
                      }
                    </ErrorMessage>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline-primary"
              onClick={() =>
                append({
                  nom: "",
                  etablissement: "",
                  missions: "",
                  dateDebut: new Date(),
                  dateFin: null,
                })
              }
              disabled={isPending}
            >
              <Plus className="h-4 w-4" />
              Ajouter une expérience
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
  );
}
