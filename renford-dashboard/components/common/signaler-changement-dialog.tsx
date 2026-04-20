"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TYPES_CHANGEMENT = [
  "Horaires",
  "Date de début",
  "Date de fin",
  "Lieu",
  "Autres",
] as const;

type SignalerChangementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: string, motif: string) => void;
  isPending?: boolean;
};

export default function SignalerChangementDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: SignalerChangementDialogProps) {
  const [type, setType] = useState("");
  const [motif, setMotif] = useState("");

  const handleClose = (value: boolean) => {
    if (!value) {
      setType("");
      setMotif("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Signaler un changement</DialogTitle>
          <DialogDescription>
            Tout changement signalé sera communiqué à l&apos;autre partie par
            email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type-changement">Type de changement *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type-changement">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES_CHANGEMENT.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif">Motif *</Label>
            <Textarea
              id="motif"
              placeholder="Décrivez le changement souhaité..."
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Annuler
          </Button>
          <Button
            variant="dark"
            disabled={isPending || !type || !motif.trim()}
            onClick={() => {
              onConfirm(type, motif.trim());
              handleClose(false);
            }}
          >
            {isPending ? "Envoi..." : "Soumettre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
