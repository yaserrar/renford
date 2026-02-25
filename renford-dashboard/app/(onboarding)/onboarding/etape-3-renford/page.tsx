"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateRenfordIdentite } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingRenfordIdentiteSchema,
  OnboardingRenfordIdentiteSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, X } from "lucide-react";
import DocumentUploadDialog from "@/components/common/document-upload-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape3RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordIdentite();
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [attestationVigilance, setAttestationVigilance] = useState<
    string | null
  >(user?.profilRenford?.attestationVigilanceChemin || null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordIdentiteSchema>({
    resolver: zodResolver(onboardingRenfordIdentiteSchema),
    defaultValues: {
      siret: user?.profilRenford?.siret || "",
      siretEnCoursObtention:
        user?.profilRenford?.siretEnCoursObtention || false,
      attestationAutoEntrepreneur:
        user?.profilRenford?.attestationAutoEntrepreneur || false,
      adresse: user?.profilRenford?.adresse || "",
      codePostal: user?.profilRenford?.codePostal || "",
      ville: user?.profilRenford?.ville || "",
      pays: user?.profilRenford?.pays || "France",
      dateNaissance: user?.profilRenford?.dateNaissance
        ? new Date(user.profilRenford.dateNaissance)
        : undefined,
      attestationVigilanceChemin:
        user?.profilRenford?.attestationVigilanceChemin || undefined,
    },
  });

  const siretEnCoursObtention = watch("siretEnCoursObtention");
  const attestationFileName = attestationVigilance
    ? attestationVigilance.split("/").pop()
    : null;

  const handleDocumentUploaded = (path: string) => {
    setAttestationVigilance(path);
    setValue("attestationVigilanceChemin", path, {
      shouldDirty: true,
    });
  };

  const removeFile = () => {
    setAttestationVigilance(null);
    setValue("attestationVigilanceChemin", null, { shouldDirty: true });
  };

  const onSubmit = (data: OnboardingRenfordIdentiteSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-4-renford");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={3}
      totalSteps={8}
      title="Génial, confirmons votre activité et identité légales"
      subtitle="Ces informations restent confidentielles"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="siret">Numéro SIRET (14 chiffres)*</Label>
          <Input
            id="siret"
            placeholder="12345678901234"
            maxLength={14}
            disabled={siretEnCoursObtention}
            {...register("siret")}
          />
          <ErrorMessage>{errors.siret?.message}</ErrorMessage>

          <div className="flex items-center gap-2 mt-3">
            <Controller
              name="siretEnCoursObtention"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="siretEnCoursObtention"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      setValue("siret", "", { shouldDirty: true });
                    }
                  }}
                />
              )}
            />
            <Label
              htmlFor="siretEnCoursObtention"
              className="cursor-pointer font-normal mb-0"
            >
              Numéro SIRET en cours d'obtention
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="attestationAutoEntrepreneur"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="attestationAutoEntrepreneur"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor="attestationAutoEntrepreneur"
            className="cursor-pointer font-normal mb-0"
          >
            J'atteste être auto-entrepreneur/ EI/ EIRL/ SASU/ EURL *
          </Label>
        </div>

        <div>
          <Label htmlFor="adresse">Adresse*</Label>
          <Input
            id="adresse"
            placeholder="123 rue de la Paix"
            {...register("adresse")}
          />
          <ErrorMessage>{errors.adresse?.message}</ErrorMessage>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codePostal">Code postal*</Label>
            <Input
              id="codePostal"
              placeholder="75001"
              maxLength={5}
              {...register("codePostal")}
            />
            <ErrorMessage>{errors.codePostal?.message}</ErrorMessage>
          </div>
          <div>
            <Label htmlFor="ville">Ville*</Label>
            <Input id="ville" placeholder="Paris" {...register("ville")} />
            <ErrorMessage>{errors.ville?.message}</ErrorMessage>
          </div>
        </div>

        <div>
          <Label htmlFor="pays">Pays*</Label>
          <Input id="pays" placeholder="France" {...register("pays")} />
          <ErrorMessage>{errors.pays?.message}</ErrorMessage>
        </div>

        <div>
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

        <div>
          <Label>Attestation de vigilance</Label>

          {attestationVigilance ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Document téléchargé</p>
                <p className="text-xs text-gray-500">
                  {attestationFileName || "Cliquez pour modifier"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="w-full p-6 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl"
              onClick={() => setDocumentDialogOpen(true)}
            >
              <p className="text-sm text-gray-500 text-center">
                Ton attestation de vigilance URSSAF pour anticiper tes missions
                supérieures à 5000 euros (obligatoire)
              </p>
              <Button variant="outline">Télécharger un document</Button>
            </div>
          )}

          <ErrorMessage>
            {errors.attestationVigilanceChemin?.message}
          </ErrorMessage>

          <div className="bg-secondary-dark text-white text-sm p-2 mt-4 rounded">
            L'attestation de vigilance est une obligation légale avant le début
            de la prestation pour s'assurer que le prestataire est en règle avec
            ses obligations sociales (conformément à l'article L.8222-1 du Code
            du travail). Cette attestation est fournie par l’URSSAF. Vous pouvez
            télécharger vos attestations directement depuis votre espace en
            ligne sur urssaf.fr.
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Retour
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Suivant
          </Button>
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
    </OnboardingCard>
  );
}
