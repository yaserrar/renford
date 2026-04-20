import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SecureAvatarImage } from "@/components/common/secure-file";
import { getInitials } from "@/lib/utils";
import { TYPE_UTILISATEUR_LABELS } from "@/validations/utilisateur";
import type { TypeUtilisateur } from "@/types/utilisateur";
import { cn } from "@/lib/utils";

interface UserMiniCardProps {
  userId: string;
  name: string;
  type: TypeUtilisateur;
  avatarPath?: string | null;
  subtitle?: string | null;
  className?: string;
}

export default function UserMiniCard({
  userId,
  name,
  type,
  avatarPath,
  subtitle,
  className,
}: UserMiniCardProps) {
  return (
    <Link
      href={`/admin/utilisateurs/${userId}`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl border bg-white px-3 py-2 transition-colors hover:bg-secondary-background hover:border-primary/30 max-w-[300px]",
        type === "etablissement" && "hover:bg-primary-background/80",
        className,
      )}
    >
      <Avatar className="h-7 w-7 shrink-0">
        <SecureAvatarImage chemin={avatarPath} alt={name} />
        <AvatarFallback
          className={cn(
            "text-xs font-medium",
            type === "etablissement"
              ? "bg-primary-background text-primary-dark"
              : "bg-secondary-background text-secondary",
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">{name}</p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground leading-tight">
            {subtitle}
          </p>
        )}
      </div>
      <Badge
        variant={type === "etablissement" ? "default" : "secondary"}
        className="shrink-0 text-xs px-1.5 py-0"
      >
        {TYPE_UTILISATEUR_LABELS[type]}
      </Badge>
    </Link>
  );
}
