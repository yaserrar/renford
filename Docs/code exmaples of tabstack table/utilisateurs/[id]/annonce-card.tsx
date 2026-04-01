import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { cn, getUrl } from "@/lib/utils";
import { Annonce } from "@/types/annonce";
import { ProfilAnnonceur } from "@/types/profil-annonceur";
import { getEnumLabel } from "@/validations/enums";
import Link from "next/link";

type Props = {
  annonce: Annonce;
  profilAnnonceur?: ProfilAnnonceur;
};

const AnnonceCard = ({ annonce, profilAnnonceur }: Props) => {
  const titre = annonce.titrePoste || "Annonce";
  const entreprise = profilAnnonceur?.nomEntreprise || "Annonceur";
  return (
    <Link href={`/admin/annonces/${annonce?.id}`}>
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border bg-white p-3"
        )}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {entreprise?.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarImage
              src={getUrl(profilAnnonceur?.logoChemin)}
              alt={entreprise}
              width={80}
              height={80}
              className="object-cover"
            />
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium leading-none text-primary">{titre}</p>
              <Badge
                variant="outline"
                className={cn(
                  annonce.statut === "en_attente_paiement" &&
                    "bg-amber-50 border border-amber-400 text-amber-600",
                  annonce.statut === "publiee" &&
                    "bg-primary/5 border border-primary-light text-primary",
                  annonce.statut === "terminee" &&
                    "bg-green-50 border border-green-400 text-green-600",
                  annonce.statut === "archivee" &&
                    "bg-red-50 border border-red-400 text-red-600"
                )}
              >
                {getEnumLabel(annonce.statut)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {getEnumLabel(annonce.typeContrat)}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {formatDate(annonce.createdAt)}
        </span>
      </div>
    </Link>
  );
};

export default AnnonceCard;
