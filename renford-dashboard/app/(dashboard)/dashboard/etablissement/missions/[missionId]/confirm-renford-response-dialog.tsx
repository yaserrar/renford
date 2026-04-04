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

type ConfirmRenfordResponseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "attente_de_signature" | "refuse_par_etablissement";
  onConfirm: () => void;
  isPending?: boolean;
};

export default function ConfirmRenfordResponseDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
  isPending,
}: ConfirmRenfordResponseDialogProps) {
  const isAccept = action === "attente_de_signature";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isAccept ? "Accepter ce Renford" : "Refuser ce Renford"}
          </DialogTitle>
          <DialogDescription>
            {isAccept
              ? "Cette action place ce Renford en attente de signature."
              : "Cette action écarte ce Renford de la mission. Vous pourrez passer au suivant si une candidature est encore disponible."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant={isAccept ? "dark" : "destructive"}
            disabled={isPending}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {isPending ? "Validation..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
