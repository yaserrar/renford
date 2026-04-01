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
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { useCreateAdmin } from "@/hooks/admin";
import { createAdminSchema, CreateAdminSchema } from "@/validations/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateAdminDialog({ open, onOpenChange }: Props) {
  const createMutation = useCreateAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminSchema>({
    resolver: zodResolver(createAdminSchema),
  });

  const onSubmit = (data: CreateAdminSchema) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvel administrateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" placeholder="Jean" {...register("prenom")} />
              <ErrorMessage>{errors.prenom?.message}</ErrorMessage>
            </div>
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" placeholder="Dupont" {...register("nom")} />
              <ErrorMessage>{errors.nom?.message}</ErrorMessage>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@renford.fr"
              {...register("email")}
            />
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <InputPassword
              id="password"
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
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="animate-spin" />}
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
