"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRenfordProfil } from "@/hooks/onboarding";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  onboardingRenfordProfilSchema,
  OnboardingRenfordProfilSchema,
} from "@/validations/onboarding";
import {
  TYPE_MISSION,
  TYPE_MISSION_LABELS,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import ImageUploadDialog from "@/components/common/image-upload-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";

export default function Etape4RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordProfil();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoProfil, setPhotoProfil] = useState<string | null>(
    user?.profilRenford?.photoProfil || null
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<OnboardingRenfordProfilSchema>({
    resolver: zodResolver(onboardingRenfordProfilSchema),
    defaultValues: {
      photoProfil: user?.profilRenford?.photoProfil || undefined,
      titreProfil: user?.profilRenford?.titreProfil || "",
      descriptionProfil: user?.profilRenford?.descriptionProfil || "",
      typeMission: user?.profilRenford?.typeMission || undefined,
      assuranceRCPro: user?.profilRenford?.assuranceRCPro || false,
    },
  });

  const handlePhotoUploaded = (path: string) => {
    setPhotoProfil(path);
    setValue("photoProfil", path, { shouldDirty: true });
  };

  const removePhoto = () => {
    setPhotoProfil(null);
    setValue("photoProfil", undefined, { shouldDirty: true });
  };

  const onSubmit = (data: OnboardingRenfordProfilSchema) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/onboarding/etape-5-renford");
      },
    });
  };

  return (
    <OnboardingCard
      currentStep={4}
      totalSteps={8}
      title="Parfait ! Finalisons votre profil 💪"
      subtitle="Ces informations seront visibles par les établissements"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Photo de profil (optionnel)</Label>
          <p className="text-sm text-gray-500 mb-2">
            Une photo professionnelle augmente vos chances d&apos;être contacté
          </p>

          {photoProfil ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={photoProfil}
                  alt="Photo de profil"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Photo téléchargée</p>
                <p className="text-xs text-gray-500">Cliquez pour modifier</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removePhoto}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 border-2 border-dashed"
              onClick={() => setPhotoDialogOpen(true)}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Cliquez pour télécharger
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG ou PNG (max 5 Mo)
                  </p>
                </div>
              </div>
            </Button>
          )}

          <ImageUploadDialog
            open={photoDialogOpen}
            setOpen={setPhotoDialogOpen}
            setImageValue={handlePhotoUploaded}
            path="profils/photos"
            aspect={1}
          />
        </div>

        <div>
          <Label htmlFor="titreProfil">Titre du profil*</Label>
          <Input
            id="titreProfil"
            placeholder="Ex: Coach sportif spécialisé fitness"
            {...register("titreProfil")}
          />
          <ErrorMessage>{errors.titreProfil?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="descriptionProfil">Description du profil*</Label>
          <Textarea
            id="descriptionProfil"
            placeholder="Présentez-vous et décrivez votre expérience..."
            rows={4}
            {...register("descriptionProfil")}
          />
          <ErrorMessage>{errors.descriptionProfil?.message}</ErrorMessage>
        </div>

        <div>
          <Label>Type de mission*</Label>
          <Controller
            name="typeMission"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_MISSION.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_MISSION_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage>{errors.typeMission?.message}</ErrorMessage>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <Controller
            name="assuranceRCPro"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="assuranceRCPro"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <Label
            htmlFor="assuranceRCPro"
            className="cursor-pointer font-normal"
          >
            Je certifie sur l&apos;honneur avoir une Assurance RC Pro*
          </Label>
        </div>
        <ErrorMessage>{errors.assuranceRCPro?.message}</ErrorMessage>

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Retour
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Continuer
          </Button>
        </div>
      </form>
    </OnboardingCard>
  );
}
