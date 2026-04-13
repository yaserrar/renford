"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminUserDetail } from "@/hooks/admin";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import CenterState from "@/components/common/center-state";
import EtablissementDetails from "./etablissement-details";
import RenfordDetails from "./renford-details";
import ToggleStatusDialog from "./toggle-status-dialog";
import {
  TYPE_UTILISATEUR_LABELS,
  STATUT_COMPTE_LABELS,
} from "@/validations/utilisateur";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUrl, getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import {
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Footprints,
} from "lucide-react";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useAdminUserDetail(id);
  const [toggleOpen, setToggleOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <CenterState
          title="Chargement"
          description="Récupération des détails de l'utilisateur..."
          isLoading
          className="min-h-[400px]"
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <CenterState
          title="Utilisateur introuvable"
          description="Cet utilisateur n'existe pas ou a été supprimé."
          className="min-h-[400px]"
        />
      </main>
    );
  }

  const fullName = `${user.prenom} ${user.nom}`.trim();
  const avatarPath =
    user.typeUtilisateur === "etablissement"
      ? user.profilEtablissement?.avatarChemin
      : user.profilRenford?.avatarChemin;

  const statusColor =
    user.statut === "actif"
      ? "bg-green-50 text-green-700 border-green-200"
      : user.statut === "suspendu"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/utilisateurs">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar className="h-14 w-14">
              <AvatarImage src={getUrl(avatarPath)} />
              <AvatarFallback
                className={cn(
                  "text-sm font-medium",
                  user.typeUtilisateur === "etablissement"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700",
                )}
              >
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-3 py-0.5",
                    user.typeUtilisateur === "etablissement"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-purple-50 text-purple-700 border-purple-200",
                  )}
                >
                  {TYPE_UTILISATEUR_LABELS[user.typeUtilisateur]}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("px-3 py-0.5", statusColor)}
                >
                  {STATUT_COMPTE_LABELS[user.statut]}
                </Badge>
              </div>
            </div>
          </div>

          {(user.statut === "actif" || user.statut === "suspendu") && (
            <Button
              variant={user.statut === "actif" ? "destructive" : "default"}
              onClick={() => setToggleOpen(true)}
            >
              {user.statut === "actif" ? "Suspendre" : "Activer"}
            </Button>
          )}
        </div>

        {/* Quick info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickInfo icon={Mail} label="Email" value={user.email} />
          <QuickInfo
            icon={Phone}
            label="Téléphone"
            value={user.telephone || "-"}
          />
          <QuickInfo
            icon={user.emailVerifie ? CheckCircle2 : XCircle}
            label="Email vérifié"
            value={user.emailVerifie ? "Oui" : "Non"}
            iconClass={user.emailVerifie ? "text-green-500" : "text-red-400"}
          />
          <QuickInfo
            icon={Footprints}
            label="Étape onboarding"
            value={`${user.etapeOnboarding}`}
          />
          <QuickInfo
            icon={Calendar}
            label="Inscrit le"
            value={formatDate(user.dateCreation)}
          />
        </div>

        {/* Detail per type */}
        {user.typeUtilisateur === "etablissement" && (
          <EtablissementDetails user={user} />
        )}
        {user.typeUtilisateur === "renford" && <RenfordDetails user={user} />}

        {/* Toggle status dialog */}
        <ToggleStatusDialog
          open={toggleOpen}
          onOpenChange={setToggleOpen}
          userId={user.id}
          currentStatut={user.statut}
          userName={fullName}
        />
      </div>
    </main>
  );
}

function QuickInfo({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  iconClass?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-3 space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5 text-muted-foreground", iconClass)} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}
