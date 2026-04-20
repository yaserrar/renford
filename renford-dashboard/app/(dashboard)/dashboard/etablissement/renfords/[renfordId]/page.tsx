"use client";

import { useState } from "react";
import CenterState from "@/components/common/center-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SecureAvatarImage,
  SecureImage,
  SecureLink,
} from "@/components/common/secure-file";
import { useFileUrl } from "@/hooks/use-file-url";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { H2 } from "@/components/ui/typography";
import { usePublicProfilRenford } from "@/hooks/profil-renford";
import {
  useAddFavori,
  useCheckFavori,
  useRemoveFavori,
} from "@/hooks/favoris-renford";
import {
  formatAmount,
  formatFrenchDate,
  formatYear,
  getInitials,
} from "@/lib/utils";
import {
  CRENEAUX_DISPONIBILITE,
  CRENEAUX_DISPONIBILITE_LABELS,
  DIPLOME_LABELS,
  JOUR_SEMAINE,
  JOUR_SEMAINE_LABELS,
  NIVEAU_EXPERIENCE_LABELS,
  TYPE_MISSION_LABELS,
} from "@/validations/profil-renford";
import { Award, BadgeCheck, Eye, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import type { RenfordDiplome } from "@/types/profil-renford";
import ProposerMissionDialog from "../proposer-mission-dialog";

export default function EtablissementPublicRenfordProfilePage() {
  const { renfordId } = useParams<{ renfordId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const profileQuery = usePublicProfilRenford(renfordId);
  const favoriQuery = useCheckFavori(renfordId);
  const addFavoriMutation = useAddFavori();
  const removeFavoriMutation = useRemoveFavori();
  const profil = profileQuery.data;
  const isFavori = favoriQuery.data?.isFavori ?? false;

  if (profileQuery.isLoading) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Profil Renford</H2>
        <CenterState
          title="Chargement du profil"
          description="Nous récupérons les informations de ce profil Renford."
          isLoading
        />
      </main>
    );
  }

  if (profileQuery.isError) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Profil Renford</H2>
        <CenterState
          title="Impossible de charger ce profil"
          description="Réessayez dans quelques instants ou actualisez la page."
        />
      </main>
    );
  }

  if (!profil) {
    return (
      <main className="mt-8 space-y-6">
        <H2>Profil Renford</H2>
        <CenterState
          title="Profil introuvable"
          description="Ce profil Renford n'existe pas ou n'est plus accessible."
        />
      </main>
    );
  }

  const fullName = [profil.utilisateur.prenom, profil.utilisateur.nom]
    .filter(Boolean)
    .join(" ");

  const disponibilites = {
    lundi: profil.disponibilitesLundi ?? [],
    mardi: profil.disponibilitesMardi ?? [],
    mercredi: profil.disponibilitesMercredi ?? [],
    jeudi: profil.disponibilitesJeudi ?? [],
    vendredi: profil.disponibilitesVendredi ?? [],
    samedi: profil.disponibilitesSamedi ?? [],
    dimanche: profil.disponibilitesDimanche ?? [],
  } as const;

  return (
    <main className="mt-8 space-y-6">
      <H2>Profil Renford</H2>

      <div className="bg-secondary-background rounded-3xl border m-1 p-6 h-full">
        <div className="space-y-4">
          {/* ─── Hero ─── */}
          <div className="bg-white rounded-3xl border border-input overflow-hidden">
            <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
              {profil.imageCouvertureChemin ? (
                <SecureImage
                  chemin={profil.imageCouvertureChemin}
                  alt={`Couverture de ${fullName}`}
                  className="object-cover w-full h-full"
                />
              ) : null}
            </div>

            <div className="p-6 border-b border-input flex flex-wrap items-end justify-between gap-6 -mt-10">
              <div className="flex items-end gap-4">
                <Avatar className="h-26 w-26 border-4 border-white shadow-sm">
                  <SecureAvatarImage
                    chemin={profil.avatarChemin}
                    alt={fullName}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-2xl font-semibold">{fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {profil.titreProfil || "Profil Renford"} ·{" "}
                    {profil.niveauExperience
                      ? NIVEAU_EXPERIENCE_LABELS[profil.niveauExperience]
                      : "-"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {[profil.adresse, profil.codePostal, profil.ville]
                        .filter(Boolean)
                        .join(" ") || "Localisation non renseignée"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {profil.noteMoyenne
                        ? `${profil.noteMoyenne.toFixed(1)}/5`
                        : "Pas encore de note"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-full"
                  onClick={() =>
                    isFavori
                      ? removeFavoriMutation.mutate(profil.id)
                      : addFavoriMutation.mutate(profil.id)
                  }
                  disabled={
                    addFavoriMutation.isPending ||
                    removeFavoriMutation.isPending
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${isFavori ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  variant="dark"
                  className="rounded-full"
                  onClick={() => setDialogOpen(true)}
                >
                  Proposer une mission
                </Button>
              </div>
            </div>
          </div>

          {/* ─── 2-column grid ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ─── Left column ─── */}
            <div className="space-y-4">
              {/* Disponibilités */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
                <h3 className="text-xl font-semibold">Disponibilités</h3>

                <div className="rounded-xl border border-input p-4 text-sm flex items-center justify-between">
                  <p className="text-muted-foreground">Mobilité</p>
                  <p className="font-semibold">
                    {profil.zoneDeplacement
                      ? `${profil.zoneDeplacement} km`
                      : "Non renseignée"}
                  </p>
                </div>

                <p className="font-medium">Semaine type</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2"></th>
                        {CRENEAUX_DISPONIBILITE.map((creneau) => (
                          <th
                            key={creneau}
                            className="text-center py-2 font-medium"
                          >
                            {CRENEAUX_DISPONIBILITE_LABELS[creneau]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {JOUR_SEMAINE.map((jour) => (
                        <tr key={jour}>
                          <td className="py-2 font-medium">
                            {JOUR_SEMAINE_LABELS[jour]}
                          </td>
                          {CRENEAUX_DISPONIBILITE.map((creneau) => (
                            <td key={creneau} className="text-center py-2">
                              <Checkbox
                                checked={disponibilites[jour].includes(creneau)}
                                disabled
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl border border-input p-4 space-y-2">
                  {profil.dureeIllimitee ? (
                    <p className="text-sm font-medium">
                      Disponible pour une durée illimitée
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          À partir de
                        </span>
                        <span className="font-medium">
                          {formatFrenchDate(profil.dateDebut, "-", "numeric")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Jusqu&apos;au
                        </span>
                        <span className="font-medium">
                          {formatFrenchDate(profil.dateFin, "-", "numeric")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
                <h3 className="text-xl font-semibold">Qualifications</h3>

                <div className="rounded-xl border border-input p-4 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Niveau d&apos;expérience
                  </p>
                  <p className="font-semibold text-sm">
                    {profil.niveauExperience
                      ? NIVEAU_EXPERIENCE_LABELS[profil.niveauExperience]
                      : "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-input p-4 space-y-2">
                  <p className="text-sm font-semibold">Tarification</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tarif horaire</span>
                    <span className="font-medium">
                      {formatAmount(profil.tarifHoraire)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tarif journée</span>
                    <span className="font-medium">
                      {profil.proposeJournee
                        ? formatAmount(profil.tarifJournee)
                        : "Non proposé"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tarif demi-journée
                    </span>
                    <span className="font-medium">
                      {profil.proposeDemiJournee
                        ? formatAmount(profil.tarifDemiJournee)
                        : "Non proposé"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Right column ─── */}
            <div className="space-y-4">
              {/* Expertises */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-3">
                <h3 className="text-xl font-semibold">Expertises</h3>
                <div className="flex flex-wrap gap-2">
                  {profil.typeMission.length > 0 ? (
                    profil.typeMission.map((mission) => (
                      <Badge key={mission}>
                        {TYPE_MISSION_LABELS[mission] ?? mission}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">-</p>
                  )}
                </div>
              </div>

              {/* À propos */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-3">
                <h3 className="text-xl font-semibold">À propos</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {profil.descriptionProfil || "-"}
                </p>
              </div>

              {/* Expériences */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  Expériences Professionnelles
                </h3>
                {profil.experiencesProfessionnelles.length > 0 ? (
                  <div className="space-y-3">
                    {profil.experiencesProfessionnelles.map((experience) => (
                      <div
                        key={experience.id}
                        className="rounded-xl border border-input p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold text-base">
                            {experience.nom}
                          </p>
                          <p className="text-xs font-medium text-secondary whitespace-nowrap">
                            {formatYear(experience.dateDebut)} -{" "}
                            {formatYear(experience.dateFin) !== "-"
                              ? formatYear(experience.dateFin)
                              : "Présent"}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-muted-foreground mt-1">
                          {experience.etablissement}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {experience.missions}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>

              {/* Certifications & Formations */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  Certifications & Formations
                </h3>
                {profil.renfordDiplomes.length > 0 ? (
                  <div className="space-y-3">
                    {profil.renfordDiplomes.map((diplome) => (
                      <DiplomeLinkItem key={diplome.id} diplome={diplome} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>

              {/* Portfolio */}
              <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  Portfolio & réalisations
                </h3>
                {profil.portfolio.length > 0 ? (
                  <div className="px-8">
                    <Carousel opts={{ loop: true }}>
                      <CarouselContent>
                        {profil.portfolio.map((imagePath, index) => (
                          <CarouselItem
                            key={`${imagePath}-${index}`}
                            className="basis-full"
                          >
                            <div className="relative w-full max-w-xl mx-auto aspect-[4/3] overflow-hidden rounded-2xl border border-input bg-muted/30">
                              <PortfolioImage
                                chemin={imagePath}
                                index={index}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </Carousel>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProposerMissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profilRenfordId={profil.id}
        renfordName={fullName}
      />
    </main>
  );
}

/* ── Helper components for secure file URLs ── */

function DiplomeLinkItem({ diplome }: { diplome: RenfordDiplome }) {
  const url = useFileUrl(diplome.justificatifDiplomeChemin);
  return (
    <a
      href={url || undefined}
      target={url ? "_blank" : undefined}
      rel={url ? "noopener noreferrer" : undefined}
      className="rounded-2xl border border-input p-4 flex items-center justify-between gap-3"
      aria-disabled={!diplome.justificatifDiplomeChemin}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Award className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-sm truncate">
              {DIPLOME_LABELS[diplome.typeDiplome] ?? diplome.typeDiplome}
            </p>
            {diplome.verifie && (
              <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {[
              diplome.anneeObtention
                ? `Obtenu en ${diplome.anneeObtention}`
                : null,
              diplome.etablissementFormation,
            ]
              .filter(Boolean)
              .join(" · ") || "Année non renseignée"}
          </p>
        </div>
      </div>
      {diplome.justificatifDiplomeChemin && (
        <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
    </a>
  );
}

function PortfolioImage({ chemin, index }: { chemin: string; index: number }) {
  const url = useFileUrl(chemin);
  if (!url) return null;
  return (
    <Image
      src={url}
      alt={`Portfolio ${index + 1}`}
      fill
      sizes="(max-width: 768px) 90vw, 640px"
      className="object-cover"
    />
  );
}
