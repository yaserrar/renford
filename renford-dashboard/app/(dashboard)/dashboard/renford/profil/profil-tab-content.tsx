import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import {
  CRENEAUX_DISPONIBILITE,
  CRENEAUX_DISPONIBILITE_LABELS,
  DIPLOME_LABELS,
  JOUR_SEMAINE,
  JOUR_SEMAINE_LABELS,
  TYPE_MISSION_LABELS,
} from "@/validations/profil-renford";
import Image from "next/image";

type ProfilTabContentProps = {
  me: CurrentUser | undefined;
};

const getInitials = (name?: string | null) => {
  if (!name) return "-";
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "-";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const formatYear = (value: Date | string | null | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.getFullYear().toString();
};

export default function ProfilTabContent({ me }: ProfilTabContentProps) {
  const profil = me?.profilRenford;
  const fullName = [me?.prenom, me?.nom].filter(Boolean).join(" ") || "-";
  const title = profil?.titreProfil || "Coach";
  const missionLabels = (profil?.typeMission ?? []).map(
    (mission) => TYPE_MISSION_LABELS[mission]
  );
  const diplomeLabels = (profil?.renfordDiplomes ?? []).map(
    (diplome) => DIPLOME_LABELS[diplome.typeDiplome]
  );
  const disponibilites = {
    lundi: profil?.disponibilitesLundi ?? [],
    mardi: profil?.disponibilitesMardi ?? [],
    mercredi: profil?.disponibilitesMercredi ?? [],
    jeudi: profil?.disponibilitesJeudi ?? [],
    vendredi: profil?.disponibilitesVendredi ?? [],
    samedi: profil?.disponibilitesSamedi ?? [],
    dimanche: profil?.disponibilitesDimanche ?? [],
  } as const;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-input overflow-hidden">
        <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
          {profil?.imageCouvertureChemin ? (
            <Image
              src={getUrl(profil.imageCouvertureChemin)}
              alt="Couverture profil"
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="p-6 border-b border-input flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={me?.avatarChemin ? getUrl(me.avatarChemin) : undefined}
              alt={fullName}
            />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-2xl font-semibold">{fullName}</p>
            <p className="text-sm text-muted-foreground">
              {title} · {profil?.niveauExperience?.replaceAll("_", " ") || "-"}
            </p>
            <p className="text-xs text-muted-foreground">
              {[profil?.codePostal, profil?.ville].filter(Boolean).join(" ") ||
                "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-input p-6 space-y-4">
          <h3 className="text-xl font-semibold">Disponibilité</h3>
          <div className="rounded-xl border border-input p-4 text-sm">
            <p className="text-muted-foreground">Mobilité</p>
            <p className="font-semibold">{profil?.zoneDeplacement ?? 0} km</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2"></th>
                  {CRENEAUX_DISPONIBILITE.map((creneau) => (
                    <th key={creneau} className="text-center py-2 font-medium">
                      {CRENEAUX_DISPONIBILITE_LABELS[creneau]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOUR_SEMAINE.map((jour) => (
                  <tr key={jour} className="border-t border-input">
                    <td className="py-2 font-medium">
                      {JOUR_SEMAINE_LABELS[jour]}
                    </td>
                    {CRENEAUX_DISPONIBILITE.map((creneau) => (
                      <td key={creneau} className="text-center py-2">
                        <span className="inline-block h-4 w-4 rounded-[4px] border border-input align-middle">
                          {disponibilites[jour].includes(creneau) ? (
                            <span className="block h-full w-full rounded-[3px] bg-secondary" />
                          ) : null}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-input p-6 space-y-3">
            <h3 className="text-xl font-semibold">Expertises</h3>
            <div className="flex flex-wrap gap-2">
              {missionLabels.length ? (
                missionLabels.map((label) => <Badge key={label}>{label}</Badge>)
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-input p-6 space-y-3">
            <h3 className="text-xl font-semibold">À propos</h3>
            <p className="text-sm text-muted-foreground">
              {profil?.aPropos || "-"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-input p-6 space-y-3">
            <h3 className="text-xl font-semibold">
              Expériences professionnelles
            </h3>
            {(profil?.experiencesProfessionnelles ?? []).length ? (
              <div className="space-y-3">
                {profil?.experiencesProfessionnelles.map((experience) => (
                  <div
                    key={experience.id}
                    className="rounded-xl border border-input p-3"
                  >
                    <p className="font-semibold">{experience.nom}</p>
                    <p className="text-sm text-muted-foreground">
                      {experience.etablissement}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {experience.missions}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatYear(experience.dateDebut)} -{" "}
                      {experience.anneeFin ?? "Présent"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-input p-6 space-y-3">
            <h3 className="text-xl font-semibold">
              Certifications & formations
            </h3>
            {diplomeLabels.length ? (
              <div className="space-y-2">
                {diplomeLabels.map((label) => (
                  <div
                    key={label}
                    className="rounded-xl border border-input p-3 text-sm"
                  >
                    {label}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-input p-6 space-y-3">
            <h3 className="text-xl font-semibold">Portfolio & réalisations</h3>
            {(profil?.portfolio ?? []).length ? (
              <div className="grid grid-cols-2 gap-3">
                {profil?.portfolio.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="relative h-36 w-full overflow-hidden rounded-xl border border-input"
                  >
                    <Image
                      src={getUrl(item)}
                      alt={`Portfolio ${index + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
