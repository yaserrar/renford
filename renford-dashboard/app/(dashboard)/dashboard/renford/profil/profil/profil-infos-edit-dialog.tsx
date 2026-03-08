"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfilRenfordInfos } from "@/hooks/profil-renford";
import { CurrentUser } from "@/types/utilisateur";
import {
  TYPE_MISSION,
  TYPE_MISSION_LABELS,
  updateProfilRenfordInfosSchema,
  UpdateProfilRenfordInfosSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type ProfilInfosEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

export default function ProfilInfosEditDialog({
  open,
  setOpen,
  me,
}: ProfilInfosEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordInfos();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilRenfordInfosSchema>({
    resolver: zodResolver(updateProfilRenfordInfosSchema),
    defaultValues: {
      titreProfil: profil?.titreProfil || "",
      descriptionProfil: profil?.descriptionProfil || "",
      typeMission: profil?.typeMission || [],
      assuranceRCPro: profil?.assuranceRCPro || false,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      titreProfil: profil?.titreProfil || "",
      descriptionProfil: profil?.descriptionProfil || "",
      typeMission: profil?.typeMission || [],
      assuranceRCPro: profil?.assuranceRCPro || false,
    });
  }, [open, profil, reset]);

  const onSubmit: SubmitHandler<UpdateProfilRenfordInfosSchema> = (data) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations du profil</DialogTitle>
          <DialogDescription>
            Modifiez les informations visibles en haut de votre profil.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
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
                rows={4}
                placeholder="Présentez-vous et décrivez votre expérience..."
                {...register("descriptionProfil")}
              />
              <ErrorMessage>{errors.descriptionProfil?.message}</ErrorMessage>
            </div>

            <div className="w-full">
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

            <div className="flex gap-2 pt-1">
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
                Je certifie sur l&apos;honneur avoir une Assurance RC Pro
              </Label>
            </div>
            <ErrorMessage>{errors.assuranceRCPro?.message}</ErrorMessage>

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
