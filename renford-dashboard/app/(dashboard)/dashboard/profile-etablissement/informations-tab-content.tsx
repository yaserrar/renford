import { Etablissement } from "@/types/etablissement";
import { ProfilEtablissement } from "@/types/profil-etablissement";
import ProfileRow from "./profile-row";

type InformationsTabContentProps = {
  profil: ProfilEtablissement | null;
  etablissementPrincipal?: Etablissement;
};

export default function InformationsTabContent({
  profil,
  etablissementPrincipal,
}: InformationsTabContentProps) {
  return (
    <div className="bg-white rounded-2xl border border-input p-6">
      <ProfileRow label="Raison Sociale" value={profil?.raisonSociale || "-"} />
      <ProfileRow label="Numéro Siret" value={profil?.siret || "-"} />
      <ProfileRow
        label="Adresse de l’établissement principal"
        value={profil?.adresse || "-"}
      />
      <ProfileRow
        label="Type d’établissement"
        value={profil?.typeEtablissement?.replaceAll("_", " ") || "-"}
      />
      <ProfileRow
        label="Contact principal"
        value={
          [
            etablissementPrincipal?.prenomContactPrincipal,
            etablissementPrincipal?.nomContactPrincipal,
          ]
            .filter(Boolean)
            .join(" ") || "-"
        }
      />
      <ProfileRow
        label="Téléphone"
        value={etablissementPrincipal?.telephonePrincipal || "-"}
      />
      <ProfileRow
        label="Email"
        value={etablissementPrincipal?.emailPrincipal || "-"}
      />
    </div>
  );
}
