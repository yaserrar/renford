"use client";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdateRenfordBancaire,
  useSkipRenfordStep,
} from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingRenfordBancaireSchema,
  OnboardingRenfordBancaireSchema,
} from "@/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, X } from "lucide-react";
import DocumentUploadDialog from "@/components/common/document-upload-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape6RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordBancaire();
  const { mutate: skipStep, isPending: isSkipping } = useSkipRenfordStep();
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [carteIdentite, setCarteIdentite] = useState<string | null>(
    user?.profilRenford?.carteIdentiteChemin || null,
  );
  const carteIdentiteFileName = carteIdentite
    ? carteIdentite.split("/").pop()
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordBancaireSchema>({
    resolver: zodResolver(onboardingRenfordBancaireSchema),
    defaultValues: {
      iban: user?.profilRenford?.iban || "",
      carteIdentiteChemin: user?.profilRenford?.carteIdentiteChemin || "",
    },
  });

  const handleDocumentUploaded = (path: string) => {
    setCarteIdentite(path);
    setValue("carteIdentiteChemin", path, { shouldDirty: true });
  };

  const removeFile = () => {
    setCarteIdentite(null);
    setValue("carteIdentiteChemin", "", { shouldDirty: true });
  };

  const onSubmit = (data: OnboardingRenfordBancaireSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-7-renford");
      },
    });
  };

  const handleSkip = () => {
    skipStep(6, {
      onSuccess: () => {
        router.push("/onboarding/etape-7-renford");
      },
    });
  };

  return (
    <>
      <OnboardingCard
        currentStep={6}
        totalSteps={8}
        title="Informations bancaires"
        subtitle="Pour recevoir vos paiements"
        description="Renford s’appuie sur Stripe pour la gestion, la sécurisation et la
          vérification de vos informations bancaires. Vos données (IBAN et
          justificatifs d’identité) sont transmises de manière chiffrée à
          Stripe, qui les traite conformément aux obligations légales (KYC) et
          aux normes de sécurité internationales. Renford n’accède jamais à vos
          documents ou données bancaires. En continuant, vous acceptez le
          traitement de ces informations par Stripe conformément à sa politique
          de confidentialité."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="iban">IBAN*</Label>
            <Input
              id="iban"
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              {...register("iban")}
            />
            <ErrorMessage>{errors.iban?.message}</ErrorMessage>
          </div>

          <div>
            <Label>Carte d&apos;identité*</Label>

            {carteIdentite ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Document téléchargé</p>
                  <p className="text-xs text-gray-500">
                    {carteIdentiteFileName || "Cliquez pour modifier"}
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
              <div className="w-full p-6 flex flex-col justify-center items-center gap-2 border-2 border-dashed bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 text-center">
                  Ajoutez votre carte d&apos;identité (PDF, JPG, PNG)
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
            <ErrorMessage>{errors.carteIdentiteChemin?.message}</ErrorMessage>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-4">
            <Button
              type="button"
              variant="link"
              onClick={handleSkip}
              disabled={isPending || isSkipping}
              className="text-gray-500"
            >
              {isSkipping && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Passer cette étape
            </Button>

            <div className="flex flex-col md:flex-row md:justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending || isSkipping}
              >
                Retour
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Suivant
              </Button>
            </div>
          </div>
        </form>

        <DocumentUploadDialog
          open={documentDialogOpen}
          setOpen={setDocumentDialogOpen}
          setFileValue={handleDocumentUploaded}
          path="documents/identite"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={5}
          name="carte-identite"
        />
      </OnboardingCard>
    </>
  );
}
