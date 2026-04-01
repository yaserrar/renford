"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminUserDetail } from "@/hooks/admin";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import EtablissementDetails from "./etablissement-details";
import RenfordDetails from "./renford-details";
import ToggleStatusDialog from "./toggle-status-dialog";
import {
  TYPE_UTILISATEUR_LABELS,
  STATUT_COMPTE_LABELS,
} from "@/validations/utilisateur";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useAdminUserDetail(id);
  const [toggleOpen, setToggleOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Utilisateur introuvable.
      </div>
    );
  }

  const statusVariant =
    user.statut === "actif"
      ? "default"
      : user.statut === "suspendu"
        ? "destructive"
        : "secondary";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/utilisateurs">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {user.prenom} {user.nom}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">
                {TYPE_UTILISATEUR_LABELS[user.typeUtilisateur]}
              </Badge>
              <Badge variant={statusVariant}>
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

      {/* Informations générales */}
      <div className="rounded-lg border bg-muted/40 p-4 text-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email vérifié</p>
            <p className="font-medium">{user.emailVerifie ? "Oui" : "Non"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Étape onboarding</p>
            <p className="font-medium">{user.etapeOnboarding}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date d&apos;inscription</p>
            <p className="font-medium">
              {new Date(user.dateCreation).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
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
        userName={`${user.prenom} ${user.nom}`}
      />
    </div>
  );
}
