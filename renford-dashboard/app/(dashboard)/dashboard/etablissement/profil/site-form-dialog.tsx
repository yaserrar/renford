"use client";

import GoogleAddressAutocomplete from "@/components/common/google-address-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateEtablissementSite,
  useUpdateEtablissementSite,
} from "@/hooks/profil-etablissement";
import { Etablissement } from "@/types/etablissement";
import {
  upsertEtablissementSiteSchema,
  UpsertEtablissementSiteSchema,
} from "@/validations/etablissement";
import {
  TYPE_ETABLISSEMENT,
  TYPE_ETABLISSEMENT_LABELS,
} from "@/validations/profil-etablissement";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type SiteFormDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  mode: "create" | "edit";
  site?: Etablissement;
  defaultSiret?: string;
  defaultTypeEtablissement?: Etablissement["typeEtablissement"] | null;
};

export default function SiteFormDialog({
  open,
  setOpen,
  mode,
  site,
  defaultSiret,
  defaultTypeEtablissement,
}: SiteFormDialogProps) {
  const createMutation = useCreateEtablissementSite();
  const updateMutation = useUpdateEtablissementSite();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<
    z.input<typeof upsertEtablissementSiteSchema>,
    unknown,
    UpsertEtablissementSiteSchema
  >({
    resolver: zodResolver(upsertEtablissementSiteSchema),
    defaultValues: {
      nom: site?.nom || "",
      adresse: site?.adresse || "",
      codePostal: site?.codePostal || "",
      ville: site?.ville || "",
      latitude: site?.latitude ?? undefined,
      longitude: site?.longitude ?? undefined,
      siret: site?.siret || defaultSiret || "",
      typeEtablissement:
        site?.typeEtablissement || defaultTypeEtablissement || undefined,
      emailPrincipal: site?.emailPrincipal || null,
      telephonePrincipal: site?.telephonePrincipal || null,
      nomContactPrincipal: site?.nomContactPrincipal || null,
      prenomContactPrincipal: site?.prenomContactPrincipal || null,
      adresseFacturationDifferente: site?.adresseFacturationDifferente || false,
      adresseFacturation: site?.adresseFacturation || "",
      codePostalFacturation: site?.codePostalFacturation || "",
      villeFacturation: site?.villeFacturation || "",
    },
  });

  const adresseFacturationDifferente = watch("adresseFacturationDifferente");

  useEffect(() => {
    if (!open) return;

    reset({
      nom: site?.nom || "",
      adresse: site?.adresse || "",
      codePostal: site?.codePostal || "",
      ville: site?.ville || "",
      latitude: site?.latitude ?? undefined,
      longitude: site?.longitude ?? undefined,
      siret: site?.siret || defaultSiret || "",
      typeEtablissement:
        site?.typeEtablissement || defaultTypeEtablissement || undefined,
      emailPrincipal: site?.emailPrincipal || null,
      telephonePrincipal: site?.telephonePrincipal || null,
      nomContactPrincipal: site?.nomContactPrincipal || null,
      prenomContactPrincipal: site?.prenomContactPrincipal || null,
      adresseFacturationDifferente: site?.adresseFacturationDifferente || false,
      adresseFacturation: site?.adresseFacturation || "",
      codePostalFacturation: site?.codePostalFacturation || "",
      villeFacturation: site?.villeFacturation || "",
    });
  }, [defaultSiret, defaultTypeEtablissement, open, reset, site]);

  const onSubmit: SubmitHandler<UpsertEtablissementSiteSchema> = (data) => {
    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => setOpen(false),
      });
      return;
    }

    if (!site?.id) return;

    updateMutation.mutate(
      {
        etablissementId: site.id,
        data,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  const title =
    mode === "create" ? "Ajouter un établissement" : "Modifier l’établissement";

  const typeEtablissementOptions = TYPE_ETABLISSEMENT.map((type) => ({
    value: type,
    label: TYPE_ETABLISSEMENT_LABELS[type],
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Renseignez les informations principales du site.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <Label htmlFor="nom">Nom du site*</Label>
              <Input
                id="nom"
                placeholder="Nom de l’établissement"
                {...register("nom")}
              />
              <ErrorMessage>{errors.nom?.message}</ErrorMessage>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siret">SIRET (14 chiffres)*</Label>
                <Input
                  id="siret"
                  placeholder="12345678901234"
                  inputMode="numeric"
                  maxLength={14}
                  {...register("siret")}
                />
                <ErrorMessage>{errors.siret?.message}</ErrorMessage>
              </div>

              <div>
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

            <div>
              <Label htmlFor="adresse">Adresse*</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codePostal">Code postal*</Label>
                <Input
                  id="codePostal"
                  readOnly
                  placeholder="75001"
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
                  placeholder="Paris"
                  className="read-only:bg-muted"
                  {...register("ville")}
                />
                <ErrorMessage>{errors.ville?.message}</ErrorMessage>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenomContactPrincipal">
                  Prénom du contact principal*
                </Label>
                <Input
                  id="prenomContactPrincipal"
                  placeholder="Prénom"
                  {...register("prenomContactPrincipal")}
                />
                <ErrorMessage>
                  {errors.prenomContactPrincipal?.message}
                </ErrorMessage>
              </div>

              <div>
                <Label htmlFor="nomContactPrincipal">
                  Nom du contact principal*
                </Label>
                <Input
                  id="nomContactPrincipal"
                  placeholder="Nom"
                  {...register("nomContactPrincipal")}
                />
                <ErrorMessage>
                  {errors.nomContactPrincipal?.message}
                </ErrorMessage>
              </div>

              <div>
                <Label htmlFor="emailPrincipal">Email principal*</Label>
                <Input
                  id="emailPrincipal"
                  type="email"
                  placeholder="contact.principal@etablissement.fr"
                  {...register("emailPrincipal")}
                />
                <ErrorMessage>{errors.emailPrincipal?.message}</ErrorMessage>
              </div>

              <div>
                <Label htmlFor="telephonePrincipal">Téléphone principal</Label>
                <Input
                  id="telephonePrincipal"
                  placeholder="+33....."
                  {...register("telephonePrincipal")}
                />
                <ErrorMessage>
                  {errors.telephonePrincipal?.message}
                </ErrorMessage>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="adresseFacturationDifferente"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="adresseFacturationDifferente"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const enabled = checked === true;
                      field.onChange(enabled);

                      if (!enabled) {
                        setValue("adresseFacturation", "", {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                        setValue("codePostalFacturation", "", {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                        setValue("villeFacturation", "", {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                )}
              />
              <Label htmlFor="adresseFacturationDifferente" className="mb-0">
                Adresse de facturation différente
              </Label>
            </div>

            {adresseFacturationDifferente ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-input">
                <div>
                  <Label htmlFor="adresseFacturation">
                    Adresse de facturation*
                  </Label>
                  <Controller
                    name="adresseFacturation"
                    control={control}
                    render={({ field }) => (
                      <GoogleAddressAutocomplete
                        value={field.value || ""}
                        onChange={field.onChange}
                        onSelectAddress={(selection) => {
                          setValue("adresseFacturation", selection.address, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          setValue(
                            "codePostalFacturation",
                            selection.codePostal,
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            },
                          );
                          setValue("villeFacturation", selection.ville, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }}
                        placeholder="Commencez à saisir une adresse"
                      />
                    )}
                  />
                  <ErrorMessage>
                    {errors.adresseFacturation?.message}
                  </ErrorMessage>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codePostalFacturation">Code postal*</Label>
                    <Input
                      id="codePostalFacturation"
                      readOnly
                      placeholder="75001"
                      className="read-only:bg-muted"
                      {...register("codePostalFacturation")}
                    />
                    <ErrorMessage>
                      {errors.codePostalFacturation?.message}
                    </ErrorMessage>
                  </div>
                  <div>
                    <Label htmlFor="villeFacturation">Ville*</Label>
                    <Input
                      id="villeFacturation"
                      readOnly
                      placeholder="Paris"
                      className="read-only:bg-muted"
                      {...register("villeFacturation")}
                    />
                    <ErrorMessage>
                      {errors.villeFacturation?.message}
                    </ErrorMessage>
                  </div>
                </div>
              </div>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending || !isDirty}>
                {isPending && <Loader2 className="animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
