"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
  dateFin: string | Date | null;
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
  onSign: (signatureImage: string) => void;
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
  const sigPadRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [accepted, setAccepted] = useState(false);

  const handleClear = () => {
    sigPadRef.current?.clear();
    setIsEmpty(true);
  };

  const handleEnd = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      setIsEmpty(false);
    }
  };

  const handleSign = () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty() || !accepted) return;
    const dataUrl = sigPadRef.current.toDataURL("image/png");
    onSign(dataUrl);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      handleClear();
      setAccepted(false);
    }
    onOpenChange(value);
  };

  const disciplineLabel =
    DISCIPLINE_MISSION_LABELS[contractData.discipline] ??
    contractData.missionTitle;

  const tarifLabel = `${formatAmount(contractData.tarif)}${METHODE_TARIFICATION_SUFFIXES[contractData.methodeTarification]} HT`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="md:max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {dialogTitle ?? "Contrat de prestation de services"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          {/* Contract summary */}
          <div className="mt-4 space-y-5 text-sm text-foreground">
            <div className="rounded-2xl border border-border bg-secondary-background/50 p-4 space-y-3">
              <h3 className="text-base font-semibold">
                {dialogTitle ?? "Contrat de prestation"} – {disciplineLabel}
              </h3>
              <p className="text-muted-foreground">
                {contractData.etablissementNom} - {contractData.renfordNom}
              </p>
              <p className="text-muted-foreground">
                {contractData.dateFin
                  ? `Du ${formatFrenchDate(contractData.dateDebut)} au ${formatFrenchDate(contractData.dateFin)}`
                  : `Le ${formatFrenchDate(contractData.dateDebut)}`}{" "}
                – {contractData.totalHours.toFixed(1)}h – {tarifLabel}
              </p>
            </div>

            <Separator />

            {/* Signature pad */}
            <section className="space-y-3">
              <h4 className="font-semibold text-base">
                Signature électronique
              </h4>

              <p className="text-muted-foreground text-sm">
                Dessinez votre signature dans le cadre ci-dessous.
              </p>

              <div className="relative rounded-xl border-2 border-dashed border-border bg-white">
                <SignatureCanvas
                  ref={sigPadRef}
                  canvasProps={{
                    className: "w-full h-[200px] rounded-xl",
                  }}
                  onEnd={handleEnd}
                />
                {!isEmpty && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-white border border-border text-muted-foreground hover:text-foreground transition-colors"
                    title="Effacer la signature"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* CGU acceptance */}
              <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary-background/30 p-4">
                <Checkbox
                  id="accept-cgu"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(v === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="accept-cgu"
                  className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                >
                  En cliquant sur &laquo;&nbsp;
                  {signButtonText ?? "Accepter la mission"}&nbsp;&raquo;, vous
                  confirmez accepter cette mission et être lié contractuellement
                  selon les{" "}
                  <a
                    href="/conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline"
                  >
                    CGU en vigueur
                  </a>
                  .
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="dark"
                  className="px-8"
                  disabled={isEmpty || !accepted || isPending}
                  onClick={handleSign}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {signButtonText ?? "Accepter la mission"}
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
