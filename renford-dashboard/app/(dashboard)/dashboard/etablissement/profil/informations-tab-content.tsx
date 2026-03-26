"use client";

import GoogleAddressAutocomplete from "@/components/common/google-address-autocomplete";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfilEtablissementIdentite } from "@/hooks/profil-etablissement";
import { CurrentUser } from "@/types/utilisateur";
import {
  TYPE_ETABLISSEMENT,
  TYPE_ETABLISSEMENT_LABELS,
  updateProfilEtablissementIdentiteSchema,
  UpdateProfilEtablissementIdentiteSchema,
} from "@/validations/profil-etablissement";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

type InformationsTabContentProps = {
  me: CurrentUser | undefined;
};

export default function InformationsTabContent({
  me,
}: InformationsTabContentProps) {
  const profil = me?.profilEtablissement;
  const { mutate, isPending } = useUpdateProfilEtablissementIdentite();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilEtablissementIdentiteSchema>({
    resolver: zodResolver(updateProfilEtablissementIdentiteSchema),
    defaultValues: {
      raisonSociale: profil?.raisonSociale || "",
      siret: profil?.siret || "",
      adresse: profil?.adresse || "",
      codePostal: profil?.codePostal || "",
      ville: profil?.ville || "",
      latitude: profil?.latitude ?? undefined,
      longitude: profil?.longitude ?? undefined,
      typeEtablissement: profil?.typeEtablissement || undefined,
      adresseSiegeDifferente: profil?.adresseSiegeDifferente ?? false,
      adresseSiege: profil?.adresseSiege || "",
      codePostalSiege: profil?.codePostalSiege || "",
      villeSiege: profil?.villeSiege || "",
    },
  });

  const adresseSiegeDifferente = watch("adresseSiegeDifferente");

  const onSubmit = (data: UpdateProfilEtablissementIdentiteSchema) => {
    mutate(data);
  };

  const typeEtablissementOptions = TYPE_ETABLISSEMENT.map((type) => ({
    value: type,
    label: TYPE_ETABLISSEMENT_LABELS[type],
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-2xl border border-input p-6 space-y-4">
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <h3 className="text-lg font-semibold">Informations établissement</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div>
              <Label htmlFor="raisonSociale">Raison sociale*</Label>
              <Input
                id="raisonSociale"
                placeholder="Nom de votre entreprise"
                {...register("raisonSociale")}
              />
              <ErrorMessage>{errors.raisonSociale?.message}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="siret">Numéro SIRET (14 chiffres)*</Label>
              <Input
                id="siret"
                placeholder="12345678901234"
                {...register("siret")}
              />
              <ErrorMessage>{errors.siret?.message}</ErrorMessage>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="adresse">Adresse de l&apos;établissement*</Label>
              <Controller
                name="adresse"
                control={control}
                render={({ field }) => (
                  <GoogleAddressAutocomplete
                    value={field.value || ""}
                    onChange={field.onChange}
                    onSelectAddress={(selection) => {
                      setValue("adresse", selection.address, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      setValue("ville", selection.ville, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      setValue("codePostal", selection.codePostal, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      if (selection.latitude !== null) {
                        setValue("latitude", selection.latitude, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }
                      if (selection.longitude !== null) {
                        setValue("longitude", selection.longitude, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                    placeholder="Commencez à saisir une adresse"
                  />
                )}
              />
              <ErrorMessage>{errors.adresse?.message}</ErrorMessage>
              <ErrorMessage>
                {errors.latitude?.message || errors.longitude?.message}
              </ErrorMessage>
            </div>

            <div>
              <Label htmlFor="codePostal">Code postal*</Label>
              <Input
                id="codePostal"
                readOnly
                className="read-only:bg-muted"
                {...register("codePostal")}
              />
              <ErrorMessage>{errors.codePostal?.message}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="ville">Ville*</Label>
              <Input
                id="ville"
                readOnly
                className="read-only:bg-muted"
                {...register("ville")}
              />
              <ErrorMessage>{errors.ville?.message}</ErrorMessage>
            </div>

            <button
              type="button"
              onClick={() => {
                const newValue = !adresseSiegeDifferente;
                setValue("adresseSiegeDifferente", newValue, {
                  shouldDirty: true,
                });

                if (!newValue) {
                  setValue("adresseSiege", "", { shouldDirty: true });
                  setValue("codePostalSiege", "", { shouldDirty: true });
                  setValue("villeSiege", "", { shouldDirty: true });
                }
              }}
              className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Plus size={16} />
              Ajouter l&apos;adresse du siège social si différente
            </button>

            {adresseSiegeDifferente && (
              <div className="md:col-span-2 space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="adresseSiege">Adresse du siège*</Label>
                  <Controller
                    name="adresseSiege"
                    control={control}
                    render={({ field }) => (
                      <GoogleAddressAutocomplete
                        value={field.value || ""}
                        onChange={field.onChange}
                        onSelectAddress={(selection) => {
                          setValue("adresseSiege", selection.address, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          setValue("villeSiege", selection.ville, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          setValue("codePostalSiege", selection.codePostal, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Commencez à saisir l'adresse du siège"
                      />
                    )}
                  />
                  <ErrorMessage>{errors.adresseSiege?.message}</ErrorMessage>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codePostalSiege">Code postal*</Label>
                    <Input
                      id="codePostalSiege"
                      readOnly
                      className="read-only:bg-muted"
                      {...register("codePostalSiege")}
                    />
                    <ErrorMessage>
                      {errors.codePostalSiege?.message}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Label htmlFor="villeSiege">Ville*</Label>
                    <Input
                      id="villeSiege"
                      readOnly
                      className="read-only:bg-muted"
                      {...register("villeSiege")}
                    />
                    <ErrorMessage>{errors.villeSiege?.message}</ErrorMessage>
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <Label>Type d&apos;établissement*</Label>
              <Controller
                name="typeEtablissement"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as string)}
                    options={typeEtablissementOptions}
                    placeholder="Sélectionner..."
                    searchPlaceholder="Rechercher un type"
                    emptyMessage="Aucun type trouvé"
                  />
                )}
              />
              <ErrorMessage>{errors.typeEtablissement?.message}</ErrorMessage>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending && <Loader2 className="animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </div>
    </form>
  );
}
