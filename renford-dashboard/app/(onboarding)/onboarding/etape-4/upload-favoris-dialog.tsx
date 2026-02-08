"use client";

import { useMemo, useCallback } from "react";
import {
  ExcelUploadDialog,
  ColumnDefinition,
  ValidationError,
} from "@/components/common/excel-upload-dialog";
import {
  generateExcelTemplateWithOptionsSheet,
  TemplateColumn,
} from "@/lib/excel-template";
import { FavoriRenfordSchema } from "@/validations/onboarding";

type UploadFavorisDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (favoris: FavoriRenfordSchema[]) => void;
};

export function UploadFavorisDialog({
  open,
  onOpenChange,
  onSubmit,
}: UploadFavorisDialogProps) {
  // Column definitions for the upload dialog (French labels)
  const columns: ColumnDefinition[] = useMemo(
    () => [
      { key: "nomComplet", label: "Nom complet", required: true },
      { key: "email", label: "Email", required: true },
      { key: "telephone", label: "Téléphone", required: false },
    ],
    []
  );

  // Validate a single row
  const validateRow = useCallback(
    (row: Record<string, any>, rowNumber: number): ValidationError[] => {
      const errors: ValidationError[] = [];

      // Required: nomComplet
      if (!row.nomComplet || String(row.nomComplet).trim().length < 2) {
        errors.push({
          row: rowNumber,
          column: "nomComplet",
          message: "Nom complet requis (min 2 caractères)",
        });
      }

      // Required: email (must be valid)
      if (row.email && String(row.email).trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(row.email).trim())) {
          errors.push({
            row: rowNumber,
            column: "email",
            message: "Email invalide",
          });
        }
      } else {
        errors.push({
          row: rowNumber,
          column: "email",
          message: "Email requis",
        });
      }

      return errors;
    },
    []
  );

  // Transform row to FavoriRenfordSchema format
  const transformRow = useCallback(
    (row: Record<string, any>): FavoriRenfordSchema => {
      return {
        nomComplet: String(row.nomComplet || "").trim(),
        email: String(row.email || "").trim(),
        telephone: row.telephone ? String(row.telephone).trim() : "",
      };
    },
    []
  );

  // Generate and download template (French labels)
  const handleDownloadTemplate = useCallback(() => {
    const templateColumns: TemplateColumn[] = [
      { header: "Nom complet", width: 30 },
      { header: "Email", width: 30 },
      { header: "Téléphone", width: 20 },
    ];

    generateExcelTemplateWithOptionsSheet(
      templateColumns,
      "modele_favoris.xlsx",
      "Favoris",
      "Options"
    );
  }, []);

  // Handle submit
  const handleSubmit = (data: FavoriRenfordSchema[]) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <ExcelUploadDialog<FavoriRenfordSchema>
      open={open}
      onOpenChange={onOpenChange}
      title="Importer des Renfords favoris"
      columns={columns}
      validateRow={validateRow}
      transformRow={transformRow}
      onSubmit={handleSubmit}
      isSubmitting={false}
      templateFileName="modele_favoris.xlsx"
      onDownloadTemplate={handleDownloadTemplate}
      templateInstruction="Téléchargez le modèle Excel, remplissez-le avec les informations de vos Renfords préférés, puis importez-le."
      downloadTemplateLabel="Télécharger le modèle"
      uploadLabel="Télécharger le fichier"
      cancelLabel="Annuler"
      submitLabel="Importer"
      dragDropLabel="Glissez-déposez votre fichier Excel ou CSV ici"
      orLabel="ou"
      browseLabel="Parcourir les fichiers"
      validRowsLabel="Lignes valides"
      invalidRowsLabel="Lignes invalides"
      totalRowsLabel="Total"
      noDataLabel="Aucune donnée trouvée dans le fichier"
      errorsSummaryLabel="Erreurs de validation"
      isRTL={false}
      canSubmit={true}
    />
  );
}
