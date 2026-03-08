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
import ErrorMessage from "@/components/ui/error-message";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfilRenfordDescription } from "@/hooks/profil-renford";
import { CurrentUser } from "@/types/utilisateur";
import {
  updateProfilRenfordDescriptionSchema,
  UpdateProfilRenfordDescriptionSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type AproposEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

export default function AproposEditDialog({
  open,
  setOpen,
  me,
}: AproposEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordDescription();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilRenfordDescriptionSchema>({
    resolver: zodResolver(updateProfilRenfordDescriptionSchema),
    defaultValues: {
      descriptionProfil: profil?.descriptionProfil || "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      descriptionProfil: profil?.descriptionProfil || "",
    });
  }, [open, profil?.descriptionProfil, reset]);

  const onSubmit: SubmitHandler<UpdateProfilRenfordDescriptionSchema> = (
    data
  ) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Modifier la section à propos</DialogTitle>
          <DialogDescription>
            Mettez à jour uniquement votre description de profil.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="descriptionProfil">Description du profil*</Label>
              <Textarea
                id="descriptionProfil"
                rows={5}
                placeholder="Présentez-vous et décrivez votre expérience..."
                {...register("descriptionProfil")}
              />
              <ErrorMessage>{errors.descriptionProfil?.message}</ErrorMessage>
            </div>

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
