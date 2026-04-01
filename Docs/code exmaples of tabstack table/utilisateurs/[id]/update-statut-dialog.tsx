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
import {
  useUpdateUtilisateurStatut,
  getToggledStatut,
} from "@/hooks/utilisateurs";
import { StatutUtilisateur } from "@/types/user";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentStatut: StatutUtilisateur;
  userName: string;
};

export default function UpdateStatutDialog({
  open,
  onOpenChange,
  userId,
  currentStatut,
  userName,
}: Props) {
  const updateStatut = useUpdateUtilisateurStatut(userId);

  const newStatut = getToggledStatut(currentStatut);
  const isActivating = newStatut === "actif";

  const handleConfirm = () => {
    updateStatut.mutate(
      { statut: newStatut },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            {isActivating ? "Activer" : "Désactiver"} le compte
          </DialogTitle>
          <DialogDescription className="text-base">
            {isActivating ? (
              <>
                Êtes-vous sûr de vouloir{" "}
                <span className="font-medium text-green-600">activer</span> le
                compte de <span className="font-medium">{userName}</span> ?
                <br />
                <br />
                L'utilisateur pourra à nouveau accéder à la plateforme et à
                toutes ses fonctionnalités.
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir{" "}
                <span className="font-medium text-orange-600">désactiver</span>{" "}
                le compte de <span className="font-medium">{userName}</span> ?
                <br />
                <br />
                L'utilisateur ne pourra plus accéder à la plateforme jusqu'à ce
                que son compte soit réactivé.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateStatut.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant={isActivating ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={updateStatut.isPending}
          >
            {updateStatut.isPending
              ? isActivating
                ? "Activation..."
                : "Désactivation..."
              : isActivating
              ? "Activer"
              : "Désactiver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
