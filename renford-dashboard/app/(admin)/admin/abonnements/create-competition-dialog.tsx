"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminUsers } from "@/hooks/admin";
import {
  useAdminAbonnements,
  useAdminSetCompetitionQuote,
} from "@/hooks/abonnement";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  profilEtablissementId: z
    .string()
    .min(1, "Veuillez sélectionner un établissement"),
  prixMensuelHT: z.coerce
    .number({ invalid_type_error: "Entrez un prix valide" })
    .positive("Le prix doit être supérieur à 0"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateCompetitionDialog() {
  const [open, setOpen] = useState(false);
  const { data: users = [] } = useAdminUsers();
  const { data: abonnements = [] } = useAdminAbonnements();
  const { mutateAsync: create, isPending } = useAdminSetCompetitionQuote();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { profilEtablissementId: "", prixMensuelHT: undefined },
    mode: "onChange",
  });

  const etablissements = useMemo(
    () =>
      users.filter(
        (u) => u.typeUtilisateur === "etablissement" && u.profilEtablissement,
      ),
    [users],
  );

  const etablissementOptions = etablissements.map((u) => ({
    value: u.profilEtablissement!.id,
    label: `${u.prenom} ${u.nom} — ${u.email}`,
  }));

  const selectedProfilId = watch("profilEtablissementId");
  const activeCompetitionAbonnement = abonnements.find(
    (a) =>
      a.profilEtablissement.id === selectedProfilId &&
      a.plan === "competition" &&
      a.statut === "actif",
  );

  const onSubmit = async (data: FormValues) => {
    try {
      await create({
        profilEtablissementId: data.profilEtablissementId,
        prixMensuelHT: data.prixMensuelHT,
      });
      reset();
      setOpen(false);
    } catch {
      // error handled by mutation's onError
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Trophy size={15} />
          Définir devis Compétition
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Définir le devis Compétition</DialogTitle>
          <DialogDescription>
            Après validation, le prix sera affiché sur la page abonnement de
            l&apos;établissement qui pourra alors souscrire directement via
            Stripe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Établissement</Label>
              <Controller
                name="profilEtablissementId"
                control={control}
                render={({ field }) => (
                  <Combobox
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as string)}
                    options={etablissementOptions}
                    placeholder="Rechercher un établissement…"
                    searchPlaceholder="Nom, email…"
                    emptyMessage="Aucun établissement trouvé."
                  />
                )}
              />
              <ErrorMessage>
                {errors.profilEtablissementId?.message}
              </ErrorMessage>
            </div>

            {activeCompetitionAbonnement && (
              <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>
                  Cet établissement a un abonnement Compétition actif à{" "}
                  <strong>
                    {activeCompetitionAbonnement.prixMensuelHT.toLocaleString(
                      "fr-FR",
                      {
                        style: "currency",
                        currency: "EUR",
                      },
                    )}
                    /mois
                  </strong>
                  . Modifier ce devis ne changera pas l&apos;abonnement en cours
                  — il s&apos;appliquera uniquement aux nouvelles souscriptions.
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="prix-competition">Prix mensuel HT (€)</Label>
              <Input
                id="prix-competition"
                type="number"
                min="1"
                step="0.01"
                placeholder="ex: 499"
                {...register("prixMensuelHT")}
              />
              <ErrorMessage>{errors.prixMensuelHT?.message}</ErrorMessage>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer le devis"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
