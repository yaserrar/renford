"use client";

import DocumentUploadDialog from "@/components/common/document-upload-dialog";
import GoogleAddressAutocomplete from "@/components/common/google-address-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfilRenfordIdentite } from "@/hooks/profil-renford";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import {
  updateProfilRenfordIdentiteSchema,
  UpdateProfilRenfordIdentiteSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileText, Loader2, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type InformationsTabContentProps = {
  me: CurrentUser | undefined;
};

export default function InformationsTabContent({
  me,
}: InformationsTabContentProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordIdentite();
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<
    z.input<typeof updateProfilRenfordIdentiteSchema>,
    unknown,
    UpdateProfilRenfordIdentiteSchema
  >({
    resolver: zodResolver(updateProfilRenfordIdentiteSchema),
    defaultValues: {
      siret: profil?.siret || "",
      siretEnCoursObtention: profil?.siretEnCoursObtention || false,
      attestationAutoEntrepreneur: profil?.attestationAutoEntrepreneur || false,
      adresse: profil?.adresse || "",
      codePostal: profil?.codePostal || "",
      ville: profil?.ville || "",
      latitude: profil?.latitude ?? undefined,
      longitude: profil?.longitude ?? undefined,
      pays: profil?.pays || "France",
      dateNaissance: profil?.dateNaissance
        ? new Date(profil.dateNaissance)
        : undefined,
      attestationVigilanceChemin:
        profil?.attestationVigilanceChemin || undefined,
    },
  });

  const siretEnCoursObtention = watch("siretEnCoursObtention");
  const attestationVigilance = watch("attestationVigilanceChemin");
  const attestationFileName = useMemo(
    () => (attestationVigilance ? attestationVigilance.split("/").pop() : null),
    [attestationVigilance]
  );

  const handleDocumentUploaded = useCallback(
    (path: string) => {
      setValue("attestationVigilanceChemin", path, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const onSubmit = (data: UpdateProfilRenfordIdentiteSchema) => {
    mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-input p-6 space-y-4">
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 className="text-lg font-semibold">Identité</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <Label htmlFor="siret">Numéro SIRET (14 chiffres)</Label>
                <Input
                  id="siret"
                  placeholder="12345678901234"
                  maxLength={14}
                  disabled={siretEnCoursObtention}
                  {...register("siret")}
                />
                <ErrorMessage>{errors.siret?.message}</ErrorMessage>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <Controller
                  name="siretEnCoursObtention"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="siretEnCoursObtention"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                        if (checked === true) {
                          setValue("siret", "", { shouldDirty: true });
                        }
                      }}
                    />
                  )}
                />
                <Label htmlFor="siretEnCoursObtention" className="mb-0">
                  Numéro SIRET en cours d&apos;obtention
                </Label>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <Controller
                  name="attestationAutoEntrepreneur"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="attestationAutoEntrepreneur"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  )}
                />
                <Label htmlFor="attestationAutoEntrepreneur" className="mb-0">
                  J&apos;atteste être auto-entrepreneur/ EI/ EIRL/ SASU/ EURL
                </Label>
              </div>

              <div className="md:col-span-2">
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
                        setValue("pays", selection.pays, {
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

              <div className="md:col-span-2">
                <Label htmlFor="pays">Pays*</Label>
                <Input
                  id="pays"
                  readOnly
                  className="read-only:bg-muted"
                  {...register("pays")}
                />
                <ErrorMessage>{errors.pays?.message}</ErrorMessage>
              </div>

              <div className="md:col-span-2">
                <Label>Date de naissance*</Label>
                <Controller
                  name="dateNaissance"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Sélectionner une date"
                    />
                  )}
                />
                <ErrorMessage>{errors.dateNaissance?.message}</ErrorMessage>
              </div>
            </div>
          </div>

          <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <h3 className="text-lg font-semibold">Attestation de conformité</h3>

            <div className=" md:col-span-2">
              <Label>Attestation de conformité</Label>

              {Boolean(attestationVigilance) ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-input mt-2">
                  <FileText className="h-6 w-6 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Document téléchargé</p>
                    <a
                      href={getUrl(attestationVigilance)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary inline-flex items-center gap-1 hover:underline break-all"
                    >
                      {attestationFileName || "Ouvrir le document"}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDocumentDialogOpen(true)}
                  >
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setValue("attestationVigilanceChemin", null, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full p-6 mt-2 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 text-center">
                    Ton attestation de vigilance URSSAF pour anticiper tes
                    missions supérieures à 5000 euros (obligatoire)
                  </p>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setDocumentDialogOpen(true)}
                  >
                    Télécharger un document
                  </Button>
                </div>
              )}

              <ErrorMessage>
                {errors.attestationVigilanceChemin?.message}
              </ErrorMessage>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </div>
      </form>

      <DocumentUploadDialog
        open={documentDialogOpen}
        setOpen={setDocumentDialogOpen}
        setFileValue={handleDocumentUploaded}
        path="documents/vigilance"
        accept=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={10}
        name="attestation-vigilance"
      />
    </>
  );
}
