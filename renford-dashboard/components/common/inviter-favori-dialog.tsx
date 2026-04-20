"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CenterState from "@/components/common/center-state";
import { useFavorisRenford, useProposerMission } from "@/hooks/favoris-renford";
import { cn, getInitials } from "@/lib/utils";
import { SecureAvatarImage } from "@/components/common/secure-file";

type InviterFavoriDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: string;
};

export default function InviterFavoriDialog({
  open,
  onOpenChange,
  missionId,
}: InviterFavoriDialogProps) {
  const favorisQuery = useFavorisRenford();
  const proposerMutation = useProposerMission();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const favoris = favorisQuery.data ?? [];

  const handleInvite = () => {
    if (!selectedId) return;
    proposerMutation.mutate(
      { profilRenfordId: selectedId, missionId },
      {
        onSuccess: () => {
          setSelectedId(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Inviter un Renford favori
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-3 pb-2">
          <p className="text-sm text-muted-foreground">
            Sélectionnez un Renford de vos favoris pour l'inviter à cette
            mission.
          </p>
        </div>

        <ScrollArea className="max-h-[calc(85vh-200px)] px-6">
          {favorisQuery.isLoading && (
            <CenterState
              title="Chargement des favoris"
              description="Nous récupérons vos renfords favoris."
              isLoading
            />
          )}

          {!favorisQuery.isLoading && favoris.length === 0 && (
            <CenterState
              title="Aucun favori"
              description="Ajoutez des Renfords à vos favoris depuis le catalogue."
            />
          )}

          <div className="space-y-2 pb-4">
            {favoris.map((fav) => {
              const renford = fav.profilRenford;
              const fullName = [
                renford.utilisateur.prenom,
                renford.utilisateur.nom,
              ]
                .filter(Boolean)
                .join(" ");
              const isSelected = selectedId === renford.id;

              return (
                <button
                  key={fav.id}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white hover:border-secondary/45",
                  )}
                  onClick={() => setSelectedId(renford.id)}
                >
                  <Avatar className="h-10 w-10 border border-input">
                    <SecureAvatarImage
                      chemin={renford.avatarChemin}
                      alt={fullName}
                    />
                    <AvatarFallback className="text-sm">
                      {getInitials(fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {fullName}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {renford.titreProfil ?? "Renford"}
                      {renford.ville && ` · ${renford.ville}`}
                    </p>
                  </div>

                  {renford.noteMoyenne != null && renford.noteMoyenne > 0 && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {renford.noteMoyenne.toFixed(1)}
                    </span>
                  )}

                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant="dark"
            disabled={!selectedId || proposerMutation.isPending}
            onClick={handleInvite}
          >
            {proposerMutation.isPending ? "Invitation..." : "Inviter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
