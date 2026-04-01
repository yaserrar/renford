import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { cn, getUrl } from "@/lib/utils";
import { CandidatureWithBaristaAnnonceAnnonceur } from "@/types/candidature";
import { getEnumLabel } from "@/validations/enums";
import Link from "next/link";

type Props = {
  candidature: CandidatureWithBaristaAnnonceAnnonceur;
};

const CandidatureCard = ({ candidature }: Props) => {
  const titre = candidature.annonce?.titrePoste || "Annonce";
  return (
    <Link href={`/admin/candidatures/${candidature.id}`}>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border bg-white p-3"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar>
              <AvatarFallback>
                {candidature.annonce.profilAnnonceur?.nomComplet
                  ?.charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={getUrl(candidature.annonce.profilAnnonceur?.logoChemin)}
                alt={candidature.annonce.profilAnnonceur?.nomComplet}
                width={80}
                height={80}
                className="object-cover"
              />
            </Avatar>
            <Avatar>
              <AvatarFallback>
                {candidature.profilBarista?.nom?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={getUrl(candidature.profilBarista?.photoChemin)}
                alt={candidature.profilBarista?.nom}
                width={80}
                height={80}
                className="object-cover"
              />
            </Avatar>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium leading-none text-primary">{titre}</p>
              <Badge
                variant="outline"
                className={cn(
                  candidature.statut === "en_attente" &&
                    "bg-primary/5 border border-primary-light text-primary",
                  candidature.statut === "acceptee" &&
                    "bg-green-50 border border-green-400 text-green-600",
                  candidature.statut === "refusee" &&
                    "bg-red-50 border border-red-400 text-red-600"
                )}
              >
                {getEnumLabel(candidature.statut)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {getEnumLabel(candidature.disponibiliteType)}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 whitespace-nowrap">
          {formatDate(candidature.createdAt)}
        </p>
      </div>
    </Link>
  );
};

export default CandidatureCard;
