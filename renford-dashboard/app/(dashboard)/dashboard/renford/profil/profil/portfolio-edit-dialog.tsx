"use client";

import ImageUploadDialog from "@/components/common/image-upload-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateProfilRenfordPortfolio } from "@/hooks/profil-renford";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import {
  updateProfilRenfordPortfolioSchema,
  UpdateProfilRenfordPortfolioSchema,
} from "@/validations/profil-renford";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PortfolioEditDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  me: CurrentUser | undefined;
};

export default function PortfolioEditDialog({
  open,
  setOpen,
  me,
}: PortfolioEditDialogProps) {
  const profil = me?.profilRenford;
  const { mutate, isPending } = useUpdateProfilRenfordPortfolio();
  const [uploadOpen, setUploadOpen] = useState(false);

  const { handleSubmit, reset, watch, setValue } = useForm<
    z.input<typeof updateProfilRenfordPortfolioSchema>,
    unknown,
    UpdateProfilRenfordPortfolioSchema
  >({
    resolver: zodResolver(updateProfilRenfordPortfolioSchema),
    defaultValues: {
      portfolio: [],
    },
  });

  const portfolio = watch("portfolio") ?? [];

  useEffect(() => {
    if (!open) return;
    reset({
      portfolio: profil?.portfolio ?? [],
    });
  }, [open, profil?.portfolio, reset]);

  const onSubmit = (data: UpdateProfilRenfordPortfolioSchema) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      <ImageUploadDialog
        open={uploadOpen}
        setOpen={setUploadOpen}
        setImageValue={(path) => {
          setValue("portfolio", [...portfolio, path], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }}
        path="profils/portfolio"
        name="portfolio"
        aspect={4 / 3}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Modifier le portfolio</DialogTitle>
              <DialogDescription>
                Ajoutez ou supprimez les images de vos réalisations.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {portfolio.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune image ajoutée.
                </p>
              )}

              {portfolio.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {portfolio.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="relative aspect-square rounded-xl border border-input overflow-hidden"
                    >
                      <Image
                        src={getUrl(item)}
                        alt={`Portfolio ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 45vw, 180px"
                        className="object-cover border rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="outline-destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          const updated = [...portfolio];
                          updated.splice(index, 1);
                          setValue("portfolio", updated, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }}
                        disabled={isPending}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline-primary"
                onClick={() => setUploadOpen(true)}
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
                Ajouter une image
              </Button>
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
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
