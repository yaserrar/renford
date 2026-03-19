"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { H2, H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  createMissionStep2Schema,
  createMissionStep1Schema,
  CreateMissionStep2Schema,
  CreateMissionStep1Schema,
  DISCIPLINE_MISSION_LABELS,
  SPECIALITES_BY_DISCIPLINE,
} from "@/validations/mission";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

const TOTAL_STEPS = 6;

const createMissionFormSchema = createMissionStep1Schema.merge(
  createMissionStep2Schema
);
type CreateMissionFormSchema = z.infer<typeof createMissionFormSchema>;
type MissionFormField =
  | "discipline"
  | "niveauExperienceRequis"
  | "assuranceObligatoire"
  | "materielsRequis"
  | "detailMission"
  | "specialitePrincipale";

const missionModes: Array<{
  value: CreateMissionStep1Schema["modeMission"];
  title: string;
  description: React.ReactNode;
}> = [
  {
    value: "flex",
    title: "Renford Flex",
    description: (
      <>
        Pour les besoins <strong>ponctuels et urgents ⏱</strong>
        <br />
        Accédez à un coach disponible{" "}
        <strong>à l&apos;heure ou à la journée</strong>, idéal pour un
        remplacement de dernière minute ou une absence.
      </>
    ),
  },
  {
    value: "coach",
    title: "Renford Coach",
    description: (
      <>
        Pour les besoins <strong>réguliers ou de longue durée 📅</strong>
        <br />
        Identifiez un coach qualifié pour{" "}
        <strong>
          garantir la continuité des cours et accompagner durablement vos
          adhérents.
        </strong>
      </>
    ),
  },
];

const disciplineOptions = Object.entries(DISCIPLINE_MISSION_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const niveauExperienceOptions = [
  { value: "peu_importe", label: "Peu importe" },
  { value: "debutant", label: "Débutant" },
  { value: "confirme", label: "Confirmé" },
  { value: "expert", label: "Expert" },
];

const materielsOptions = [
  { value: "tapis", label: "Tapis" },
  { value: "haltères", label: "Haltères" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "elastiques", label: "Élastiques" },
  { value: "medecine_ball", label: "Medicine ball" },
  { value: "velo_indoor", label: "Vélo indoor" },
  { value: "barre", label: "Barre" },
  { value: "autre", label: "Autre" },
];

export default function NouvelleMissionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const previousStepRef = useRef(0);
  const initializedHistoryRef = useRef(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<string>("Tout");

  useEffect(() => {
    if (!initializedHistoryRef.current) {
      window.history.replaceState({ missionStep: 0 }, "");
      initializedHistoryRef.current = true;
      previousStepRef.current = 0;
      return;
    }

    const previousStep = previousStepRef.current;

    if (currentStep > previousStep) {
      window.history.pushState({ missionStep: currentStep }, "");
    } else if (currentStep < previousStep) {
      window.history.replaceState({ missionStep: currentStep }, "");
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const stepFromHistory = event.state?.missionStep;

      if (typeof stepFromHistory === "number") {
        setCurrentStep(stepFromHistory);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const {
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<
    z.input<typeof createMissionFormSchema>,
    unknown,
    z.output<typeof createMissionFormSchema>
  >({
    resolver: zodResolver(createMissionFormSchema),
    defaultValues: {
      modeMission: undefined,
      discipline: undefined,
      niveauExperienceRequis: "peu_importe",
      assuranceObligatoire: false,
      materielsRequis: [],
      detailMission: "",
      specialitePrincipale: "",
      specialitesSecondaires: [],
    },
    mode: "onTouched",
  });

  const selectedMode = watch("modeMission");
  const selectedDiscipline = watch("discipline");
  const selectedSpecialitePrincipale = watch("specialitePrincipale") || "";
  const selectedSpecialitesSecondaires = watch("specialitesSecondaires") || [];

  const specialitesOptions = selectedDiscipline
    ? SPECIALITES_BY_DISCIPLINE[selectedDiscipline]
    : [];

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      const isValid = await trigger("modeMission");
      if (!isValid) return;
    }

    if (currentStep === 2) {
      const fieldsToValidate: MissionFormField[] = [
        "discipline",
        "niveauExperienceRequis",
        "assuranceObligatoire",
        "materielsRequis",
        "detailMission",
      ];

      if (specialitesOptions.length > 0) {
        fieldsToValidate.push("specialitePrincipale");
      }

      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setCurrentStep((previous) => Math.min(previous + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  };

  return (
    <main className="mt-8 space-y-6">
      <H2>Demande de mission</H2>

      <div className="bg-secondary-background rounded-3xl border border-input p-6 space-y-4 min-h-screen">
        <div className="rounded-3xl border bg-white p-6 md:p-10 space-y-8 h-full">
          <div className="space-y-2">
            <div className="h-1 rounded-full bg-gray-100">
              <div
                className="h-1 rounded-full bg-gray-900 transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          {currentStep === 0 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full rounded-3xl cursor-pointer border border-input bg-white p-5 text-left hover:border-secondary transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Créer une mission à partir de zéro
                    </h3>
                    <p className="text-lg text-muted-foreground mt-1">
                      Partir d&apos;un formulaire vide
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-white">
                    <Plus className="h-5 w-5" />
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-sm font-semibold text-muted-foreground uppercase">
                  Ou dupliquer
                </span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Historique</h3>

                <div className="relative">
                  <Search className="h-4 w-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <Input
                    value={historySearch}
                    onChange={(event) => setHistorySearch(event.target.value)}
                    placeholder="Rechercher une mission (ex: Yoga, 14 jan...)"
                    className="pl-11"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[...disciplineOptions, { value: "Tout", label: "Tout" }].map(
                    (filter) => {
                      const active = historyFilter === filter.value;
                      return (
                        <Button
                          key={filter.value}
                          type="button"
                          variant={active ? "default" : "outline"}
                          size="sm"
                          onClick={() => setHistoryFilter(filter.value)}
                          className="h-10 px-4"
                        >
                          {filter.label}
                        </Button>
                      );
                    }
                  )}
                </div>

                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-base text-muted-foreground">
                    Aucune mission disponible pour le moment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <div>
                  <H3>Nouvelle Mission</H3>
                  <p className="mt-1 text-muted-foreground italic">
                    Flex = ponctuel. Coach = récurrent
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-black">
                  Sélectionnez le type de mission que vous souhaitez publier. En
                  quelques clics, trouvez le bon coach selon la durée et vos
                  besoins du moment.
                </p>

                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-black">
                  <p className="text-base leading-relaxed">
                    <Lightbulb className="inline h-4 w-4 mr-2 -mt-1" />
                    Vous pouvez à tout moment revenir modifier votre mission
                    avant sa publication.
                  </p>
                </div>
              </div>

              <div className="xl:col-span-3">
                <Controller
                  name="modeMission"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(
                          value as CreateMissionStep1Schema["modeMission"]
                        )
                      }
                      className="space-y-4"
                    >
                      {missionModes.map((mode) => {
                        const isSelected = field.value === mode.value;

                        return (
                          <Label
                            key={mode.value}
                            htmlFor={`mode-${mode.value}`}
                            className={cn(
                              "flex cursor-pointer gap-4 rounded-3xl border p-6 transition items-center",
                              isSelected
                                ? "border-secondary bg-secondary/5"
                                : "border-input hover:border-gray-300"
                            )}
                          >
                            <RadioGroupItem
                              id={`mode-${mode.value}`}
                              value={mode.value}
                              className="mt-1"
                            />

                            <div className="space-y-1.5">
                              <p className="text-xl font-semibold">
                                {mode.title}
                              </p>
                              <p className="text-base leading-relaxed text-gray-600">
                                {mode.description}
                              </p>
                            </div>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  )}
                />

                <ErrorMessage>
                  {errors.modeMission?.message as string}
                </ErrorMessage>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2 space-y-4">
                <H3>Définissez votre besoin</H3>
              </div>

              <div className="xl:col-span-3 space-y-5">
                <div>
                  <Label htmlFor="discipline">Discipline</Label>
                  <Controller
                    name="discipline"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value}
                        onValueChange={(value) => {
                          const disciplineValue =
                            value as CreateMissionStep2Schema["discipline"];
                          field.onChange(disciplineValue);
                          setValue("specialitePrincipale", "", {
                            shouldDirty: true,
                          });
                          setValue("specialitesSecondaires", [], {
                            shouldDirty: true,
                          });
                        }}
                        options={disciplineOptions}
                        placeholder="Sélectionner..."
                        searchPlaceholder="Rechercher une discipline"
                        emptyMessage="Aucune discipline trouvée"
                      />
                    )}
                  />
                  <ErrorMessage>
                    {errors.discipline?.message as string}
                  </ErrorMessage>
                </div>

                {selectedDiscipline && specialitesOptions.length > 0 && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-3">
                      <Label>Spécialité Principale</Label>
                      <div className="flex flex-wrap gap-2">
                        {specialitesOptions.map((option) => {
                          const active =
                            selectedSpecialitePrincipale === option;
                          return (
                            <Button
                              key={option}
                              type="button"
                              onClick={() =>
                                setValue("specialitePrincipale", option, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }
                              variant={active ? "default" : "outline"}
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                      <ErrorMessage>
                        {errors.specialitePrincipale?.message as string}
                      </ErrorMessage>
                    </div>

                    <div className="space-y-2">
                      <Label>Acceptez-vous d&apos;autres spécialités ?</Label>
                      <p className="text-sm text-muted-foreground">
                        Si aucun coach n&apos;est disponible, les coachs ayant
                        ces compétences secondaires pourront postuler.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {specialitesOptions.map((option) => {
                          const active =
                            selectedSpecialitesSecondaires.includes(option);
                          return (
                            <Button
                              key={`secondary-${option}`}
                              type="button"
                              onClick={() => {
                                const nextValues = active
                                  ? selectedSpecialitesSecondaires.filter(
                                      (value: string) => value !== option
                                    )
                                  : [...selectedSpecialitesSecondaires, option];

                                setValue("specialitesSecondaires", nextValues, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }}
                              variant={active ? "secondary" : "outline"}
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="niveauExperienceRequis">
                    Niveau d&apos;expérience
                  </Label>
                  <Controller
                    name="niveauExperienceRequis"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(
                            value as CreateMissionStep2Schema["niveauExperienceRequis"]
                          )
                        }
                        options={niveauExperienceOptions}
                        placeholder="Sélectionner..."
                        searchPlaceholder="Rechercher un niveau"
                        emptyMessage="Aucun niveau trouvé"
                      />
                    )}
                  />
                  <ErrorMessage>
                    {errors.niveauExperienceRequis?.message as string}
                  </ErrorMessage>
                </div>

                <div className="flex items-center gap-2">
                  <Controller
                    name="assuranceObligatoire"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="assuranceObligatoire"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    )}
                  />
                  <Label htmlFor="assuranceObligatoire" className="mb-0">
                    Assurance obligatoire ?
                  </Label>
                </div>

                <div>
                  <Label htmlFor="materielsRequis">
                    Matériels (facultatif)
                  </Label>
                  <Controller
                    name="materielsRequis"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        multiple
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(
                            value as CreateMissionStep2Schema["materielsRequis"]
                          )
                        }
                        options={materielsOptions}
                        placeholder="Sélectionner..."
                        searchPlaceholder="Rechercher un matériel"
                        emptyMessage="Aucun matériel trouvé"
                      />
                    )}
                  />
                  <ErrorMessage>
                    {errors.materielsRequis?.message as string}
                  </ErrorMessage>
                </div>

                <div>
                  <Label htmlFor="detailMission">
                    Détail supplémentaire sur la mission (facultatif)
                  </Label>
                  <Controller
                    name="detailMission"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="detailMission"
                        placeholder="Type your message..."
                        className="min-h-[120px]"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <ErrorMessage>
                    {errors.detailMission?.message as string}
                  </ErrorMessage>
                </div>
              </div>
            </div>
          )}

          {currentStep > 2 && (
            <div className="rounded-2xl border border-dashed p-8 text-center space-y-3">
              <h3 className="text-2xl font-semibold">Étape {currentStep}</h3>
              <p className="text-muted-foreground">
                Prochaine étape à implémenter. Mode sélectionné: {selectedMode}
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="w-full md:w-auto"
            >
              Retour
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="w-full md:w-auto"
            >
              {currentStep === 1 ? "Commencer" : "Continuer"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
