"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAccount } from "@/hooks/utilisateur";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteAccount();

  return (
    <>
      <div className="bg-white rounded-3xl border border-destructive/30 p-6 space-y-3">
        <h3 className="text-base font-semibold text-destructive">
          Supprimer mon compte
        </h3>
        <p className="text-sm text-muted-foreground">
          Cette action est irréversible. Vos données personnelles seront
          anonymisées conformément au RGPD. Vos missions et historiques seront
          conservés de manière anonyme.
        </p>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="w-4 h-4" />
          Supprimer mon compte
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer votre compte</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer votre compte ? Vos données
              personnelles seront anonymisées. Cette action est{" "}
              <span className="font-semibold text-destructive">
                irréversible
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="animate-spin" />}
              Confirmer la suppression
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
