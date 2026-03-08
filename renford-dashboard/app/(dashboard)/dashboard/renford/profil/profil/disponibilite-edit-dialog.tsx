"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUpdateProfilRenfordDisponibilites } from "@/hooks/profil-renford";
import { CurrentUser } from "@/types/utilisateur";
import {
  CRENEAUX_DISPONIBILITE,
  CRENEAUX_DISPONIBILITE_LABELS,
  UpdateProfilRenfordDisponibilitesSchema,
  updateProfilRenfordDisponibilitesSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const JOURS = [
  {
    key: "lundi" as const,
    label: "Lun",
    fullLabel: "Lundi",
    field: "disponibilitesLundi" as const,
  },
  {
    key: "mardi" as const,
    label: "Mar",
    fullLabel: "Mardi",
    field: "disponibilitesMardi" as const,
  },
  {
    key: "mercredi" as const,
    label: "Mer",
    fullLabel: "Mercredi",
    field: "disponibilitesMercredi" as const,
  },
  {
    key: "jeudi" as const,
    label: "Jeu",
    fullLabel: "Jeudi",
    field: "disponibilitesJeudi" as const,
  },
  {
    key: "vendredi" as const,
    label: "Ven",
    fullLabel: "Vendredi",
    field: "disponibilitesVendredi" as const,
  },
  {
    key: "samedi" as const,
    label: "Sam",
    fullLabel: "Samedi",
    field: "disponibilitesSamedi" as const,
  },
  {
    key: "dimanche" as const,
    label: "Dim",
    fullLabel: "Dimanche",
    field: "disponibilitesDimanche" as const,
  },
];

type Jour = (typeof JOURS)[number];
type JourKey = Jour["key"];
type DisponibilitesField = Jour["field"];

type DisponibiliteEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

export default function DisponibiliteEditDialog({
  open,
  setOpen,
  me,
}: DisponibiliteEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordDisponibilites();

  const [joursSelectionnes, setJoursSelectionnes] = useState<JourKey[]>([]);

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilRenfordDisponibilitesSchema>({
    resolver: zodResolver(updateProfilRenfordDisponibilitesSchema),
    defaultValues: {
      disponibilitesLundi: profil?.disponibilitesLundi ?? [],
      disponibilitesMardi: profil?.disponibilitesMardi ?? [],
      disponibilitesMercredi: profil?.disponibilitesMercredi ?? [],
      disponibilitesJeudi: profil?.disponibilitesJeudi ?? [],
      disponibilitesVendredi: profil?.disponibilitesVendredi ?? [],
      disponibilitesSamedi: profil?.disponibilitesSamedi ?? [],
      disponibilitesDimanche: profil?.disponibilitesDimanche ?? [],
      dureeIllimitee: profil?.dureeIllimitee ?? true,
      dateDebut: profil?.dateDebut ? new Date(profil.dateDebut) : undefined,
      dateFin: profil?.dateFin ? new Date(profil.dateFin) : undefined,
      zoneDeplacement: profil?.zoneDeplacement || 20,
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      disponibilitesLundi: profil?.disponibilitesLundi ?? [],
      disponibilitesMardi: profil?.disponibilitesMardi ?? [],
      disponibilitesMercredi: profil?.disponibilitesMercredi ?? [],
      disponibilitesJeudi: profil?.disponibilitesJeudi ?? [],
      disponibilitesVendredi: profil?.disponibilitesVendredi ?? [],
      disponibilitesSamedi: profil?.disponibilitesSamedi ?? [],
      disponibilitesDimanche: profil?.disponibilitesDimanche ?? [],
      dureeIllimitee: profil?.dureeIllimitee ?? true,
      dateDebut: profil?.dateDebut ? new Date(profil.dateDebut) : undefined,
      dateFin: profil?.dateFin ? new Date(profil.dateFin) : undefined,
      zoneDeplacement: profil?.zoneDeplacement || 20,
    });

    const initialJours = JOURS.filter(({ field }) => {
      const valeurs = profil?.[field] ?? [];
      return Array.isArray(valeurs) && valeurs.length > 0;
    }).map(({ key }) => key);

    setJoursSelectionnes(initialJours);
  }, [open, profil, reset]);

  const disponibilitesLundi =
    useWatch({ control, name: "disponibilitesLundi" }) ?? [];
  const disponibilitesMardi =
    useWatch({ control, name: "disponibilitesMardi" }) ?? [];
  const disponibilitesMercredi =
    useWatch({ control, name: "disponibilitesMercredi" }) ?? [];
  const disponibilitesJeudi =
    useWatch({ control, name: "disponibilitesJeudi" }) ?? [];
  const disponibilitesVendredi =
    useWatch({ control, name: "disponibilitesVendredi" }) ?? [];
  const disponibilitesSamedi =
    useWatch({ control, name: "disponibilitesSamedi" }) ?? [];
  const disponibilitesDimanche =
    useWatch({ control, name: "disponibilitesDimanche" }) ?? [];
  const dureeIllimitee = useWatch({ control, name: "dureeIllimitee" });
  const zoneDeplacement = useWatch({ control, name: "zoneDeplacement" });

  const disponibilitesParJour: Record<
    DisponibilitesField,
    (typeof CRENEAUX_DISPONIBILITE)[number][]
  > = {
    disponibilitesLundi,
    disponibilitesMardi,
    disponibilitesMercredi,
    disponibilitesJeudi,
    disponibilitesVendredi,
    disponibilitesSamedi,
    disponibilitesDimanche,
  };

  const joursActifs = useMemo(
    () => JOURS.filter(({ key }) => joursSelectionnes.includes(key)),
    [joursSelectionnes]
  );

  const creneauActifPourJour = (
    champJour: DisponibilitesField,
    creneau: (typeof CRENEAUX_DISPONIBILITE)[number]
  ) => {
    const creneauxJour = disponibilitesParJour[champJour] ?? [];
    return creneauxJour.includes(creneau);
  };

  const toggleJour = (jour: JourKey) => {
    const jourConfig = JOURS.find((item) => item.key === jour);
    if (!jourConfig) return;

    const dejaSelectionne = joursSelectionnes.includes(jour);

    if (dejaSelectionne) {
      setJoursSelectionnes((prev) => prev.filter((item) => item !== jour));
      setValue(jourConfig.field, [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    setJoursSelectionnes((prev) => [...prev, jour]);
  };

  const toggleCreneauPourJour = (
    champJour: DisponibilitesField,
    creneau: (typeof CRENEAUX_DISPONIBILITE)[number]
  ) => {
    const creneauxActuels = getValues(champJour) ?? [];
    const prochainEtat = creneauxActuels.includes(creneau)
      ? creneauxActuels.filter((item) => item !== creneau)
      : [...creneauxActuels, creneau];

    setValue(champJour, prochainEtat, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (data: UpdateProfilRenfordDisponibilitesSchema) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Modifier les disponibilités</DialogTitle>
            <DialogDescription>
              Définissez vos jours, créneaux, période de disponibilité et zone
              de déplacement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mb-6">
            <div className="space-y-4">
              <Label>Jours de disponibilité</Label>
              <p className="text-sm text-gray-500">
                Sélectionnez un ou plusieurs jours
              </p>
              <div className="flex gap-2">
                {JOURS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleJour(key)}
                    className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      joursSelectionnes.includes(key)
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {joursActifs.length > 0 && (
                <Accordion
                  type="multiple"
                  className="w-full rounded-lg border px-4"
                >
                  {joursActifs.map(({ key, fullLabel, field }) => (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger>{fullLabel}</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-6">
                          {CRENEAUX_DISPONIBILITE.map((creneau) => (
                            <label
                              key={`${key}-${creneau}`}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={creneauActifPourJour(field, creneau)}
                                onCheckedChange={() =>
                                  toggleCreneauPourJour(field, creneau)
                                }
                              />
                              <span className="text-sm">
                                {CRENEAUX_DISPONIBILITE_LABELS[creneau]}
                              </span>
                            </label>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <Controller
                  name="dureeIllimitee"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="dureeIllimitee"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                        if (checked === true) {
                          setValue("dateDebut", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setValue("dateFin", undefined, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  )}
                />
                <Label
                  htmlFor="dureeIllimitee"
                  className="cursor-pointer font-normal mb-0"
                >
                  Je suis disponible pour une durée illimitée
                </Label>
              </div>

              {!dureeIllimitee && (
                <div className="grid gap-4 mt-4">
                  <div>
                    <Label>À partir de</Label>
                    <Controller
                      name="dateDebut"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Date de début"
                        />
                      )}
                    />
                    <ErrorMessage>{errors.dateDebut?.message}</ErrorMessage>
                  </div>
                  <div>
                    <Label>Jusqu&apos;au</Label>
                    <Controller
                      name="dateFin"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Date de fin"
                        />
                      )}
                    />
                    <ErrorMessage>{errors.dateFin?.message}</ErrorMessage>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Label>Zone de déplacement</Label>
              <p className="text-sm text-gray-500 mb-4">
                Rayon maximum autour de votre adresse : {zoneDeplacement} km
              </p>
              <Controller
                name="zoneDeplacement"
                control={control}
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(value: number[]) =>
                      field.onChange(value[0])
                    }
                    min={1}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                )}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 km</span>
                <span>200 km</span>
              </div>
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
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending && <Loader2 className="animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
