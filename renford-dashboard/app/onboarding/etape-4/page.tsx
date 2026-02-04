"use client";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useSkipEtablissementStep,
  useUpdateEtablissementFavoris,
} from "@/hooks/onboarding";
import {
  favoriRenfordSchema,
  FavoriRenfordSchema,
  OnboardingFavorisSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape4Page() {
  const router = useRouter();
  const { mutate: updateFavoris, isPending } = useUpdateEtablissementFavoris();
  const { mutate: skipStep, isPending: isSkipping } =
    useSkipEtablissementStep();
  const [favoris, setFavoris] = useState<FavoriRenfordSchema[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FavoriRenfordSchema>({
    resolver: zodResolver(favoriRenfordSchema),
    defaultValues: {
      nomComplet: "",
      email: "",
      telephone: "",
    },
  });

  const onAddFavori = (data: FavoriRenfordSchema) => {
    if (editingIndex !== null) {
      // Modifier un favori existant
      const newFavoris = [...favoris];
      newFavoris[editingIndex] = data;
      setFavoris(newFavoris);
      setEditingIndex(null);
    } else {
      // Ajouter un nouveau favori
      setFavoris([...favoris, data]);
    }
    reset();
    setIsAddingNew(false);
  };

  const onRemoveFavori = (index: number) => {
    setFavoris(favoris.filter((_, i) => i !== index));
  };

  const onEditFavori = (index: number) => {
    const favori = favoris[index];
    reset(favori);
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const onSubmit = () => {
    const data: OnboardingFavorisSchema = { favoris };
    updateFavoris(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-5");
      },
    });
  };

  const handleSkip = () => {
    skipStep(4, {
      onSuccess: () => {
        router.push("/onboarding/etape-5");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={4}
      title="Invitez vos Renfords préférés"
      subtitle="Vos coachs favoris seront notifiés en premier - à tarif préférentiel - dès qu'une mission correspond à leur profil."
    >
      <div className="space-y-6">
        {/* Liste des favoris ajoutés */}
        {favoris.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Profils</p>
            <div className="space-y-2">
              {favoris.map((favori, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {favori.nomComplet}
                    </p>
                    <p className="text-sm text-gray-500">
                      {favori.email}
                      {favori.telephone && `, ${favori.telephone}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditFavori(index)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFavori(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {isAddingNew ? (
          <form onSubmit={handleSubmit(onAddFavori)} className="space-y-4">
            <div>
              <Label htmlFor="nomComplet">Nom complet</Label>
              <Input
                id="nomComplet"
                placeholder="Prénom Nom"
                {...register("nomComplet")}
              />
              <ErrorMessage>{errors.nomComplet?.message}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email")}
              />
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="telephone">Téléphone (optionnel)</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="06 12 34 56 78"
                {...register("telephone")}
              />
              <ErrorMessage>{errors.telephone?.message}</ErrorMessage>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingIndex !== null ? "Modifier" : "Ajouter"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingIndex(null);
                  reset();
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Plus size={16} />
            Ajouter un Renford
          </button>
        )}

        {/* Import CSV */}
        <div className="text-center">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto"
          >
            <Upload size={16} />
            <span className="underline">Importer via CSV</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSkipping}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Passer cette étape
          </button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/onboarding/etape-3")}
            >
              Annuler
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </OnboardingCard>
  );
}
