import { formatDate } from "@/lib/date";
import { cn, getUrl } from "@/lib/utils";
import { MissionWithAnnonceBaristaAnnonceur } from "@/types/mission";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEnumLabel } from "@/validations/enums";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Props = {
  mission: MissionWithAnnonceBaristaAnnonceur;
};

const MissionCardAnnonceur = ({ mission }: Props) => {
  const titre = mission.annonce.titrePoste || "Annonce";
  return (
    <Link href={`/admin/missions/${mission.id}`}>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border bg-white p-3"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar>
              <AvatarFallback>
                {mission.profilAnnonceur?.nomComplet?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={getUrl(mission.profilAnnonceur?.logoChemin)}
                alt={mission.profilAnnonceur?.nomComplet}
                width={80}
                height={80}
                className="object-cover"
              />
            </Avatar>
            <Avatar>
              <AvatarFallback>
                {mission.profilBarista?.nom?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={getUrl(mission.profilBarista?.photoChemin)}
                alt={mission.profilBarista?.nom}
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
                  mission.statut === "en_cours" &&
                    "bg-primary-background border border-primary-light text-primary",
                  mission.statut === "terminee" &&
                    "bg-green-50 border border-green-400 text-green-600",
                  mission.statut === "cloturee" &&
                    "bg-gray-50 border border-gray-400 text-gray-600",
                  mission.statut === "annulee" &&
                    "bg-red-50 border border-red-400 text-red-600"
                )}
              >
                {getEnumLabel(mission.statut)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {getEnumLabel(mission.annonce.typeContrat)}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatDate(mission.createdAt)}
        </span>
      </div>
    </Link>
  );
};

export default MissionCardAnnonceur;
