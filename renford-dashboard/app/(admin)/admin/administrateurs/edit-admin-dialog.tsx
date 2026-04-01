"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateAdmin } from "@/hooks/admin";
import type { AdminListItem } from "@/types/admin";
import { updateAdminSchema, UpdateAdminSchema } from "@/validations/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminListItem;
};

export default function EditAdminDialog({ open, onOpenChange, admin }: Props) {
  const updateMutation = useUpdateAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateAdminSchema>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ nom: admin.nom, prenom: admin.prenom, email: admin.email });
    }
  }, [open, admin, reset]);

  const onSubmit = (data: UpdateAdminSchema) => {
    updateMutation.mutate(
      { adminId: admin.id, data },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;administrateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit-prenom">Prénom</Label>
              <Input id="edit-prenom" {...register("prenom")} />
              <ErrorMessage>{errors.prenom?.message}</ErrorMessage>
            </div>
            <div>
              <Label htmlFor="edit-nom">Nom</Label>
              <Input id="edit-nom" {...register("nom")} />
              <ErrorMessage>{errors.nom?.message}</ErrorMessage>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" {...register("email")} />
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
