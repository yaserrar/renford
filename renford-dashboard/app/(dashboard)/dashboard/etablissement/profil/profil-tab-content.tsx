import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUrl } from "@/lib/utils";
import { ProfilEtablissement } from "@/types/profil-etablissement";
import Image from "next/image";
import ProfileRow from "./profile-row";

type ProfilTabContentProps = {
  profil: ProfilEtablissement | null;
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

export default function ProfilTabContent({ profil }: ProfilTabContentProps) {
  return (
    <div className="bg-white rounded-2xl border border-input overflow-hidden">
      <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
        {profil?.imageCouvertureChemin ? (
          <Image
            src={getUrl(profil.imageCouvertureChemin)}
            alt="Couverture établissement"
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
            src={profil?.avatarChemin ? getUrl(profil.avatarChemin) : undefined}
            alt={profil?.raisonSociale || "Avatar établissement"}
          />
          <AvatarFallback>{getInitials(profil?.raisonSociale)}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-semibold">{profil?.raisonSociale || "-"}</p>
      </div>

      <div className="p-6">
        <ProfileRow
          label="Type d’établissement"
          value={profil?.typeEtablissement?.replaceAll("_", " ") || "-"}
        />
        <ProfileRow label="Activités proposés" value="-" />
        <ProfileRow label="A propos" value={profil?.aPropos || "-"} />
      </div>
    </div>
  );
}
