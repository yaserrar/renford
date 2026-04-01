"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDeleteUtilisateur } from "@/hooks/utilisateurs";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userType: "barista" | "annonceur";
  userName?: string;
};

export default function DeleteUtilisateurDialog({
  open,
  onOpenChange,
  userId,
  userType,
  userName,
}: Props) {
  const [confirm, setConfirm] = useState("");
  const mutation = useDeleteUtilisateur(userId);
  const router = useRouter();
  const required = "Supprimer tous";
  const disabled = confirm.trim() !== required || mutation.isPending;

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        setConfirm("");
        router.push("/admin/utilisateurs");
      },
    });
  };

  const getAnonymizedItems = () => {
    if (userType === "annonceur") {
      return [
        "Toutes les informations personnelles du profil",
        "Logo, nom complet, entreprise",
        "Adresse, téléphone, ville",
        "SIRET, SIREN, TVA et documents légaux",
        "Description et préférences d'établissement",
      ];
    } else {
      return [
        "Toutes les informations personnelles du profil",
        "Photo, nom, prénom",
        "Adresse, téléphone, ville",
        "Compétences et expériences",
        "CVs et photos de latte art",
        "Documents d'identité et statut légal",
        "Motivation des candidatures",
      ];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-red-600">
            Supprimer l&apos;utilisateur
          </DialogTitle>
          <DialogDescription className="text-base">
            Cette action va <span className="font-medium">supprimer</span>{" "}
            toutes les données personnelles.
            {userName && (
              <span className="block mt-1">
                Utilisateur:{" "}
                <span className="font-medium text-red-600">{userName}</span>
              </span>
            )}
            <br />
            Les informations suivantes seront anonymisées:
            <div className="mt-2 text-red-600 space-y-1 flex flex-col">
              {getAnonymizedItems().map((item, index) => (
                <span key={index} className="list-disc">
                  • {item}
                </span>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="delete-confirm" className="text-sm">
            Pour confirmer, tapez exactement:{" "}
            <p className="font-medium text-red-500">{required}</p>
          </Label>
          <Input
            id="delete-confirm"
            placeholder={required}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={disabled}
          >
            {mutation.isPending ? "Anonymisation..." : "Anonymiser"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
