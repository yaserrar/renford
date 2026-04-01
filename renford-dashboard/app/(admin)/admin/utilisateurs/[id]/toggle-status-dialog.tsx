"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToggleUserStatus } from "@/hooks/admin";
import type { StatutCompte } from "@/types/utilisateur";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentStatut: StatutCompte;
  userName: string;
};

export default function ToggleStatusDialog({
  open,
  onOpenChange,
  userId,
  currentStatut,
  userName,
}: Props) {
  const mutation = useToggleUserStatus();
  const isActive = currentStatut === "actif";
  const newStatut = isActive ? "suspendu" : "actif";

  const handleToggle = () => {
    mutation.mutate(
      { userId, statut: newStatut },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isActive ? "Suspendre" : "Activer"} l&apos;utilisateur
          </DialogTitle>
          <DialogDescription>
            {isActive ? (
              <>
                Êtes-vous sûr de vouloir suspendre{" "}
                <span className="font-semibold text-foreground">
                  {userName}
                </span>{" "}
                ? Il ne pourra plus se connecter.
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir réactiver{" "}
                <span className="font-semibold text-foreground">
                  {userName}
                </span>{" "}
                ?
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggle}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="animate-spin" />}
            {isActive ? "Suspendre" : "Activer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
