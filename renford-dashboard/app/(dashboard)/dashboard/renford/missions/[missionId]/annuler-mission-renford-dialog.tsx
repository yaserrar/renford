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
import { AlertTriangle } from "lucide-react";

const RAISONS_ANNULATION = [
  "Maladie",
  "Problème personnel",
  "Conflit d'horaire",
  "Cas de force majeure",
  "Autres",
] as const;

type AnnulerMissionRenfordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (raison: string, commentaires?: string) => void;
  isPending?: boolean;
};

export default function AnnulerMissionRenfordDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: AnnulerMissionRenfordDialogProps) {
  const [raison, setRaison] = useState("");
  const [commentaires, setCommentaires] = useState("");

  const handleClose = (value: boolean) => {
    if (!value) {
      setRaison("");
      setCommentaires("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Annuler ma participation</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d&apos;annuler cette mission.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              L&apos;annulation sans justification 24 heures avant le début de
              la mission peut entraîner une suspension de votre compte. Des
              pénalités peuvent être appliquées.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="raison">Raison de l&apos;annulation *</Label>
            <Select value={raison} onValueChange={setRaison}>
              <SelectTrigger id="raison">
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                {RAISONS_ANNULATION.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commentaires">Commentaires</Label>
            <Textarea
              id="commentaires"
              placeholder="Ajoutez des précisions si nécessaire..."
              value={commentaires}
              onChange={(e) => setCommentaires(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Retour
          </Button>
          <Button
            variant="destructive"
            disabled={isPending || !raison}
            onClick={() => {
              onConfirm(raison, commentaires || undefined);
              handleClose(false);
            }}
          >
            {isPending ? "Annulation..." : "Annuler la mission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
