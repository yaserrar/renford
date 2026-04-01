"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMarkContactMessageTraite } from "@/hooks/admin";
import type { ContactMessage } from "@/types/admin";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ContactMessage;
};

export default function TraiterMessageDialog({
  open,
  onOpenChange,
  message,
}: Props) {
  const mutation = useMarkContactMessageTraite();

  const handleConfirm = () => {
    mutation.mutate(message.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Marquer comme traité</DialogTitle>
          <DialogDescription>
            Confirmer que le message de{" "}
            <span className="font-semibold text-foreground">
              {message.utilisateur.prenom} {message.utilisateur.nom}
            </span>{" "}
            a été traité ?
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm space-y-1">
          <p className="font-medium">{message.sujet}</p>
          <p className="text-muted-foreground line-clamp-3">{message.texte}</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
