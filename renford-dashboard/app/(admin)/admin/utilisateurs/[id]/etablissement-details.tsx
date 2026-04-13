"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminUserDetail } from "@/types/admin";

type Props = {
  user: AdminUserDetail;
};

export default function EtablissementDetails({ user }: Props) {
  const profil = user.profilEtablissement;

  if (!profil) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Profil établissement non disponible.
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
                <InfoRow label="Raison sociale" value={profil.raisonSociale} />
                <InfoRow
                  label="Forme juridique"
                  value={profil.formeJuridique}
                />
                <InfoRow label="SIRET" value={profil.siret} />
                <InfoRow
                  label="SIRET en cours"
                  value={profil.siretEnCoursObtention ? "Oui" : "Non"}
                />
              </div>
            </div>

            {/* Adresses */}
            <div>
              <h3 className="mb-4 font-medium text-lg">Adresses</h3>
              <div className="space-y-4">
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Adresse de l&apos;établissement
                  </p>
                  <InfoRow label="Adresse" value={profil.adresse} />
                  <InfoRow label="Code postal" value={profil.codePostal} />
                  <InfoRow label="Ville" value={profil.ville} />
                </div>
                {profil.adresseSiegeDifferente && profil.adresseSiege && (
                  <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Siège social
                    </p>
                    <InfoRow label="Adresse" value={profil.adresseSiege} />
                    <InfoRow
                      label="Code postal"
                      value={profil.codePostalSiege}
                    />
                    <InfoRow label="Ville" value={profil.villeSiege} />
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 font-medium text-lg">Contact</h3>
              <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                <InfoRow label="Nom" value={`${user.prenom} ${user.nom}`} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Téléphone" value={user.telephone} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Établissements (sites) */}
      {profil.etablissements && profil.etablissements.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-medium text-lg">
              Sites ({profil.etablissements.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {profil.etablissements.map((etab) => (
                <div
                  key={etab.id}
                  className="rounded-lg border p-4 text-sm bg-white space-y-1"
                >
                  <p className="font-medium">{etab.nom}</p>
                  <p className="text-muted-foreground">
                    {etab.adresse}, {etab.codePostal} {etab.ville}
                  </p>
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
