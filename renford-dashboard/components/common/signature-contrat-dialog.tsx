"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { CalendarDays, Clock3, MapPin, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatFrenchDate, formatAmount } from "@/lib/utils";
import {
  DISCIPLINE_MISSION_LABELS,
  METHODE_TARIFICATION_SUFFIXES,
} from "@/validations/mission";
import type {
  DisciplineMission,
  MethodeTarificationMission,
} from "@/types/mission";

type ContractData = {
  missionTitle: string;
  discipline: DisciplineMission;
  dateDebut: string | Date;
  dateFin: string | Date;
  methodeTarification: MethodeTarificationMission;
  tarif: number | string | null;
  totalHours: number;
  horaires: string[];
  etablissementNom: string;
  etablissementAdresse: string;
  renfordNom: string;
  description: string | null;
};

type SignatureContratDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractData: ContractData;
  signerRole: "renford" | "etablissement";
  onSign: (signatureDataUrl: string) => void;
  isPending?: boolean;
  dialogTitle?: string;
  signButtonText?: string;
};

export default function SignatureContratDialog({
  open,
  onOpenChange,
  contractData,
  signerRole,
  onSign,
  isPending,
  dialogTitle,
  signButtonText,
}: SignatureContratDialogProps) {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [hasSigned, setHasSigned] = useState(false);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
    setHasSigned(false);
  };

  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      setHasSigned(true);
    }
  };

  const handleSign = () => {
    if (!hasSigned) return;
    const signatureDataUrl = sigCanvasRef.current?.toDataURL(
      "image/jpeg",
      0.95,
    );
    if (!signatureDataUrl) return;
    onSign(signatureDataUrl);
  };

  const disciplineLabel =
    DISCIPLINE_MISSION_LABELS[contractData.discipline] ??
    contractData.missionTitle;

  const tarifLabel = `${formatAmount(contractData.tarif)}${METHODE_TARIFICATION_SUFFIXES[contractData.methodeTarification]} HT`;

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {dialogTitle ?? "Contrat de prestation de services"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          {/* Contract document */}
          <div className="mt-4 space-y-5 text-sm text-foreground">
            {/* Header */}
            <div className="rounded-2xl border border-border bg-secondary-background/50 p-4 space-y-3">
              <h3 className="text-base font-semibold">
                Contrat de prestation – {disciplineLabel}
              </h3>
              <p className="text-muted-foreground">Établi le {today}</p>
            </div>

            {/* Parties */}
            <section className="space-y-2">
              <h4 className="font-semibold text-base">1. Les parties</h4>
              <div className="rounded-xl border border-border bg-white p-4 space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    L'Établissement (donneur d'ordre)
                  </p>
                  <p className="font-medium mt-1">
                    {contractData.etablissementNom}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {contractData.etablissementAdresse}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    Le Renford (prestataire)
                  </p>
                  <p className="font-medium mt-1">{contractData.renfordNom}</p>
                </div>
              </div>
            </section>

            {/* Objet */}
            <section className="space-y-2">
              <h4 className="font-semibold text-base">
                2. Objet de la mission
              </h4>
              <div className="rounded-xl border border-border bg-white p-4 space-y-2">
                <p>
                  Le prestataire s'engage à effectuer une mission de{" "}
                  <span className="font-medium">{disciplineLabel}</span> au sein
                  de l'établissement désigné ci-dessus, selon les modalités
                  décrites dans le présent contrat.
                </p>
                {contractData.description && (
                  <p className="text-muted-foreground">
                    {contractData.description}
                  </p>
                )}
              </div>
            </section>

            {/* Dates & horaires */}
            <section className="space-y-2">
              <h4 className="font-semibold text-base">3. Dates et horaires</h4>
              <div className="rounded-xl border border-border bg-white p-4 space-y-2">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  Du {formatFrenchDate(contractData.dateDebut)} au{" "}
                  {formatFrenchDate(contractData.dateFin)}
                </p>
                {contractData.horaires.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {contractData.horaires.map((line) => (
                      <p
                        key={line}
                        className="text-muted-foreground flex items-center gap-2"
                      >
                        <Clock3 className="h-3.5 w-3.5" />
                        {line}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-muted-foreground mt-1">
                  Durée totale estimée : {contractData.totalHours.toFixed(1)}h
                </p>
              </div>
            </section>

            {/* Tarification */}
            <section className="space-y-2">
              <h4 className="font-semibold text-base">4. Rémunération</h4>
              <div className="rounded-xl border border-border bg-white p-4">
                <p>
                  Le prestataire percevra une rémunération de{" "}
                  <span className="font-semibold">{tarifLabel}</span> pour la
                  prestation décrite ci-dessus, frais de service Renford inclus.
                </p>
              </div>
            </section>

            {/* Conditions générales */}
            <section className="space-y-2">
              <h4 className="font-semibold text-base">
                5. Conditions générales
              </h4>
              <div className="rounded-xl border border-border bg-white p-4 space-y-2 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    Responsabilité :
                  </span>{" "}
                  Le prestataire exerce sa mission sous sa propre responsabilité
                  professionnelle et s'engage à disposer des assurances et
                  certifications requises.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Annulation :
                  </span>{" "}
                  Toute annulation par l'une des parties doit être signalée au
                  moins 48h avant le début de la mission via la plateforme
                  Renford.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Confidentialité :
                  </span>{" "}
                  Les deux parties s'engagent à respecter la confidentialité des
                  informations échangées dans le cadre de cette mission.
                </p>
                <p>
                  <span className="font-medium text-foreground">Litige :</span>{" "}
                  En cas de litige, les parties s'engagent à rechercher une
                  solution amiable via la plateforme Renford avant toute action.
                </p>
              </div>
            </section>

            <Separator />

            {/* Signature area */}
            <section className="space-y-3">
              <h4 className="font-semibold text-base">
                Signature{" "}
                {signerRole === "renford"
                  ? "du prestataire"
                  : "de l'établissement"}
              </h4>
              <p className="text-muted-foreground text-sm">
                Veuillez signer ci-dessous pour confirmer votre accord avec les
                termes du contrat.
              </p>

              <div className="relative rounded-xl border-2 border-dashed border-border bg-white">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  backgroundColor="#ffffff"
                  penColor="#111111"
                  canvasProps={{
                    className: "w-full h-[160px] rounded-xl",
                  }}
                  onEnd={handleEnd}
                />
                {!hasSigned && (
                  <p className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/50 text-sm">
                    Signez ici
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  <Eraser className="mr-2 h-4 w-4" />
                  Effacer
                </Button>
                <Button
                  variant="dark"
                  className="px-8"
                  disabled={!hasSigned || isPending}
                  onClick={handleSign}
                >
                  {isPending
                    ? "Signature en cours..."
                    : (signButtonText ?? "Signer le contrat")}
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
