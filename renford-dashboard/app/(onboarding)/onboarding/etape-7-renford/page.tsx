"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import ErrorMessage from "@/components/ui/error-message";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUpdateRenfordDisponibilites } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingRenfordDisponibilitesSchema,
  OnboardingRenfordDisponibilitesSchema,
} from "@/validations/onboarding";
import {
  CRENEAUX_DISPONIBILITE,
  CRENEAUX_DISPONIBILITE_LABELS,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { OnboardingCard } from "../-components";

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

export default function Etape7RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordDisponibilites();
  const [joursSelectionnes, setJoursSelectionnes] = useState<JourKey[]>(() => {
    if (!user?.profilRenford) return [];

    return JOURS.filter(({ field }) => {
      const valeurs = user.profilRenford?.[field] ?? [];
      return Array.isArray(valeurs) && valeurs.length > 0;
    }).map(({ key }) => key);
  });

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordDisponibilitesSchema>({
    resolver: zodResolver(onboardingRenfordDisponibilitesSchema),
    defaultValues: {
      disponibilitesLundi: user?.profilRenford?.disponibilitesLundi ?? [],
      disponibilitesMardi: user?.profilRenford?.disponibilitesMardi ?? [],
      disponibilitesMercredi: user?.profilRenford?.disponibilitesMercredi ?? [],
      disponibilitesJeudi: user?.profilRenford?.disponibilitesJeudi ?? [],
      disponibilitesVendredi: user?.profilRenford?.disponibilitesVendredi ?? [],
      disponibilitesSamedi: user?.profilRenford?.disponibilitesSamedi ?? [],
      disponibilitesDimanche: user?.profilRenford?.disponibilitesDimanche ?? [],
      dureeIllimitee: user?.profilRenford?.dureeIllimitee ?? true,
      dateDebut: user?.profilRenford?.dateDebut
        ? new Date(user.profilRenford.dateDebut)
        : undefined,
      dateFin: user?.profilRenford?.dateFin
        ? new Date(user.profilRenford.dateFin)
        : undefined,
      zoneDeplacement: user?.profilRenford?.zoneDeplacement || 20,
    },
  });

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
    [joursSelectionnes],
  );

  const creneauActifPourJour = (
    champJour: DisponibilitesField,
    creneau: (typeof CRENEAUX_DISPONIBILITE)[number],
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
    creneau: (typeof CRENEAUX_DISPONIBILITE)[number],
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

  const onSubmit = (data: OnboardingRenfordDisponibilitesSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-8-renford");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={7}
      totalSteps={8}
      title="Et pour finir..."
      subtitle="Définissez vos disponibilités"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <Label>Jours de disponibilité</Label>
          <p className="text-sm text-gray-500 mb-3">
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

        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Controller
              name="dureeIllimitee"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="dureeIllimitee"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
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
            <div className="grid gap-4 mt-6">
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
                onValueChange={(value: number[]) => field.onChange(value[0])}
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
            Terminer
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
