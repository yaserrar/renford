"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminUserDetail } from "@/types/admin";
import { useToggleDiplomeVerification } from "@/hooks/admin";
import { DIPLOME_LABELS } from "@/validations/profil-renford";
import { SecureLink } from "@/components/common/secure-file";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";

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
                <InfoRow
                  label="Stripe Connect"
                  value={
                    profil.stripeConnectOnboardingComplete
                      ? "Configuré"
                      : "Non configuré"
                  }
                />
                <div>
                  <p className="text-gray-500">Attestation de vigilance</p>
                  {profil.attestationVigilanceChemin ? (
                    <Button variant="outline" size="sm" className="mt-1" asChild>
                      <SecureLink chemin={profil.attestationVigilanceChemin}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Voir le document
                      </SecureLink>
                    </Button>
                  ) : (
                    <p className="font-medium text-destructive">Non fournie</p>
                  )}
                </div>
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
                <DiplomeCard
                  key={diplome.id}
                  diplome={diplome}
                  userId={user.id}
                />
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
                    <p className="font-medium">{exp.nom}</p>
                    {exp.etablissement && (
                      <p className="text-muted-foreground">
                        {exp.etablissement}
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

function DiplomeCard({
  diplome,
  userId,
}: {
  diplome: NonNullable<
    AdminUserDetail["profilRenford"]
  >["renfordDiplomes"][number];
  userId: string;
}) {
  const mutation = useToggleDiplomeVerification();
  const label =
    DIPLOME_LABELS[diplome.typeDiplome as keyof typeof DIPLOME_LABELS] ??
    diplome.typeDiplome.replaceAll("_", " ");

  return (
    <div className="rounded-lg border p-4 text-sm bg-white space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium truncate">{label}</p>
          <Badge
            variant={diplome.verifie ? "default" : "secondary"}
            className="shrink-0"
          >
            {diplome.verifie ? "Vérifié" : "Non vérifié"}
          </Badge>
        </div>
        {diplome.etablissementFormation && (
          <p className="text-muted-foreground">
            {diplome.etablissementFormation}
          </p>
        )}
        {diplome.anneeObtention && (
          <p className="text-muted-foreground">
            Obtenu en {diplome.anneeObtention}
          </p>
        )}
        {diplome.mention && (
          <p className="text-muted-foreground">Mention : {diplome.mention}</p>
        )}
        {diplome.dateVerification && (
          <p className="text-xs text-muted-foreground">
            Vérifié le{" "}
            {new Date(diplome.dateVerification).toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {diplome.justificatifDiplomeChemin && (
          <Button variant="outline" size="sm" asChild>
            <SecureLink chemin={diplome.justificatifDiplomeChemin}>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Justificatif
            </SecureLink>
          </Button>
        )}
        <Button
          variant={diplome.verifie ? "outline" : "default"}
          size="sm"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({
              diplomeId: diplome.id,
              verifie: !diplome.verifie,
              userId,
            })
          }
        >
          {mutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
          ) : diplome.verifie ? (
            <XCircle className="h-3.5 w-3.5 mr-1" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
          )}
          {diplome.verifie ? "Retirer vérification" : "Vérifier"}
        </Button>
      </div>
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
