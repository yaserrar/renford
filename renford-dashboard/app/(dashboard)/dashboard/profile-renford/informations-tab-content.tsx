import { CurrentUser } from "@/types/utilisateur";
import ProfileRow from "./profile-row";

type InformationsTabContentProps = {
  me: CurrentUser | undefined;
};

const formatDate = (value: Date | string | null | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("fr-FR");
};

export default function InformationsTabContent({
  me,
}: InformationsTabContentProps) {
  const profil = me?.profilRenford;

  return (
    <div className="bg-white rounded-2xl border border-input p-6">
      <ProfileRow
        label="Identité"
        value={[me?.prenom, me?.nom].filter(Boolean).join(" ") || "-"}
      />
      <ProfileRow label="Email" value={me?.email || "-"} />
      <ProfileRow
        label="Numéro de téléphone"
        value={me?.telephone || profil?.telephone || "-"}
      />
      <ProfileRow label="Numéro SIRET" value={profil?.siret || "-"} />
      <ProfileRow
        label="Date de naissance"
        value={formatDate(profil?.dateNaissance)}
      />
      <ProfileRow label="Adresse" value={profil?.adresse || "-"} />
      <ProfileRow label="Code postal" value={profil?.codePostal || "-"} />
      <ProfileRow label="Ville" value={profil?.ville || "-"} />
      <ProfileRow
        label="Attestation de conformité"
        value={
          profil?.attestationVigilanceChemin
            ? "Document ajouté"
            : "Aucun document"
        }
      />
    </div>
  );
}
