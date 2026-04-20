"use client";

import { useState } from "react";
import { Heart, SlidersHorizontal, Star } from "lucide-react";
import { H2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SecureAvatarImage } from "@/components/common/secure-file";
import CenterState from "@/components/common/center-state";
import InviterRenfordDialog from "@/components/common/inviter-renford-dialog";
import { useAddFavori, useFavorisRenford } from "@/hooks/favoris-renford";
import { useGteEtablissementMissionsByTab } from "@/hooks/mission";
import { useFilleuls } from "@/hooks/parrainage";
import { cn, getInitials } from "@/lib/utils";
import RenfordFavoriCard from "./renford-favori-card";
import ProposerMissionDialog from "./proposer-mission-dialog";
import Link from "next/link";

export default function MesRenfordsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [filleulDialogOpen, setFilleulDialogOpen] = useState(false);
  const [selectedFilleul, setSelectedFilleul] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const favorisQuery = useFavorisRenford();
  const addFavoriMutation = useAddFavori();
  const dernieresMissionsQuery = useGteEtablissementMissionsByTab("terminees");
  const filleulsQuery = useFilleuls();
  const favoris = favorisQuery.data ?? [];
  const dernieresMissions = dernieresMissionsQuery.data ?? [];
  const filleuls = filleulsQuery.data ?? [];
  const derniersRenfords = Array.from(
    new Map(
      dernieresMissions
        .filter((mission) => mission.renfordAssigne?.id)
        .map((mission) => {
          const renford = mission.renfordAssigne!;
          return [renford.id, renford] as const;
        }),
    ).values(),
  );
  const favoriRenfordIds = new Set(
    favoris.map((favori) => favori.profilRenfordId),
  );

  return (
    <main className="mt-8 space-y-6">
      <H2>Mes renfords</H2>

      <Tabs defaultValue="favoris" className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="favoris">Mes favoris</TabsTrigger>
            <TabsTrigger value="derniers">Mes derniers Renfords</TabsTrigger>
            <TabsTrigger value="filleuls">Mes filleuls</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-full">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </Button>
            <Button
              variant="dark"
              className="gap-2 rounded-full"
              onClick={() => setInviteOpen(true)}
            >
              Inviter un Renford
            </Button>
          </div>
        </div>

        <div className="bg-secondary-background rounded-3xl border m-1 p-6 min-h-[400px]">
          <TabsContent value="favoris">
            {favorisQuery.isLoading && (
              <CenterState
                className="border-0"
                title="Chargement"
                description="Nous récupérons vos renfords favoris."
                isLoading
              />
            )}

            {!favorisQuery.isLoading && favoris.length === 0 && (
              <CenterState
                className="border-0"
                title="Aucun favori"
                description="Vous n'avez pas encore de renford en favori. Consultez les profils et ajoutez-les en cliquant sur le cœur."
              />
            )}

            {favoris.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoris.map((favori) => (
                  <RenfordFavoriCard key={favori.id} favori={favori} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="derniers">
            {dernieresMissionsQuery.isLoading && (
              <CenterState
                className="border-0"
                title="Chargement"
                description="Nous récupérons vos derniers renfords."
                isLoading
              />
            )}

            {!dernieresMissionsQuery.isLoading &&
              derniersRenfords.length === 0 && (
                <CenterState
                  className="border-0"
                  title="Aucun renford récent"
                  description="Vous verrez ici les renfords avec lesquels vous avez terminé des missions."
                />
              )}

            {derniersRenfords.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {derniersRenfords.map((renford) => {
                  const fullName = [renford.prenom, renford.nom]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <article
                      key={renford.id}
                      className="flex flex-col items-center rounded-2xl border border-input bg-white px-6 py-6"
                    >
                      <Link
                        href={`/dashboard/etablissement/renfords/${renford.id}`}
                      >
                        <Avatar className="h-20 w-20 border-2 border-input">
                          <SecureAvatarImage
                            chemin={renford.avatarChemin}
                            alt={fullName}
                          />
                          <AvatarFallback className="text-lg font-semibold">
                            {getInitials(fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </Link>

                      <Link
                        href={`/dashboard/etablissement/renfords/${renford.id}`}
                      >
                        <p className="mt-3 text-base font-semibold text-foreground">
                          {fullName}
                        </p>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {renford.titreProfil || "Renford"}
                      </p>
                      {renford.noteMoyenne != null && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {renford.noteMoyenne.toFixed(1)}
                        </p>
                      )}

                      <Button
                        type="button"
                        variant="secondary"
                        className="mt-4 w-full rounded-full"
                        disabled={
                          addFavoriMutation.isPending ||
                          favoriRenfordIds.has(renford.id)
                        }
                        onClick={() => addFavoriMutation.mutate(renford.id)}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        {favoriRenfordIds.has(renford.id)
                          ? "Déjà en favoris"
                          : "Ajouter au favoris"}
                      </Button>
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="filleuls">
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-foreground">
                Cette section regroupe les coachs que vous avez parrainés. Une
                commission préférentielle s&apos;applique automatiquement sur
                leurs missions.
              </div>

              {filleulsQuery.isLoading && (
                <CenterState
                  className="border-0"
                  title="Chargement"
                  description="Nous récupérons vos filleuls."
                  isLoading
                />
              )}

              {!filleulsQuery.isLoading && filleuls.length === 0 && (
                <CenterState
                  className="border-0"
                  title="Aucun filleul"
                  description="Vous n'avez pas encore parrainé de renford. Invitez-en un pour commencer."
                />
              )}

              {filleuls.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filleuls.map((filleul) => {
                    const fullName = [filleul.prenom, filleul.nom]
                      .filter(Boolean)
                      .join(" ");
                    const profil = filleul.profilRenford;

                    if (!profil) return null;

                    return (
                      <article
                        key={filleul.id}
                        className="flex flex-col items-center rounded-2xl border border-input bg-white px-6 py-6"
                      >
                        <Link
                          href={`/dashboard/etablissement/renfords/${profil.id}`}
                        >
                          <Avatar className="h-20 w-20 border-2 border-input">
                            <SecureAvatarImage
                              chemin={profil?.avatarChemin}
                              alt={fullName}
                            />
                            <AvatarFallback className="text-lg font-semibold">
                              {getInitials(fullName)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <p className="mt-3 text-base font-semibold text-foreground">
                          {fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {profil?.titreProfil || "Renford"}
                        </p>
                        {profil?.noteMoyenne != null && (
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {profil.noteMoyenne.toFixed(1)}
                          </p>
                        )}

                        <div className="mt-4 flex w-full items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-full"
                            disabled={
                              addFavoriMutation.isPending ||
                              favoriRenfordIds.has(profil.id)
                            }
                            onClick={() => addFavoriMutation.mutate(profil.id)}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                favoriRenfordIds.has(profil.id) &&
                                  "fill-current",
                              )}
                            />
                          </Button>

                          <Button
                            type="button"
                            variant="dark"
                            className="flex-1 rounded-full"
                            onClick={() => {
                              setSelectedFilleul({
                                id: profil.id,
                                name: fullName,
                              });
                              setFilleulDialogOpen(true);
                            }}
                          >
                            Proposer une mission
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <InviterRenfordDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      {selectedFilleul && (
        <ProposerMissionDialog
          open={filleulDialogOpen}
          onOpenChange={(open) => {
            setFilleulDialogOpen(open);
            if (!open) {
              setSelectedFilleul(null);
            }
          }}
          profilRenfordId={selectedFilleul.id}
          renfordName={selectedFilleul.name}
        />
      )}
    </main>
  );
}
