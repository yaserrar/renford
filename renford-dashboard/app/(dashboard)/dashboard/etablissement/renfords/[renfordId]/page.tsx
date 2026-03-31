"use client";

import CenterState from "@/components/common/center-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { H2 } from "@/components/ui/typography";
import { usePublicProfilRenford } from "@/hooks/profil-renford";
import { formatDate } from "@/lib/date";
import { formatAmount, getInitials, getUrl } from "@/lib/utils";
import {
  DIPLOME_LABELS,
  NIVEAU_EXPERIENCE_LABELS,
  TYPE_MISSION_LABELS,
} from "@/validations/profil-renford";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function EtablissementPublicRenfordProfilePage() {
  const { renfordId } = useParams<{ renfordId: string }>();
  const profileQuery = usePublicProfilRenford(renfordId);
  const profil = profileQuery.data;

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
  const missionLabels = profil.typeMission.map(
    (mission) => TYPE_MISSION_LABELS[mission] ?? mission,
  );
  const diplomeLabels = profil.renfordDiplomes.map((diplome) => ({
    id: diplome.id,
    label: DIPLOME_LABELS[diplome.typeDiplome] ?? diplome.typeDiplome,
    year: diplome.anneeObtention,
    school: diplome.etablissementFormation,
  }));
  const availabilityRange =
    !profil.dureeIllimitee && (profil.dateDebut || profil.dateFin)
      ? `Disponible du ${formatDate(profil.dateDebut ?? undefined)} au ${formatDate(
          profil.dateFin ?? undefined,
        )}`
      : "Disponible sans limite de durée";

  return (
    <main className="mt-8 space-y-6">
      <H2>Profil Renford</H2>

      <div className="bg-secondary-background rounded-3xl border m-1 p-6 h-full">
        <div className="space-y-6">
          <section className="rounded-3xl border overflow-hidden border-input bg-white">
            <div className="relative h-64 w-full bg-muted">
              {profil.imageCouvertureChemin ? (
                <Image
                  src={getUrl(profil.imageCouvertureChemin)}
                  alt={`Couverture de ${fullName}`}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6 border-t border-input px-6 py-6">
              <div className="flex items-end gap-4">
                <Avatar className="-mt-20 h-28 w-28 border-4 border-white shadow-sm">
                  <AvatarImage
                    src={
                      profil.avatarChemin
                        ? getUrl(profil.avatarChemin)
                        : undefined
                    }
                    alt={fullName}
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-semibold text-foreground">
                      {fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profil.titreProfil || "Profil Renford"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profil.ville || "Localisation non renseignée"}
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

              <div className="min-w-[220px] rounded-2xl border border-input p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Expérience</span>
                  <span className="font-medium text-foreground">
                    {profil.niveauExperience
                      ? NIVEAU_EXPERIENCE_LABELS[profil.niveauExperience]
                      : "-"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Tarif horaire</span>
                  <span className="font-medium text-foreground">
                    {formatAmount(profil.tarifHoraire)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Expertises
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {missionLabels.length > 0 ? (
                missionLabels.map((label) => <Badge key={label}>{label}</Badge>)
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune expertise renseignée
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">À propos</h3>
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {profil.descriptionProfil || "Aucune description renseignée."}
            </p>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Expériences
            </h3>
            <div className="mt-4 space-y-4">
              {profil.experiencesProfessionnelles.length > 0 ? (
                profil.experiencesProfessionnelles.map((experience) => (
                  <article
                    key={experience.id}
                    className="rounded-2xl border border-input p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {experience.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {experience.etablissement}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(experience.dateDebut)}
                        {experience.dateFin
                          ? ` - ${formatDate(experience.dateFin)}`
                          : " - Aujourd'hui"}
                      </p>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                      {experience.missions}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune expérience renseignée
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">
              Tarifs & Disponibilité
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">Tarif journée</span>
                <span className="font-medium text-foreground">
                  {profil.proposeJournee
                    ? formatAmount(profil.tarifJournee)
                    : "Non proposé"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-input p-4">
                <span className="text-muted-foreground">
                  Tarif demi-journée
                </span>
                <span className="font-medium text-foreground">
                  {profil.proposeDemiJournee
                    ? formatAmount(profil.tarifDemiJournee)
                    : "Non proposé"}
                </span>
              </div>
              <div className="rounded-2xl border border-input p-4">
                <p className="text-muted-foreground">Zone de déplacement</p>
                <p className="mt-1 font-medium text-foreground">
                  {profil.zoneDeplacement
                    ? `${profil.zoneDeplacement} km`
                    : "Non renseignée"}
                </p>
              </div>
              <div className="rounded-2xl border border-input p-4">
                <p className="text-muted-foreground">Disponibilité</p>
                <p className="mt-1 font-medium text-foreground">
                  {availabilityRange}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">Diplômes</h3>
            <div className="mt-4 space-y-3">
              {diplomeLabels.length > 0 ? (
                diplomeLabels.map((diplome) => (
                  <article
                    key={diplome.id}
                    className="rounded-2xl border border-input p-4"
                  >
                    <p className="font-medium text-foreground">
                      {diplome.label}
                    </p>
                    {diplome.year || diplome.school ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[diplome.year, diplome.school]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun diplôme renseigné
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-input bg-white p-6">
            <h3 className="text-xl font-semibold text-foreground">Portfolio</h3>
            {profil.portfolio.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {profil.portfolio.map((imagePath) => (
                  <div
                    key={imagePath}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
                  >
                    <Image
                      src={getUrl(imagePath)}
                      alt="Portfolio Renford"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Aucun élément de portfolio
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
