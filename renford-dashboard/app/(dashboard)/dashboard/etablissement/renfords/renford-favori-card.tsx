"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials, getUrl } from "@/lib/utils";
import { useRemoveFavori } from "@/hooks/favoris-renford";
import { FavorisRenfordItem } from "@/types/favoris-renford";
import ProposerMissionDialog from "./proposer-mission-dialog";
import Link from "next/link";

type RenfordFavoriCardProps = {
  favori: FavorisRenfordItem;
};

export default function RenfordFavoriCard({ favori }: RenfordFavoriCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const removeFavoriMutation = useRemoveFavori();
  const profil = favori.profilRenford;

  const fullName = [profil.utilisateur.prenom, profil.utilisateur.nom]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="flex flex-col items-center rounded-2xl border border-input bg-white px-6 py-6">
      <Link href={`/dashboard/etablissement/renfords/${profil.id}`}>
        <Avatar className="h-20 w-20 border-2 border-input">
          <AvatarImage
            src={profil.avatarChemin ? getUrl(profil.avatarChemin) : undefined}
            alt={fullName}
          />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <Link href={`/dashboard/etablissement/renfords/${profil.id}`}>
        <p className="mt-3 text-base font-semibold text-foreground">
          {fullName}
        </p>
      </Link>
      <p className="text-sm text-muted-foreground">
        {profil.titreProfil || "Renford"}
      </p>
      {profil.noteMoyenne != null && (
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {profil.noteMoyenne.toFixed(1)}
        </p>
      )}

      <div className="mt-4 flex w-full items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full"
          onClick={() => removeFavoriMutation.mutate(profil.id)}
          disabled={removeFavoriMutation.isPending}
        >
          <Heart className="h-4 w-4 fill-current" />
        </Button>
        <Button
          variant="dark"
          className="flex-1 rounded-full"
          onClick={() => setDialogOpen(true)}
        >
          Proposer une mission
        </Button>
      </div>

      <ProposerMissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profilRenfordId={profil.id}
        renfordName={fullName}
      />
    </article>
  );
}
