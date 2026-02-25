"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Image as ImageIcon, Loader2, Trash } from "lucide-react";
import ImageUploadDialog from "@/components/common/image-upload-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { OnboardingCard } from "../-components";
import { getUrl } from "@/lib/utils";

export default function Etape4RenfordPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate, isPending } = useUpdateRenfordProfil();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoProfil, setPhotoProfil] = useState<string | null>(
    user?.profilRenford?.photoProfil || null,
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
      typeMission: user?.profilRenford?.typeMission || [],
      assuranceRCPro: user?.profilRenford?.assuranceRCPro || false,
    },
  });

  const handlePhotoUploaded = (path: string) => {
    setPhotoProfil(path);
    setValue("photoProfil", path, { shouldDirty: true });
  };

  const removePhoto = () => {
    setPhotoProfil(null);
    setValue("photoProfil", null, { shouldDirty: true });
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
      subtitle="Ces infos permettront aux structures de mieux vous connaître."
    >
      <ImageUploadDialog
        open={photoDialogOpen}
        setOpen={setPhotoDialogOpen}
        setImageValue={handlePhotoUploaded}
        path="profils/photos"
        aspect={1}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Photo</Label>
          <div className="flex items-center gap-4">
            <Avatar
              className="h-20 w-20 bg-gray-200 cursor-pointer"
              onClick={() => setPhotoDialogOpen(true)}
            >
              {photoProfil && (
                <AvatarImage
                  src={getUrl(photoProfil)}
                  alt="Photo de profil"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-gray-200">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPhotoDialogOpen(true)}
              >
                {photoProfil ? "Modifier la photo" : "Télécharger une photo"}
              </Button>
              {photoProfil && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost-destructive"
                  onClick={removePhoto}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
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
              <Combobox
                multiple
                value={field.value || []}
                onValueChange={(value) => field.onChange(value as string[])}
                options={TYPE_MISSION.map((type) => ({
                  value: type,
                  label: TYPE_MISSION_LABELS[type],
                }))}
                placeholder="Sélectionner un ou plusieurs types"
                searchPlaceholder="Rechercher un type de mission"
                emptyMessage="Aucun type trouvé"
              />
            )}
          />
          <ErrorMessage>{errors.typeMission?.message}</ErrorMessage>
        </div>

        <div className="flex gap-2 pt-2">
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
            className="cursor-pointer font-normal mb-0"
          >
            Je certifie sur l&apos;honneur avoir une Assurance RC Pro*
          </Label>
        </div>
        <ErrorMessage>{errors.assuranceRCPro?.message}</ErrorMessage>

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
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
    </OnboardingCard>
  );
}
