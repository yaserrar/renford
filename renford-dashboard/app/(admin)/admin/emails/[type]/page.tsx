"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useAdminEmailTemplate,
  useUpsertEmailTemplate,
  useResetEmailTemplate,
} from "@/hooks/email-templates";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  sujet: string;
  titre: string;
  intro: string;
  corps: string;
  closing: string;
  ctaLabel: string;
};

export default function EmailTemplatePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const { data, isLoading } = useAdminEmailTemplate(type);
  const upsert = useUpsertEmailTemplate(type);
  const reset = useResetEmailTemplate(type);

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<FormValues>({
    values: {
      sujet: data?.template?.sujet ?? "",
      titre: data?.template?.titre ?? "",
      intro: data?.template?.intro ?? "",
      corps: data?.template?.corps ?? "",
      closing: data?.template?.closing ?? "",
      ctaLabel: data?.template?.ctaLabel ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v.trim() || null]),
    );
    upsert.mutate(payload, {
      onSuccess: () => toast.success("Template mis à jour"),
      onError: () => toast.error("Erreur lors de la mise à jour"),
    });
  };

  const handleReset = () => {
    reset.mutate(undefined, {
      onSuccess: () => {
        resetForm({
          sujet: "",
          titre: "",
          intro: "",
          corps: "",
          closing: "",
          ctaLabel: "",
        });
        toast.success("Template réinitialisé aux valeurs par défaut");
      },
      onError: () => toast.error("Erreur lors de la réinitialisation"),
    });
  };

  if (isLoading || !data) {
    return (
      <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
        <p className="text-muted-foreground">Chargement...</p>
      </main>
    );
  }

  const { defaultValues, effectiveValues } = data;

  const TEXT_FIELDS: { name: keyof FormValues; label: string }[] = [
    { name: "sujet", label: "Sujet de l'email" },
    { name: "titre", label: "Titre (H1)" },
    { name: "ctaLabel", label: "Bouton CTA" },
  ];

  const TEXTAREA_FIELDS: {
    name: keyof FormValues;
    label: string;
    rows: number;
    defaultKey: keyof typeof defaultValues;
  }[] = [
    { name: "intro", label: "Introduction", rows: 3, defaultKey: "intro" },
    {
      name: "corps",
      label: "Corps (remplace les puces / HTML personnalisé)",
      rows: 6,
      defaultKey: "intro",
    },
    { name: "closing", label: "Fermeture", rows: 2, defaultKey: "closing" },
  ];

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/emails">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{data.label}</h1>
            {data.customise ? (
              <Badge variant="default">Personnalisé</Badge>
            ) : (
              <Badge variant="secondary">Défaut</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!data.template || reset.isPending}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Edit form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-2 space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contenu personnalisé</CardTitle>
              <p className="text-xs text-muted-foreground">
                Laissez un champ vide pour utiliser le texte par défaut affiché
                en placeholder.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {TEXT_FIELDS.map(({ name, label }) => (
                <div key={name} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={
                          name === "sujet"
                            ? defaultValues.sujet
                            : name === "titre"
                              ? defaultValues.titre
                              : (defaultValues.ctaLabel ??
                                "Aucun bouton CTA par défaut")
                        }
                      />
                    )}
                  />
                </div>
              ))}

              {TEXTAREA_FIELDS.map(({ name, label, rows, defaultKey }) => (
                <div key={name} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        rows={rows}
                        placeholder={
                          name === "corps"
                            ? "Laisser vide = le contenu HTML dynamique par défaut est utilisé"
                            : (defaultValues[defaultKey] ??
                              "Aucune valeur par défaut")
                        }
                      />
                    )}
                  />
                </div>
              ))}

              <Button
                type="submit"
                disabled={upsert.isPending}
                className="w-full"
              >
                {upsert.isPending
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </Button>
            </CardContent>
          </Card>

          {/* Effective preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Aperçu des valeurs effectives
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Ce qui sera réellement envoyé (personnalisé si renseigné, sinon
                valeur par défaut du système).
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  { key: "sujet", label: "Sujet" },
                  { key: "titre", label: "Titre" },
                  { key: "intro", label: "Introduction" },
                  { key: "closing", label: "Fermeture" },
                  { key: "ctaLabel", label: "Bouton CTA" },
                ] as { key: keyof typeof effectiveValues; label: string }[]
              )
                .filter(({ key }) => effectiveValues[key] !== null)
                .map(({ key, label }) => (
                  <div key={key} className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm whitespace-pre-wrap text-foreground rounded bg-muted/40 px-2 py-1">
                      {effectiveValues[key]}
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </form>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variables disponibles</CardTitle>
              <p className="text-xs text-muted-foreground">
                Cliquez sur une variable pour la copier dans le presse-papiers.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.variables.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Aucune variable dynamique
                </p>
              ) : (
                data.variables.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`{{${v.name}}}`);
                      toast.success(`{{${v.name}}} copié`);
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-2 p-2 rounded border hover:bg-muted transition-colors">
                      <Badge
                        variant="outline"
                        className="text-xs font-mono shrink-0"
                      >
                        {`{{${v.name}}}`}
                      </Badge>
                      <span className="text-xs text-muted-foreground leading-tight">
                        {v.description}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comment ça marche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>
                Les champs laissés vides utilisent les textes codés dans le
                système — les emails continuent à fonctionner normalement.
              </p>
              <p>
                Insérez des variables avec la syntaxe{" "}
                <code className="bg-muted px-1 rounded font-mono">
                  {"{{nomVariable}}"}
                </code>{" "}
                — elles seront remplacées par les vraies valeurs à l&apos;envoi.
              </p>
              <p>
                Cliquez sur <strong>Réinitialiser</strong> pour revenir aux
                textes par défaut.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
