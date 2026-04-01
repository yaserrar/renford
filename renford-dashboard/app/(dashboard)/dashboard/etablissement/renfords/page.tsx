"use client";

import { useState } from "react";
import { Plus, SlidersHorizontal, Star } from "lucide-react";
import { H2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CenterState from "@/components/common/center-state";
import InviterRenfordDialog from "@/components/common/inviter-renford-dialog";
import { useFavorisRenford } from "@/hooks/favoris-renford";
import { useFilleuls } from "@/hooks/parrainage";
import { getInitials, getUrl } from "@/lib/utils";
import RenfordFavoriCard from "./renford-favori-card";
import Link from "next/link";

export default function MesRenfordsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const favorisQuery = useFavorisRenford();
  const filleulsQuery = useFilleuls();
  const favoris = favorisQuery.data ?? [];
  const filleuls = filleulsQuery.data ?? [];

  return (
    <main className="mt-8 space-y-6">
      <H2>Mes renfords</H2>

      <Tabs defaultValue="favoris" className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="favoris">Mes favoris</TabsTrigger>
            <TabsTrigger value="derniers">Vos derniers Renfords</TabsTrigger>
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
            <CenterState
              className="border-0"
              title="Bientôt disponible"
              description="La liste de vos derniers renfords sera bientôt disponible."
            />
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

                    return (
                      <article
                        key={filleul.id}
                        className="flex flex-col items-center rounded-2xl border border-input bg-white px-6 py-6"
                      >
                        <Link
                          href={
                            profil
                              ? `/dashboard/etablissement/renfords/${profil.id}`
                              : "#"
                          }
                        >
                          <Avatar className="h-20 w-20 border-2 border-input">
                            <AvatarImage
                              src={
                                profil?.avatarChemin
                                  ? getUrl(profil.avatarChemin)
                                  : undefined
                              }
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
    </main>
  );
}
