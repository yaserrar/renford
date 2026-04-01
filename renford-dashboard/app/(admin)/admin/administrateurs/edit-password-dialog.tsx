"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { useUpdateAdminPassword } from "@/hooks/admin";
import {
  updateAdminPasswordSchema,
  UpdateAdminPasswordSchema,
} from "@/validations/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminId: string;
  adminName: string;
};

export default function EditPasswordDialog({
  open,
  onOpenChange,
  adminId,
  adminName,
}: Props) {
  const mutation = useUpdateAdminPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateAdminPasswordSchema>({
    resolver: zodResolver(updateAdminPasswordSchema),
  });

  const onSubmit = (data: UpdateAdminPasswordSchema) => {
    mutation.mutate(
      { adminId, data },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le mot de passe de {adminName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <InputPassword
              id="new-password"
              placeholder="••••••••"
              {...register("password")}
            />
            <ErrorMessage>{errors.password?.message}</ErrorMessage>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin" />}
              Mettre à jour
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
