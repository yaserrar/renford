"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import DatePicker from "@/components/ui/date-picker";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SiteFormDialog from "@/app/(dashboard)/dashboard/etablissement/profil/site-form-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H2, H3 } from "@/components/ui/typography";
import { useCreateMission, useFinalizeMissionPayment } from "@/hooks/mission";
import { useCurrentUser } from "@/hooks/utilisateur";
import { cn } from "@/lib/utils";
import {
  createMissionFormSchema,
  createMissionPayloadSchema,
  CreateMissionPayloadSchema,
  DISCIPLINE_MISSION_OPTIONS,
  getSpecialitesOptionsByDiscipline,
  MATERIELS_MISSION_OPTIONS,
  METHODE_TARIFICATION,
  METHODE_TARIFICATION_LABELS,
  MODE_MISSION,
  NIVEAU_EXPERIENCE_MISSION_OPTIONS,
  POURCENTAGE_VARIATION_TARIF_OPTIONS,
  TYPE_PAIEMENT_LABELS,
  finalizeMissionPaymentSchema,
  FinalizeMissionPaymentSchema,
} from "@/validations/mission";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CircleHelp,
  Clock3,
  CreditCard,
  Landmark,
  Lightbulb,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const LAST_STEP = 5;

const PAYMENT_TYPE_SUBTITLES = {
  carte_bancaire: "Sécurisation via Stripe • Pas de débit total immédiat",
  prelevement_sepa: "Prélèvement B2B automatisé",
} as const;

const PAYMENT_MANDATE_TEXT =
  "En signant ce mandat formulaire, vous autorisez (A) RENFORD à envoyer des instructions à votre banque pour débiter votre compte, et (B) votre banque à débiter votre compte conformément aux instructions de RENFORD.";

type MissionFormField =
  | "modeMission"
  | "discipline"
  | "specialitePrincipale"
  | "specialitesSecondaires"
  | "niveauExperienceRequis"
  | "assuranceObligatoire"
  | "materielsRequis"
  | "detailMission"
  | "etablissementId"
  | "dateDebut"
  | "dateFin"
  | "plagesHoraires"
  | "methodeTarification"
  | "tarif"
  | "pourcentageVariationTarif";

type CreateMissionFormInput = z.input<typeof createMissionFormSchema>;
type CreateMissionFormOutput = z.output<typeof createMissionFormSchema>;
type PaymentFormInput = z.input<typeof finalizeMissionPaymentSchema>;

type PaymentFormState = {
  typePaiement: "carte_bancaire" | "prelevement_sepa";
  titulaireCarteBancaire: string;
  numeroCarteBancaire: string;
  dateExpirationCarte: string;
  cvvCarte: string;
  autorisationDebit: boolean;
  titulaireCompteBancaire: string;
  IBANCompteBancaire: string;
  BICCompteBancaire: string;
  autorisationPrelevement: boolean;
};

const missionModes: Array<{
  value: (typeof MODE_MISSION)[number];
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
        remplacement de dernière minute.
      </>
    ),
  },
  {
    value: "coach",
    title: "Renford Coach",
    description: (
      <>
        Pour les besoins <strong>réguliers et longue durée 📅</strong>
        <br />
        Identifiez un coach qualifié pour{" "}
        <strong>garantir la continuité des cours.</strong>
      </>
    ),
  },
];

function formatEuroAmount(value: number): string {
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)}€`;
}

function formatFrenchDate(value: Date | undefined): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function parseTimeToMinutes(timeValue: string): number {
  const [hours, minutes] = timeValue.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;

  return hours * 60 + minutes;
}

function normalizeDate(value: unknown): Date | undefined {
  if (!value) return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return undefined;
}

export default function NouvelleMissionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<string>("Tout");
  const [createdMissionId, setCreatedMissionId] = useState<string | null>(null);
  const [isCreateSiteDialogOpen, setIsCreateSiteDialogOpen] = useState(false);

  const previousStepRef = useRef(0);
  const initializedHistoryRef = useRef(false);

  const { data: user } = useCurrentUser();
  const createMissionMutation = useCreateMission();
  const finalizeMissionPaymentMutation = useFinalizeMissionPayment();

  const {
    control,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CreateMissionFormInput, unknown, CreateMissionFormOutput>({
    resolver: zodResolver(createMissionFormSchema),
    mode: "onTouched",
    defaultValues: {
      modeMission: undefined,
      discipline: undefined,
      specialitePrincipale: undefined,
      specialitesSecondaires: [],
      niveauExperienceRequis: "peut_importe",
      assuranceObligatoire: false,
      materielsRequis: [],
      detailMission: "",
      etablissementId: undefined,
      dateDebut: undefined,
      dateFin: undefined,
      plagesHoraires: [
        {
          date: undefined,
          heureDebut: "09:00",
          heureFin: "10:00",
        },
      ],
      methodeTarification: "horaire",
      tarif: undefined,
      pourcentageVariationTarif: undefined,
    },
  });

  const {
    fields: horaireFields,
    append: appendHoraire,
    remove: removeHoraire,
  } = useFieldArray({
    control,
    name: "plagesHoraires",
  });

  const {
    control: paymentControl,
    watch: watchPayment,
    getValues: getPaymentValues,
    setError: setPaymentError,
    clearErrors: clearPaymentErrors,
    formState: { errors: paymentErrors },
  } = useForm<PaymentFormState>({
    mode: "onTouched",
    defaultValues: {
      typePaiement: "carte_bancaire",
      titulaireCarteBancaire: "",
      numeroCarteBancaire: "",
      dateExpirationCarte: "",
      cvvCarte: "",
      autorisationDebit: false,
      titulaireCompteBancaire: "",
      IBANCompteBancaire: "",
      BICCompteBancaire: "",
      autorisationPrelevement: false,
    },
  });

  const selectedMode = watch("modeMission");
  const selectedDiscipline = watch("discipline");
  const selectedSpecialitePrincipale = watch("specialitePrincipale") || "";
  const selectedSpecialitesSecondaires = watch("specialitesSecondaires") || [];
  const selectedDateDebut = watch("dateDebut") as Date | undefined;
  const selectedDateFin = watch("dateFin") as Date | undefined;
  const selectedTarif = watch("tarif") as number | undefined;
  const selectedEtablissementId = watch("etablissementId") as
    | string
    | undefined;
  const selectedNiveauExperience = watch("niveauExperienceRequis") as
    | CreateMissionFormOutput["niveauExperienceRequis"]
    | undefined;
  const selectedMaterielsRequis = watch("materielsRequis") as
    | CreateMissionFormOutput["materielsRequis"]
    | undefined;
  const selectedDetailMission = watch("detailMission") as string | undefined;
  const selectedMethodeTarification = watch("methodeTarification") as
    | CreateMissionFormOutput["methodeTarification"]
    | undefined;
  const selectedPourcentageVariation = watch("pourcentageVariationTarif") as
    | number
    | undefined;
  const selectedPlagesHoraires = watch("plagesHoraires") as
    | CreateMissionFormOutput["plagesHoraires"]
    | undefined;

  const paymentType = watchPayment("typePaiement");

  const etablissementOptions = useMemo(() => {
    const etablissements = user?.profilEtablissement?.etablissements || [];

    return etablissements
      .filter((etablissement) => etablissement.actif)
      .map((etablissement) => ({
        value: etablissement.id,
        label: `${etablissement.nom} • ${etablissement.ville}`,
      }));
  }, [user?.profilEtablissement?.etablissements]);

  const specialitesOptions =
    getSpecialitesOptionsByDiscipline(selectedDiscipline);

  const hasValidTarif =
    typeof selectedTarif === "number" &&
    Number.isFinite(selectedTarif) &&
    selectedTarif > 0;

  const selectedEtablissementLabel =
    etablissementOptions.find(
      (option) => option.value === selectedEtablissementId
    )?.label || "—";

  const selectedNiveauExperienceLabel =
    NIVEAU_EXPERIENCE_MISSION_OPTIONS.find(
      (option) => option.value === selectedNiveauExperience
    )?.label || "—";

  const selectedSpecialitePrincipaleLabel =
    specialitesOptions.find(
      (option) => option.value === selectedSpecialitePrincipale
    )?.label || "—";

  const selectedMaterielsLabels =
    selectedMaterielsRequis && selectedMaterielsRequis.length > 0
      ? selectedMaterielsRequis.map(
          (materiel) =>
            MATERIELS_MISSION_OPTIONS.find(
              (option) => option.value === materiel
            )?.label || materiel
        )
      : ["—"];

  const dateRangeLabel =
    selectedDateDebut && selectedDateFin
      ? `Du ${formatFrenchDate(selectedDateDebut)} au ${formatFrenchDate(
          selectedDateFin
        )}`
      : "—";

  const plagesHorairesLabels = (selectedPlagesHoraires || []).map((plage) => {
    const slotDate = normalizeDate(plage.date);
    return `${formatFrenchDate(slotDate)} • ${plage.heureDebut} - ${
      plage.heureFin
    }`;
  });

  const tariffUnitLabel =
    selectedMethodeTarification === "journee"
      ? "jour"
      : selectedMethodeTarification === "demi_journee"
      ? "demi-journée"
      : "heure";

  const variationTarifLabelLastWord =
    selectedMethodeTarification === "journee"
      ? "journalier"
      : selectedMethodeTarification === "demi_journee"
      ? "demi-journée"
      : "horaire";

  const hourlyUnits = (selectedPlagesHoraires || []).reduce((total, plage) => {
    const startMinutes = parseTimeToMinutes(plage.heureDebut);
    const endMinutes = parseTimeToMinutes(plage.heureFin);
    const diffMinutes = Math.max(endMinutes - startMinutes, 0);
    return total + diffMinutes / 60;
  }, 0);

  const uniquePlageDatesCount = new Set(
    (selectedPlagesHoraires || [])
      .map((plage) => normalizeDate(plage.date)?.toDateString())
      .filter((value): value is string => Boolean(value))
  ).size;

  const fallbackDayCount =
    selectedDateDebut && selectedDateFin
      ? Math.max(
          1,
          Math.floor(
            (selectedDateFin.getTime() - selectedDateDebut.getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 1;

  const pricingUnits =
    selectedMethodeTarification === "horaire"
      ? Math.max(hourlyUnits, 1)
      : selectedMethodeTarification === "journee"
      ? Math.max(uniquePlageDatesCount, fallbackDayCount)
      : Math.max((selectedPlagesHoraires || []).length, 1);

  const missionSubtotalHT = hasValidTarif ? selectedTarif * pricingUnits : 0;
  const serviceFeesHT = missionSubtotalHT > 0 ? 100 : 0;
  const totalHT = missionSubtotalHT + serviceFeesHT;
  const totalTTC = totalHT * 1.2;

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

  const handleCreateMission = async () => {
    const payload = createMissionPayloadSchema.parse(
      getValues()
    ) as CreateMissionPayloadSchema;

    const createdMission = await createMissionMutation.mutateAsync(payload);

    setCreatedMissionId(createdMission.id);
    setCurrentStep(5);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      const isValid = await trigger("modeMission");
      if (!isValid) return;

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const fieldsToValidate: MissionFormField[] = [
        "discipline",
        "specialitePrincipale",
        "specialitesSecondaires",
        "niveauExperienceRequis",
        "assuranceObligatoire",
        "materielsRequis",
        "detailMission",
      ];

      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;

      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      const fieldsToValidate: MissionFormField[] = [
        "etablissementId",
        "dateDebut",
        "dateFin",
        "plagesHoraires",
        "methodeTarification",
        "tarif",
        "pourcentageVariationTarif",
      ];

      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;

      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep === 5 && !createdMissionId) {
      setCurrentStep(4);
      return;
    }

    setCurrentStep((previous) => Math.max(previous - 1, 0));
  };

  const onSubmitPayment = async (data: FinalizeMissionPaymentSchema) => {
    if (!createdMissionId) return;

    await finalizeMissionPaymentMutation.mutateAsync({
      missionId: createdMissionId,
      data,
    });

    setCurrentStep(LAST_STEP);
  };

  const handlePaymentConfirm = async () => {
    clearPaymentErrors();

    const parsed = finalizeMissionPaymentSchema.safeParse(getPaymentValues());

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof PaymentFormState | undefined;
        if (!fieldName) return;

        setPaymentError(fieldName, {
          type: "manual",
          message: issue.message,
        });
      });

      return;
    }

    await onSubmitPayment(parsed.data);
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
                style={{ width: `${(currentStep / LAST_STEP) * 100}%` }}
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
                  {[
                    { value: "Tout", label: "Tout" },
                    ...DISCIPLINE_MISSION_OPTIONS,
                  ].map((filter) => {
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
                  })}
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
                  <H3>Nouvelle mission</H3>
                  <p className="mt-1 text-muted-foreground italic">
                    Flex = ponctuel. Coach = récurrent.
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-black">
                  Sélectionnez le type de mission que vous souhaitez publier. En
                  quelques clics, trouvez le bon coach selon la durée et vos
                  besoins.
                </p>

                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-black">
                  <p className="text-base leading-relaxed">
                    <Lightbulb className="inline h-4 w-4 mr-2 -mt-1" />
                    Vous pouvez revenir modifier votre mission avant sa
                    publication.
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
                      onValueChange={field.onChange}
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
                          field.onChange(value);
                          const nextSpecialites =
                            getSpecialitesOptionsByDiscipline(
                              value as CreateMissionFormInput["discipline"]
                            );
                          setValue("specialitesSecondaires", [], {
                            shouldDirty: true,
                            shouldValidate: true,
                          });

                          if (nextSpecialites.length > 0) {
                            setValue(
                              "specialitePrincipale",
                              nextSpecialites[0].value,
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              }
                            );
                          }
                        }}
                        options={DISCIPLINE_MISSION_OPTIONS}
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
                      <Label>Spécialité principale</Label>
                      <div className="flex flex-wrap gap-2">
                        {specialitesOptions.map((option) => {
                          const active =
                            selectedSpecialitePrincipale === option.value;

                          return (
                            <Button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                setValue("specialitePrincipale", option.value, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }
                              variant={active ? "default" : "outline"}
                            >
                              {option.label}
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
                            selectedSpecialitesSecondaires.includes(
                              option.value
                            );

                          return (
                            <Button
                              key={`secondary-${option.value}`}
                              type="button"
                              onClick={() => {
                                const nextValues = active
                                  ? selectedSpecialitesSecondaires.filter(
                                      (value) => value !== option.value
                                    )
                                  : [
                                      ...selectedSpecialitesSecondaires,
                                      option.value,
                                    ];

                                setValue("specialitesSecondaires", nextValues, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }}
                              variant={active ? "secondary" : "outline"}
                            >
                              {option.label}
                            </Button>
                          );
                        })}
                      </div>
                      <ErrorMessage>
                        {errors.specialitesSecondaires?.message as string}
                      </ErrorMessage>
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
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        options={NIVEAU_EXPERIENCE_MISSION_OPTIONS}
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
                    Matériels requis (facultatif)
                  </Label>
                  <Controller
                    name="materielsRequis"
                    control={control}
                    render={({ field }) => (
                      <Combobox
                        multiple
                        value={field.value}
                        onValueChange={field.onChange}
                        options={MATERIELS_MISSION_OPTIONS}
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
                        className="min-h-[120px]"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Ajoutez des informations utiles pour les Renfords"
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

          {currentStep === 3 && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2 space-y-4">
                <H3>Planification & tarif</H3>
              </div>

              <div className="xl:col-span-3 space-y-5">
                <div>
                  <Label htmlFor="etablissementId">
                    Site d&apos;exécution de la mission
                  </Label>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <Controller
                      name="etablissementId"
                      control={control}
                      render={({ field }) => (
                        <Combobox
                          value={field.value}
                          onValueChange={field.onChange}
                          options={etablissementOptions}
                          placeholder="Sélectionner un site"
                          searchPlaceholder="Rechercher un site"
                          emptyMessage="Aucun site actif trouvé"
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setIsCreateSiteDialogOpen(true)}
                      aria-label="Ajouter un site"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <ErrorMessage>
                    {errors.etablissementId?.message as string}
                  </ErrorMessage>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dateDebut">A partir de</Label>
                    <Controller
                      name="dateDebut"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value as Date | undefined}
                          onChange={field.onChange}
                          placeholder="Sélectionner..."
                        />
                      )}
                    />
                    <ErrorMessage>
                      {errors.dateDebut?.message as string}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Label htmlFor="dateFin">Jusqu&apos;au</Label>
                    <Controller
                      name="dateFin"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value as Date | undefined}
                          onChange={field.onChange}
                          fromDate={selectedDateDebut}
                          placeholder="Sélectionner..."
                        />
                      )}
                    />
                    <ErrorMessage>
                      {errors.dateFin?.message as string}
                    </ErrorMessage>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Plages horaires</Label>

                  {horaireFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-[1fr_130px_130px_auto] gap-3 items-start border rounded-2xl p-4"
                    >
                      <div>
                        <Label htmlFor={`plagesHoraires.${index}.date`}>
                          Date
                        </Label>
                        <Controller
                          name={`plagesHoraires.${index}.date`}
                          control={control}
                          render={({ field: slotField }) => (
                            <DatePicker
                              value={slotField.value as Date | undefined}
                              onChange={slotField.onChange}
                              fromDate={selectedDateDebut}
                              toDate={selectedDateFin}
                              placeholder="Sélectionner"
                            />
                          )}
                        />
                        <ErrorMessage>
                          {
                            errors.plagesHoraires?.[index]?.date
                              ?.message as string
                          }
                        </ErrorMessage>
                      </div>

                      <div>
                        <Label htmlFor={`plagesHoraires.${index}.heureDebut`}>
                          Début
                        </Label>
                        <Controller
                          name={`plagesHoraires.${index}.heureDebut`}
                          control={control}
                          render={({ field: slotField }) => (
                            <Input
                              id={`plagesHoraires.${index}.heureDebut`}
                              type="time"
                              value={slotField.value || ""}
                              onChange={slotField.onChange}
                            />
                          )}
                        />
                        <ErrorMessage>
                          {
                            errors.plagesHoraires?.[index]?.heureDebut
                              ?.message as string
                          }
                        </ErrorMessage>
                      </div>

                      <div>
                        <Label htmlFor={`plagesHoraires.${index}.heureFin`}>
                          Fin
                        </Label>
                        <Controller
                          name={`plagesHoraires.${index}.heureFin`}
                          control={control}
                          render={({ field: slotField }) => (
                            <Input
                              id={`plagesHoraires.${index}.heureFin`}
                              type="time"
                              value={slotField.value || ""}
                              onChange={slotField.onChange}
                            />
                          )}
                        />
                        <ErrorMessage>
                          {
                            errors.plagesHoraires?.[index]?.heureFin
                              ?.message as string
                          }
                        </ErrorMessage>
                      </div>

                      <Button
                        type="button"
                        variant="ghost-destructive"
                        size="icon"
                        className="mt-6"
                        disabled={horaireFields.length === 1}
                        onClick={() => removeHoraire(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <ErrorMessage>
                    {errors.plagesHoraires?.message as string}
                  </ErrorMessage>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendHoraire({
                        date: selectedDateDebut || undefined,
                        heureDebut: "09:00",
                        heureFin: "10:00",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une plage
                  </Button>
                </div>

                <div>
                  <Label className="mb-3">Méthode de tarification</Label>
                  <Controller
                    name="methodeTarification"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-1"
                      >
                        {METHODE_TARIFICATION.map((methode) => (
                          <div
                            key={methode}
                            className="flex items-center gap-3"
                          >
                            <RadioGroupItem
                              id={`methodeTarification-${methode}`}
                              value={methode}
                            />
                            <Label
                              htmlFor={`methodeTarification-${methode}`}
                              className="mb-0"
                            >
                              {METHODE_TARIFICATION_LABELS[methode]}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  <ErrorMessage>
                    {errors.methodeTarification?.message as string}
                  </ErrorMessage>
                </div>

                <div>
                  <Label htmlFor="tarif">
                    Tarif {variationTarifLabelLastWord}
                  </Label>
                  <Controller
                    name="tarif"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="tarif"
                        type="number"
                        min={1}
                        step="0.01"
                        value={
                          typeof field.value === "number" ? field.value : ""
                        }
                        onChange={(event) => {
                          const rawValue = event.target.value;
                          field.onChange(
                            rawValue === "" ? undefined : Number(rawValue)
                          );
                        }}
                        placeholder="Ex: 45"
                      />
                    )}
                  />
                  <ErrorMessage>{errors.tarif?.message as string}</ErrorMessage>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="pourcentageVariationTarif" className="mb-0">
                      {`Pourcentage de variation possible sur le tarif ${variationTarifLabelLastWord}`}
                    </Label>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full border border-input"
                        >
                          <CircleHelp className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-left leading-relaxed">
                        <p>
                          Pour affiner les résultats, indiquez le pourcentage de
                          variation que vous jugez acceptable sur le tarif.
                        </p>
                        <p className="mt-3">
                          Pas d&apos;inquiétude : notre algorithme privilégiera
                          toujours le prix le plus bas pour vous !
                        </p>
                        <p className="mt-3">
                          💡 Exemple : si vous avez saisi un tarif horaire de
                          100 € avec une variation de 10 %, nous pourrons aussi
                          vous proposer des indépendants dont le tarif horaire
                          va jusqu&apos;à 110 €.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    name="pourcentageVariationTarif"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-3">
                        {POURCENTAGE_VARIATION_TARIF_OPTIONS.map(
                          (percentage) => {
                            const isSelected = field.value === percentage;

                            return (
                              <Button
                                key={percentage}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => field.onChange(percentage)}
                                className="py-4 h-fit rounded-sm flex-col flex"
                              >
                                <span className="text-xl font-semibold leading-none">
                                  + {percentage}%
                                </span>
                                {hasValidTarif && (
                                  <span className="text-base text-green-600 leading-tight">
                                    {formatEuroAmount(
                                      selectedTarif * (1 + percentage / 100)
                                    )}
                                  </span>
                                )}
                              </Button>
                            );
                          }
                        )}
                      </div>
                    )}
                  />
                  <ErrorMessage>
                    {errors.pourcentageVariationTarif?.message as string}
                  </ErrorMessage>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className=" rounded-2xl bg-white space-y-4">
              <h4 className="text-2xl font-semibold">
                Vérifiez les informations avant envoi
              </h4>

              <div className="border-t border-input pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start border-b border-input pb-4">
                  <p className="font-semibold">
                    Site d&apos;exécution de la mission
                  </p>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEtablissementLabel}</span>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(3)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start border-b border-input pb-4">
                  <p className="font-semibold">Date</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {dateRangeLabel}
                    </p>
                    {plagesHorairesLabels.length > 0 ? (
                      plagesHorairesLabels.map((line, index) => (
                        <p
                          key={`${line}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <Clock3 className="h-4 w-4" />
                          {line}
                        </p>
                      ))
                    ) : (
                      <p>—</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(3)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start border-b border-input pb-4">
                  <p className="font-semibold">Poste</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDiscipline
                      ? `${
                          DISCIPLINE_MISSION_OPTIONS.find(
                            (option) => option.value === selectedDiscipline
                          )?.label || ""
                        } • ${selectedSpecialitePrincipaleLabel}`
                      : "—"}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(2)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start border-b border-input pb-4">
                  <p className="font-semibold">
                    Niveau d&apos;expérience minimum
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedNiveauExperienceLabel}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(2)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start border-b border-input pb-4">
                  <p className="font-semibold">Matériel nécessaires</p>
                  <div className="text-sm text-muted-foreground">
                    {selectedMaterielsLabels.map((label) => (
                      <p key={label}>{label}</p>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(2)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start border-b border-input pb-4">
                  <p className="font-semibold">Description de la mission</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {selectedDetailMission || "—"}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(2)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_auto] gap-3 items-start">
                  <p className="font-semibold">Tarification</p>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {hasValidTarif
                        ? `${formatEuroAmount(
                            selectedTarif
                          )}/${tariffUnitLabel} HT`
                        : "—"}
                    </p>
                    <p>
                      Variation :
                      {selectedPourcentageVariation
                        ? ` +${selectedPourcentageVariation}%`
                        : " —"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-black"
                    onClick={() => setCurrentStep(3)}
                  >
                    Modifier
                  </Button>
                </div>

                <div className="border-t border-input pt-5 flex justify-end">
                  <div className="w-full sm:w-[320px] space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">Total HT</p>
                      <p className="text-2xl font-semibold text-black">
                        {formatEuroAmount(totalHT)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">
                        frais de service inclus HT
                      </p>
                      <p className="text-muted-foreground">
                        {formatEuroAmount(serviceFeesHT)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">Total TTC</p>
                      <p className="text-muted-foreground">
                        {formatEuroAmount(totalTTC)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2 space-y-4">
                <H3>Provisionnement de la mission</H3>

                <div className="rounded-2xl border border-amber-400 bg-amber-50 p-5 text-black">
                  <p className="text-LG leading-tight font-semibold">
                    Garantie RENFORD
                    <span className="font-normal">
                      {" "}
                      : Les fonds ne sont pas débités immédiatement. Nous
                      prenons une empreinte bancaire ou un mandat pour garantir
                      la solvabilité. Le paiement effectif se fera selon
                      l&apos;avancement validé.
                    </span>
                  </p>
                </div>
              </div>

              <div className="xl:col-span-3 space-y-5">
                <div>
                  <Controller
                    name="typePaiement"
                    control={paymentControl}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-3"
                      >
                        {(["carte_bancaire", "prelevement_sepa"] as const).map(
                          (type) => {
                            const isSelected = field.value === type;

                            return (
                              <Label
                                key={type}
                                htmlFor={`typePaiement-${type}`}
                                className={cn(
                                  "flex cursor-pointer gap-4 rounded-3xl border p-5 transition items-center",
                                  isSelected
                                    ? "border-secondary bg-secondary/5"
                                    : "border-input hover:border-gray-300"
                                )}
                              >
                                <RadioGroupItem
                                  id={`typePaiement-${type}`}
                                  value={type}
                                  className="mt-1"
                                />

                                <div className="h-9 w-9 rounded-lg border border-input bg-gray-50 flex items-center justify-center">
                                  {type === "carte_bancaire" ? (
                                    <CreditCard className="h-4 w-4 text-gray-700" />
                                  ) : (
                                    <Landmark className="h-4 w-4 text-gray-700" />
                                  )}
                                </div>

                                <div className="space-y-0.5">
                                  <p className="text-base font-semibold leading-tight">
                                    {TYPE_PAIEMENT_LABELS[type]}
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-tight">
                                    {PAYMENT_TYPE_SUBTITLES[type]}
                                  </p>
                                </div>
                              </Label>
                            );
                          }
                        )}
                      </RadioGroup>
                    )}
                  />
                  <ErrorMessage>
                    {paymentErrors.typePaiement?.message as string}
                  </ErrorMessage>
                </div>

                {paymentType === "carte_bancaire" && (
                  <>
                    <div>
                      <Label htmlFor="titulaireCarteBancaire">
                        Titulaire de la carte
                      </Label>
                      <Controller
                        name="titulaireCarteBancaire"
                        control={paymentControl}
                        render={({ field }) => (
                          <Input
                            id="titulaireCarteBancaire"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="SAS Entreprise"
                          />
                        )}
                      />
                      <ErrorMessage>
                        {
                          paymentErrors.titulaireCarteBancaire
                            ?.message as string
                        }
                      </ErrorMessage>
                    </div>

                    <div>
                      <Label htmlFor="numeroCarteBancaire">
                        Numéro de carte
                      </Label>
                      <Controller
                        name="numeroCarteBancaire"
                        control={paymentControl}
                        render={({ field }) => (
                          <Input
                            id="numeroCarteBancaire"
                            inputMode="numeric"
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value.replace(/\s+/g, "")
                              )
                            }
                            placeholder="FR76 0000 0000 0000 0000 000"
                          />
                        )}
                      />
                      <ErrorMessage>
                        {paymentErrors.numeroCarteBancaire?.message as string}
                      </ErrorMessage>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateExpirationCarte">
                          Expiration (MM/AA)
                        </Label>
                        <Controller
                          name="dateExpirationCarte"
                          control={paymentControl}
                          render={({ field }) => (
                            <Input
                              id="dateExpirationCarte"
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="12/27"
                            />
                          )}
                        />
                        <ErrorMessage>
                          {paymentErrors.dateExpirationCarte?.message as string}
                        </ErrorMessage>
                      </div>

                      <div>
                        <Label htmlFor="cvvCarte">CVC</Label>
                        <Controller
                          name="cvvCarte"
                          control={paymentControl}
                          render={({ field }) => (
                            <Input
                              id="cvvCarte"
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="123"
                            />
                          )}
                        />
                        <ErrorMessage>
                          {paymentErrors.cvvCarte?.message as string}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Controller
                        name="autorisationDebit"
                        control={paymentControl}
                        render={({ field }) => (
                          <Checkbox
                            id="autorisationDebit"
                            className="mt-1"
                            checked={field.value === true}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        )}
                      />
                      <Label
                        htmlFor="autorisationDebit"
                        className="mb-0 text-sm font-normal leading-relaxed"
                      >
                        {PAYMENT_MANDATE_TEXT}
                      </Label>
                    </div>
                    <ErrorMessage>
                      {paymentErrors.autorisationDebit?.message as string}
                    </ErrorMessage>
                  </>
                )}

                {paymentType === "prelevement_sepa" && (
                  <>
                    <div>
                      <Label htmlFor="titulaireCompteBancaire">
                        Titulaire du compte (Entreprise)
                      </Label>
                      <Controller
                        name="titulaireCompteBancaire"
                        control={paymentControl}
                        render={({ field }) => (
                          <Input
                            id="titulaireCompteBancaire"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="SAS Entreprise"
                          />
                        )}
                      />
                      <ErrorMessage>
                        {
                          paymentErrors.titulaireCompteBancaire
                            ?.message as string
                        }
                      </ErrorMessage>
                    </div>

                    <div>
                      <Label htmlFor="IBANCompteBancaire">IBAN</Label>
                      <Controller
                        name="IBANCompteBancaire"
                        control={paymentControl}
                        render={({ field }) => (
                          <Input
                            id="IBANCompteBancaire"
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value
                                  .toUpperCase()
                                  .replace(/\s+/g, "")
                              )
                            }
                            placeholder="FR7630006000011234567890189"
                          />
                        )}
                      />
                      <ErrorMessage>
                        {paymentErrors.IBANCompteBancaire?.message as string}
                      </ErrorMessage>
                    </div>

                    <div>
                      <Label htmlFor="BICCompteBancaire">BIC / SWIFT</Label>
                      <Controller
                        name="BICCompteBancaire"
                        control={paymentControl}
                        render={({ field }) => (
                          <Input
                            id="BICCompteBancaire"
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value
                                  .toUpperCase()
                                  .replace(/\s+/g, "")
                              )
                            }
                            placeholder="AGRIFRPP"
                          />
                        )}
                      />
                      <ErrorMessage>
                        {paymentErrors.BICCompteBancaire?.message as string}
                      </ErrorMessage>
                    </div>

                    <div className="flex items-start gap-2">
                      <Controller
                        name="autorisationPrelevement"
                        control={paymentControl}
                        render={({ field }) => (
                          <Checkbox
                            id="autorisationPrelevement"
                            className="mt-1"
                            checked={field.value === true}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        )}
                      />
                      <Label
                        htmlFor="autorisationPrelevement"
                        className="mb-0 text-sm font-normal leading-relaxed"
                      >
                        {PAYMENT_MANDATE_TEXT}
                      </Label>
                    </div>
                    <ErrorMessage>
                      {paymentErrors.autorisationPrelevement?.message as string}
                    </ErrorMessage>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={
                currentStep === 0 ||
                (currentStep === 4 && createMissionMutation.isPending) ||
                (currentStep === 5 && finalizeMissionPaymentMutation.isPending)
              }
              className="w-full md:w-auto"
            >
              Retour
            </Button>

            {currentStep < 4 && (
              <Button
                type="button"
                onClick={handleNext}
                disabled={createMissionMutation.isPending}
                className="w-full md:w-auto"
              >
                {currentStep === 1 ? "Commencer" : "Continuer"}
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                type="button"
                onClick={handleCreateMission}
                disabled={createMissionMutation.isPending}
                className="w-full md:w-auto"
              >
                Envoyer la demande
              </Button>
            )}

            {currentStep === 5 && (
              <Button
                type="button"
                onClick={handlePaymentConfirm}
                disabled={finalizeMissionPaymentMutation.isPending}
                className="w-full md:w-auto"
              >
                {paymentType === "prelevement_sepa"
                  ? "Signer le mandat"
                  : "Valider l'empreinte bancaire"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <SiteFormDialog
        open={isCreateSiteDialogOpen}
        setOpen={setIsCreateSiteDialogOpen}
        mode="create"
        defaultSiret={user?.profilEtablissement?.siret}
        defaultTypeEtablissement={user?.profilEtablissement?.typeEtablissement}
      />
    </main>
  );
}
