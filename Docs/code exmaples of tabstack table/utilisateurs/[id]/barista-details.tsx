"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CandidatureCard from "./candidature-card";
import EvaluationCard from "@/components/common/evaluation-card";
import MissionCard from "./mission-card";
import { formatDate } from "@/lib/date";
import { cn, getUrl } from "@/lib/utils";
import { UserDetail } from "@/types/user";
import { getEnumLabel } from "@/validations/enums";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UpdateStatutDialog from "./update-statut-dialog";
import DeleteUtilisateurDialog from "./delete-utilisateur-dialog";
import { ValuesList } from "./annonceur-details";
import Image from "next/image";
import { Field } from "@/components/common/field";

type Props = { user: UserDetail };

export default function BaristaDetail({ user }: Props) {
  const [showStatutDialog, setShowStatutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleToggleStatut = () => setShowStatutDialog(true);
  const handleDelete = () => setShowDeleteDialog(true);

  const userName = user.profilBarista
    ? `${user.profilBarista.prenom || ""} ${
        user.profilBarista.nom || ""
      }`.trim() || user.email
    : user.email;

  if (!user.profilBarista) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <p>Profil Barista non disponible.</p>
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
        userType="barista"
        userName={userName}
      />

      {/* Identity card */}
      <Card className="w-fit">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {user.profilBarista.prenom?.charAt(0).toUpperCase() ||
                  user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={getUrl(user.profilBarista.photoChemin)}
                alt={userName}
                width={80}
                height={80}
                className="object-cover"
              />
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium text-primary text-lg leading-tight">
                {userName}
              </p>
              <Badge className="mt-1 bg-primary-light text-primary">
                <Image
                  src="/svg/Barista.svg"
                  alt="barista"
                  width={13}
                  height={13}
                />
                Barista
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Composite card: Identité / Localisation & Contact / Compétences principales */}
      <div className="flex flex-col gap-6 xl:flex-row mt-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div>
                <h3 className="mb-4 font-medium text-primary-dark text-lg">
                  Identité
                </h3>
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <Field label="Prénom" value={user.profilBarista.prenom} />
                  <Field label="Nom" value={user.profilBarista.nom} />
                  <Field
                    label="Langues"
                    value={user.profilBarista.langues?.join(", ")}
                  />
                  {user.profilBarista.languesAutres && (
                    <Field
                      label="Langues (autres)"
                      value={user.profilBarista.languesAutres}
                    />
                  )}
                  <Field
                    label="Statut légal"
                    value={getEnumLabel(user.profilBarista.statutLegal)}
                  />

                  <div>
                    <p className="text-gray-500">
                      Justificatif légal (KBIS, etc.)
                    </p>
                    {user.profilBarista.statutJustificatifChemin ? (
                      <Link
                        href={getUrl(
                          user.profilBarista?.statutJustificatifChemin || ""
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge variant="outline" className="bg-white">
                          {user.profilBarista.statutJustificatifChemin
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
              </div>
              <div>
                <h3 className="mb-4 font-medium text-primary-dark text-lg">
                  Localisation & Contact
                </h3>
                <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                  <Field label="Ville" value={user.profilBarista.ville} />
                  <Field label="Adresse" value={user.profilBarista.adresse} />
                  <Field
                    label="Téléphone"
                    value={user.profilBarista.telephone}
                  />
                  <Field label="Email" value={user.email} />
                </div>
              </div>
              <div>
                <h3 className="mb-4 font-medium text-primary-dark text-lg">
                  Note moyenne
                </h3>
                <div className="rounded-lg border p-4 bg-white flex flex-col gap-2">
                  {user.profilBarista.baristaNote ? (
                    <EvaluationCard note={user.profilBarista.baristaNote} />
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
      </div>

      {/* Merged detailed competencies & equipment & note */}
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div>
              <h3 className="mb-4 font-medium text-primary-dark text-lg">
                Compétences principales
              </h3>
              <div className="space-y-3 rounded-lg border p-4 text-sm bg-white">
                <ValuesList
                  label="Espresso"
                  items={user.profilBarista.espressoRecette}
                />
                <ValuesList
                  label="Méthodes douces"
                  items={user.profilBarista.methodesDouceTypes}
                />
                <ValuesList
                  label="Latte Art"
                  items={user.profilBarista.latteArtStyles}
                />

                <div>
                  {user.profilBarista.latteArtPhotosChemin?.length &&
                  user.profilBarista.latteArtPhotosChemin?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.profilBarista.latteArtPhotosChemin.map((photo) => (
                        <Image
                          key={photo}
                          className="h-20 w-20 rounded-2xl"
                          src={getUrl(photo)}
                          alt="Latte Art"
                          width={100}
                          height={100}
                        />
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <ValuesList
                  label="Soft Skills"
                  items={user.profilBarista.softSkills}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-medium text-primary-dark text-lg">
                Compétences détaillées
              </h3>
              <div className="space-y-4 rounded-lg border p-4 text-sm bg-white">
                <ValuesList
                  label="Entretien"
                  items={user.profilBarista.entretien}
                />
                <ValuesList
                  label="Expérience Sup"
                  items={user.profilBarista.experienceSup}
                />
                <ValuesList
                  label="Méthodes (Recette)"
                  items={user.profilBarista.methodesDouceRecette}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-medium text-primary-dark text-lg">
                Équipements
              </h3>
              <div className="space-y-4 rounded-lg border p-4 text-sm bg-white">
                <ValuesList
                  label="Machines"
                  items={user.profilBarista.machines}
                />
                {user.profilBarista.machinesAutres && (
                  <div>
                    <p className="text-gray-500">Machines (autres)</p>
                    <p className="text-gray-700">
                      {user.profilBarista.machinesAutres}
                    </p>
                  </div>
                )}
                <ValuesList
                  label="Moulins"
                  items={user.profilBarista.moulins}
                />
                {user.profilBarista.moulinsAutres && (
                  <div>
                    <p className="text-gray-500">Moulins (autres)</p>
                    <p className="text-gray-700">
                      {user.profilBarista.moulinsAutres}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience & CV card */}
      <Card className="mt-4">
        <CardContent className="p-6">
          <h3 className="mb-4 font-medium text-primary-dark text-lg">
            Expériences professionnelles
          </h3>
          <div className="space-y-4">
            {user.profilBarista.experiences &&
            user.profilBarista.experiences.length > 0 ? (
              user.profilBarista.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-lg border p-4 text-sm bg-white"
                >
                  <div className="flex items-center gap-1 mb-1">
                    <BriefcaseBusiness
                      className="mt-1 text-primary"
                      size={18}
                    />
                    <p className="font-medium text-primary">
                      {exp.etablissement}
                    </p>
                  </div>
                  <p className="text-gray-600">{exp.poste}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(exp.dateDebut)}
                    {exp.dateFin ? ` - ${formatDate(exp.dateFin)}` : ""}
                  </p>
                  {exp.description && (
                    <p className="text-xs mt-2 text-gray-700">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-gray-500">
                Aucune expérience
              </p>
            )}
          </div>
          {user.profilBarista.formations && (
            <div className="mt-6">
              <h4 className="mb-2 font-medium text-primary">Formations</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {user.profilBarista.formations}
              </p>
            </div>
          )}
          {user.profilBarista.cvChemins &&
            user.profilBarista.cvChemins.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2 font-medium text-primary">CVs</h4>
                <div className="flex flex-wrap gap-2">
                  {user.profilBarista.cvChemins.map((cv, i) => (
                    <Link
                      href={getUrl(cv)}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={cv + i}
                    >
                      <Badge variant="outline" className="bg-white">
                        {cv.split("/").pop()}
                        <ExternalLink size={14} />
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Lower cards: Candidatures & Missions */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-primary-dark text-lg">
                Candidatures
              </h3>
              <Badge variant="outline">
                {user.profilBarista.candidatures?.length || 0}
              </Badge>
            </div>
            {user.profilBarista.candidatures &&
            user.profilBarista.candidatures.length > 0 ? (
              <div className="flex flex-col gap-3">
                {user.profilBarista.candidatures.map((c) => (
                  <CandidatureCard key={c.id} candidature={c} />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">
                Aucune candidature
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
                {user.profilBarista.missionsAttribuees?.length || 0}
              </Badge>
            </div>
            {user.profilBarista.missionsAttribuees &&
            user.profilBarista.missionsAttribuees.length > 0 ? (
              <div className="flex flex-col gap-3">
                {user.profilBarista.missionsAttribuees.map((m) => (
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
