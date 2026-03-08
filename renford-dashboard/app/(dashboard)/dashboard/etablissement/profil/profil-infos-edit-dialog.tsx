"use client";

import { Button } from "@/components/ui/button";
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
import { useUpdateProfilEtablissementInfos } from "@/hooks/profil-etablissement";
import { CurrentUser } from "@/types/utilisateur";
import {
  TYPE_ETABLISSEMENT,
  TYPE_ETABLISSEMENT_LABELS,
  updateProfilEtablissementInfosSchema,
  UpdateProfilEtablissementInfosSchema,
} from "@/validations/profil-etablissement";
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
  const profil = me?.profilEtablissement;
  const { mutate, isPending } = useUpdateProfilEtablissementInfos();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilEtablissementInfosSchema>({
    resolver: zodResolver(updateProfilEtablissementInfosSchema),
    defaultValues: {
      raisonSociale: profil?.raisonSociale || "",
      typeEtablissement: profil?.typeEtablissement || undefined,
      aPropos: profil?.aPropos || "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      raisonSociale: profil?.raisonSociale || "",
      typeEtablissement: profil?.typeEtablissement || undefined,
      aPropos: profil?.aPropos || "",
    });
  }, [open, profil, reset]);

  const onSubmit: SubmitHandler<UpdateProfilEtablissementInfosSchema> = (
    data
  ) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const typeEtablissementOptions = TYPE_ETABLISSEMENT.map((type) => ({
    value: type,
    label: TYPE_ETABLISSEMENT_LABELS[type],
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations du profil</DialogTitle>
          <DialogDescription>
            Modifiez les informations affichées dans la section profil.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <Label htmlFor="raisonSociale">Raison sociale*</Label>
              <Input
                id="raisonSociale"
                placeholder="Nom de votre entreprise"
                {...register("raisonSociale")}
              />
              <ErrorMessage>{errors.raisonSociale?.message}</ErrorMessage>
            </div>

            <div>
              <Label>Type d&apos;établissement*</Label>
              <Controller
                name="typeEtablissement"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as string)}
                    options={typeEtablissementOptions}
                    placeholder="Sélectionner..."
                    searchPlaceholder="Rechercher un type"
                    emptyMessage="Aucun type trouvé"
                  />
                )}
              />
              <ErrorMessage>{errors.typeEtablissement?.message}</ErrorMessage>
            </div>

            <div>
              <Label htmlFor="aPropos">À propos</Label>
              <Textarea
                id="aPropos"
                rows={5}
                placeholder="Décrivez votre établissement..."
                {...register("aPropos")}
              />
              <ErrorMessage>{errors.aPropos?.message}</ErrorMessage>
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
