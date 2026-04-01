"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUrl } from "@/lib/utils";
import { UserDetail } from "@/types/user";
import { getEnumLabel } from "@/validations/enums";
import { ArrowLeft, ExternalLink, Megaphone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AnnonceCard from "./annonce-card";
import MissionCard from "./mission-card";
import UpdateStatutDialog from "./update-statut-dialog";
import DeleteUtilisateurDialog from "./delete-utilisateur-dialog";
import EvaluationCard from "@/components/common/evaluation-card";

type Porps = {
  user: UserDetail;
};

export default function AnnonceurDetail({ user }: Porps) {
  const [showStatutDialog, setShowStatutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleToggleStatut = () => setShowStatutDialog(true);
  const handleDelete = () => setShowDeleteDialog(true);

  const userName =
    user.profilAnnonceur?.nomComplet ||
    user.profilAnnonceur?.nomEntreprise ||
    user.email;

  if (!user.profilAnnonceur) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <p>Profil Annonceur non disponible.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/utilisateurs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="text-primary" />
            </Button>
          </Link>
          <h1 className="text-2xl font-medium text-primary">
            Détail Utilisateur
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={user.statut === "actif" ? "outline" : "default"}
            onClick={handleToggleStatut}
            disabled={user.supprimee}
          >
            {user.statut === "actif" ? "Désactiver" : "Activer"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={user.supprimee}
          >
            <Trash2 size={16} />
            Supprimer
          </Button>
        </div>
      </div>

      <UpdateStatutDialog
        open={showStatutDialog}
        onOpenChange={setShowStatutDialog}
        userId={user.id}
        currentStatut={user.statut}
        userName={userName}
      />

      <DeleteUtilisateurDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        userId={user.id}
        userType="annonceur"
        userName={userName}
      />

      {/* Top layout: left small card with logo/name + right big 3-section card */}

      <Card className="w-fit">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {user.profilAnnonceur?.nomEntreprise?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={getUrl(user.profilAnnonceur?.logoChemin)}
                alt={user.profilAnnonceur?.nomEntreprise || userName}
                width={80}
                height={80}
                className="object-cover"
              />
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium text-primary text-lg leading-tight">
                {user.profilAnnonceur?.nomEntreprise || userName}
              </p>
              <Badge className="mt-1 text-primary bg-primary-light">
                <Megaphone className="text-primary" size={17} />
                Annonceur
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-6 xl:flex-row mt-4">
        {/* Small identity card */}

        {/* Composite card */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* Section 1: Identité */}
              <div>
                <h3 className="mb-4 font-medium text-primary-dark text-lg">
                  Identité
                </h3>
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <div>
                    <p className="text-gray-500">Nom complet</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.nomComplet || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nom de l'établissement</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.nomEntreprise || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type d'activité</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.secteurActivite
                        ? getEnumLabel(user.profilAnnonceur.secteurActivite)
                        : "-"}
                      {user.profilAnnonceur?.secteurActivite === "autre" &&
                        user.profilAnnonceur?.secteurActiviteAutre &&
                        ` (${user.profilAnnonceur.secteurActiviteAutre})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type d'établissement</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.typeEtablissement
                        ? getEnumLabel(user.profilAnnonceur.typeEtablissement)
                        : "-"}
                      {user.profilAnnonceur?.typeEtablissement === "autre" &&
                        user.profilAnnonceur?.typeEtablissementAutre &&
                        ` (${user.profilAnnonceur.typeEtablissementAutre})`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Localisation & Contact */}
              <div>
                <h3 className="mb-4 font-medium text-primary-dark text-lg">
                  Localisation & Contact
                </h3>
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <div>
                    <p className="text-gray-500">Ville</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.ville || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Adresse</p>
                    <p className="font-medium break-words">
                      {user.profilAnnonceur?.adresse || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Téléphone</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.telephone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{user.email || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Description */}
              <div>
                <h3 className="mb-4 font-medium text-primary-dark text-lg">
                  Informations légales & facturation
                </h3>
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <div>
                    <p className="text-gray-500">SIRET</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.siret || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">SIREN</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.siren || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">TVA</p>
                    <p className="font-medium">
                      {user.profilAnnonceur?.tva || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Justificatif légal (KBIS, etc.)
                    </p>
                    {user.profilAnnonceur.justificatifLegalChemin ? (
                      <Link
                        href={getUrl(
                          user.profilAnnonceur?.justificatifLegalChemin || ""
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge variant="outline" className="bg-white">
                          {user.profilAnnonceur.justificatifLegalChemin
                            .split("/")
                            .pop()}
                          <ExternalLink size={14} />
                        </Badge>
                      </Link>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <h3 className="my-4 font-medium text-primary-dark text-lg">
                  À propos
                </h3>
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <div>
                    <p className="text-gray-500">Description</p>
                    <p className="font-medium text-gray-700">
                      {user.profilAnnonceur?.description ||
                        "Aucune description"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merged Section: Profil Business + Équipements & Méthodes */}
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div>
              <h3 className="mb-4 font-medium text-primary-dark text-lg">
                Profil Business
              </h3>
              <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                <div>
                  <p className="text-gray-500">Nombre de tables</p>
                  <p className="font-medium">
                    {user.profilAnnonceur?.nombreTable ?? "-"}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <BusinessFlag
                    label="Offre Pâtisserie"
                    value={user.profilAnnonceur?.offrePatisserie}
                  />
                  <BusinessFlag
                    label="Offre Salé"
                    value={user.profilAnnonceur?.offreSale}
                  />
                  <BusinessFlag
                    label="Petit Déjeuner"
                    value={user.profilAnnonceur?.offrePetitDejeuner}
                  />
                  <BusinessFlag
                    label="Ordinateurs Autorisés"
                    value={user.profilAnnonceur?.ordinateursAutorises}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-medium text-primary-dark text-lg">
                Équipements & Méthodes
              </h3>
              <div className="space-y-4 rounded-lg border p-4 text-sm bg-white">
                <ValuesList
                  label="Méthodes douces"
                  items={user.profilAnnonceur?.methodesDouces}
                />
                <div>
                  <ValuesList
                    label="Machines"
                    items={user.profilAnnonceur?.machines}
                  />
                  {user.profilAnnonceur?.machinesAutres && (
                    <p className="text-xs text-gray-500 mt-1">
                      Autre: {user.profilAnnonceur.machinesAutres}
                    </p>
                  )}
                </div>
                <div>
                  <ValuesList
                    label="Moulins"
                    items={user.profilAnnonceur?.moulins}
                  />
                  {user.profilAnnonceur?.moulinsAutres && (
                    <p className="text-xs text-gray-500 mt-1">
                      Autre: {user.profilAnnonceur.moulinsAutres}
                    </p>
                  )}
                </div>
                <div>
                  <ValuesList
                    label="Filtres"
                    items={user.profilAnnonceur?.filtres}
                  />
                  {user.profilAnnonceur?.filtresAutres && (
                    <p className="text-xs text-gray-500 mt-1">
                      Autre: {user.profilAnnonceur.filtresAutres}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-medium text-primary-dark text-lg">
                Note moyenne
              </h3>
              <div className="rounded-lg border p-4 bg-white flex flex-col gap-2">
                {user.profilAnnonceur?.annonceurNote ? (
                  <EvaluationCard note={user.profilAnnonceur.annonceurNote} />
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucune note disponible
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lower cards: Annonces & Missions */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-primary-dark text-lg">
                Annonces
              </h3>
              <Badge variant="outline">
                {user.profilAnnonceur?.annonces?.length || 0}
              </Badge>
            </div>
            {user.profilAnnonceur?.annonces &&
            user.profilAnnonceur.annonces.length > 0 ? (
              <div className="flex flex-col gap-3">
                {user.profilAnnonceur.annonces.map(
                  (a) =>
                    user.profilAnnonceur && (
                      <AnnonceCard
                        key={a.id}
                        annonce={a}
                        profilAnnonceur={user.profilAnnonceur}
                      />
                    )
                )}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">
                Aucune annonce
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-primary-dark text-lg">
                Missions
              </h3>
              <Badge variant="outline">
                {user.profilAnnonceur?.missionsAttribuees?.length || 0}
              </Badge>
            </div>
            {user.profilAnnonceur?.missionsAttribuees &&
            user.profilAnnonceur.missionsAttribuees.length > 0 ? (
              <div className="flex flex-col gap-3">
                {user.profilAnnonceur.missionsAttribuees.map((m) => (
                  <MissionCard key={m.id} mission={m} />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">
                Aucune mission
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper components (local to file)
function BusinessFlag({ label, value }: { label: string; value?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2 bg-white">
      <span className="text-xs text-gray-500">{label}</span>
      <Badge
        variant={value ? "default" : "outline"}
        className={value ? "bg-primary text-white" : ""}
      >
        {value ? "Oui" : "Non"}
      </Badge>
    </div>
  );
}

export function ValuesList({
  label,
  items,
}: {
  label: string;
  items?: string[];
}) {
  return (
    <div>
      <p className="mb-1 text-gray-500">{label}</p>
      {items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <Badge key={it} className="bg-primary-light text-primary">
              {getEnumLabel(it)}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Aucun</p>
      )}
    </div>
  );
}
