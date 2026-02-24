"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import ErrorMessage from "@/components/ui/error-message";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUpdateRenfordDisponibilites } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingRenfordDisponibilitesSchema,
  OnboardingRenfordDisponibilitesSchema,
} from "@/validations/onboarding";
import { CRENEAUX_HORAIRES } from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

const JOURS = [
  { key: "lundi" as const, label: "Lun" },
  { key: "mardi" as const, label: "Mar" },
  { key: "mercredi" as const, label: "Mer" },
  { key: "jeudi" as const, label: "Jeu" },
  { key: "vendredi" as const, label: "Ven" },
  { key: "samedi" as const, label: "Sam" },
  { key: "dimanche" as const, label: "Dim" },
];

type JourKey =
  | "lundi"
  | "mardi"
  | "mercredi"
  | "jeudi"
  | "vendredi"
  | "samedi"
  | "dimanche";

const defaultJoursDisponibles = {
  lundi: false,
  mardi: false,
  mercredi: false,
  jeudi: false,
  vendredi: false,
  samedi: false,
  dimanche: false,
};

export default function Etape7RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordDisponibilites();

  const userJours = user?.profilRenford?.joursDisponibles;
  const initialJours =
    typeof userJours === "object" && userJours !== null
      ? { ...defaultJoursDisponibles, ...userJours }
      : defaultJoursDisponibles;

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordDisponibilitesSchema>({
    resolver: zodResolver(onboardingRenfordDisponibilitesSchema),
    defaultValues: {
      joursDisponibles: initialJours,
      creneaux: user?.profilRenford?.creneaux || [],
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

  const joursDisponibles = watch("joursDisponibles");
  const dureeIllimitee = watch("dureeIllimitee");
  const zoneDeplacement = watch("zoneDeplacement");

  const toggleJour = (jour: JourKey) => {
    setValue(`joursDisponibles.${jour}`, !joursDisponibles[jour], {
      shouldDirty: true,
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
        <div>
          <Label>Jours de disponibilité</Label>
          <p className="text-sm text-gray-500 mb-3">
            Sélectionnez les jours où vous êtes disponible
          </p>
          <div className="flex gap-2">
            {JOURS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleJour(key)}
                className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  joursDisponibles[key]
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Créneaux horaires (optionnel)</Label>
          <p className="text-sm text-gray-500 mb-3">
            Ajoutez vos créneaux de disponibilité typiques
          </p>
          <Controller
            name="creneaux"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                {CRENEAUX_HORAIRES.map((creneau) => {
                  const isSelected = field.value?.some(
                    (c) => c.debut === creneau.debut && c.fin === creneau.fin
                  );
                  return (
                    <label
                      key={`${creneau.debut}-${creneau.fin}`}
                      className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([
                              ...(field.value || []),
                              { debut: creneau.debut, fin: creneau.fin },
                            ]);
                          } else {
                            field.onChange(
                              field.value?.filter(
                                (c) =>
                                  c.debut !== creneau.debut ||
                                  c.fin !== creneau.fin
                              )
                            );
                          }
                        }}
                      />
                      <span className="text-sm">
                        {creneau.debut} - {creneau.fin}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Controller
              name="dureeIllimitee"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="dureeIllimitee"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="dureeIllimitee"
              className="cursor-pointer font-normal"
            >
              Je suis disponible pour une durée illimitée
            </Label>
          </div>

          {!dureeIllimitee && (
            <div className="grid grid-cols-2 gap-4">
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
