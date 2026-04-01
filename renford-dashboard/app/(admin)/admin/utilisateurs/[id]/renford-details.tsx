"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminUserDetail } from "@/types/admin";

type Props = {
  user: AdminUserDetail;
};

export default function RenfordDetails({ user }: Props) {
  const profil = user.profilRenford;

  if (!profil) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Profil renford non disponible.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Identité */}
            <div>
              <h3 className="mb-4 font-medium text-lg">Identité</h3>
              <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                <InfoRow label="Nom" value={`${user.prenom} ${user.nom}`} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Téléphone" value={user.telephone} />
                <InfoRow
                  label="Date de naissance"
                  value={profil.dateNaissance}
                />
                <InfoRow label="Titre du profil" value={profil.titreProfil} />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h3 className="mb-4 font-medium text-lg">Adresse</h3>
              <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                <InfoRow label="Adresse" value={profil.adresse} />
                <InfoRow label="Code postal" value={profil.codePostal} />
                <InfoRow label="Ville" value={profil.ville} />
              </div>
            </div>

            {/* Administratif */}
            <div>
              <h3 className="mb-4 font-medium text-lg">Administratif</h3>
              <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                <InfoRow label="SIRET" value={profil.siret} />
                <InfoRow
                  label="SIRET en cours"
                  value={profil.siretEnCoursObtention ? "Oui" : "Non"}
                />
                <InfoRow label="IBAN" value={profil.iban} />
                <InfoRow label="BIC" value={profil.bic} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diplômes */}
      {profil.renfordDiplomes && profil.renfordDiplomes.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-medium text-lg">
              Diplômes ({profil.renfordDiplomes.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {profil.renfordDiplomes.map((diplome) => (
                <div
                  key={diplome.id}
                  className="rounded-lg border p-4 text-sm bg-white space-y-1"
                >
                  <p className="font-medium">{diplome.intitule}</p>
                  {diplome.organisme && (
                    <p className="text-muted-foreground">{diplome.organisme}</p>
                  )}
                  {diplome.anneeObtention && (
                    <p className="text-muted-foreground">
                      {diplome.anneeObtention}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expériences */}
      {profil.experiencesProfessionnelles &&
        profil.experiencesProfessionnelles.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-lg">
                Expériences ({profil.experiencesProfessionnelles.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {profil.experiencesProfessionnelles.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-lg border p-4 text-sm bg-white space-y-1"
                  >
                    <p className="font-medium">{exp.intitulePoste}</p>
                    {exp.nomEntreprise && (
                      <p className="text-muted-foreground">
                        {exp.nomEntreprise}
                      </p>
                    )}
                    {(exp.dateDebut || exp.dateFin) && (
                      <p className="text-muted-foreground">
                        {exp.dateDebut || "?"} — {exp.dateFin || "En cours"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}
