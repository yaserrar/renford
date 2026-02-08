"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import {
  ExcelUploadDialog,
  ColumnDefinition,
  ValidationError,
} from "@/components/common/excel-upload-dialog";
import {
  generateExcelTemplateWithOptionsSheet,
  TemplateColumn,
} from "@/lib/excel-template";
import { useI18n } from "@/stores/use-i18n";
import {
  useBulkCreateEtablissements,
  BulkEtablissementExcelItem,
  BulkEtablissementPayload,
} from "@/hooks/etablissement";
import { useGetProvinces } from "@/hooks/province";
import { useGetRegions } from "@/hooks/region";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
  TYPE_ETABLISSEMENT_OPTIONS,
  SECTEUR_ETABLISSEMENT_OPTIONS,
} from "@/validations/etablissement";

type UploadEtablissementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UploadEtablissementDialog({
  open,
  onOpenChange,
}: UploadEtablissementDialogProps) {
  const { dictionary, lang } = useI18n();
  const d = dictionary.gestionSaisonEtablissements;
  const uploadDict = dictionary.upload;
  const isRTL = lang === "ar";

  const bulkCreate = useBulkCreateEtablissements();
  const { data: regions = [] } = useGetRegions();
  const { data: provinces = [] } = useGetProvinces();

  // Cascading selection state
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");

  // Reset selections when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedRegionId("");
      setSelectedProvinceId("");
    }
  }, [open]);

  // Filter provinces by selected region
  const filteredProvinces = useMemo(
    () =>
      selectedRegionId
        ? provinces.filter((p) => p.regionId === selectedRegionId)
        : [],
    [provinces, selectedRegionId]
  );

  // Handlers for cascading dropdowns
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedProvinceId("");
  };

  // Combobox options
  const regionOptions = useMemo(
    () => regions.map((r) => ({ value: r.id, label: r.nom })),
    [regions]
  );

  const provinceOptions = useMemo(
    () => filteredProvinces.map((p) => ({ value: p.id, label: p.nom })),
    [filteredProvinces]
  );

  // Type labels (French)
  const typeLabels = useMemo(
    () => ({
      primaire: "Primaire",
      college: "Collège",
      lycee: "Lycée",
    }),
    []
  );

  const typeOptions = TYPE_ETABLISSEMENT_OPTIONS.map(
    (t) => typeLabels[t as keyof typeof typeLabels]
  );

  // Secteur labels (French)
  const secteurLabels = useMemo(
    () => ({
      public: "Public",
      prive: "Privé",
      autre: "Autre",
    }),
    []
  );

  const secteurOptions = SECTEUR_ETABLISSEMENT_OPTIONS.map(
    (s) => secteurLabels[s as keyof typeof secteurLabels]
  );

  // Column definitions for the upload dialog (French labels - Excel model is always in French, no province column)
  const columns: ColumnDefinition[] = useMemo(
    () => [
      { key: "nom", label: "Nom de l'établissement", required: true },
      {
        key: "numeroImmatriculation",
        label: "Numéro d'immatriculation",
        required: true,
      },
      {
        key: "typeEtablissement",
        label: "Type d'établissement",
        required: false,
      },
      { key: "secteur", label: "Secteur", required: false },
      { key: "nombreEleves", label: "Nombre d'élèves", required: false },
      { key: "adresse", label: "Adresse", required: false },
      // Superviseur info fields
      {
        key: "nomComplet",
        label: "Nom complet du superviseur",
        required: true,
      },
      { key: "email", label: "Email du superviseur", required: true },
      { key: "telephone", label: "Téléphone", required: false },
    ],
    []
  );

  // Validate a single row
  const validateRow = useCallback(
    (row: Record<string, any>, rowNumber: number): ValidationError[] => {
      const errors: ValidationError[] = [];

      // Required: nom
      if (!row.nom || String(row.nom).trim().length < 2) {
        errors.push({
          row: rowNumber,
          column: "nom",
          message: "Nom requis (min 2 caractères)",
        });
      }

      // Required: numeroImmatriculation
      if (
        !row.numeroImmatriculation ||
        String(row.numeroImmatriculation).trim().length < 1
      ) {
        errors.push({
          row: rowNumber,
          column: "numeroImmatriculation",
          message: "Numéro d'immatriculation requis",
        });
      }

      // Optional: typeEtablissement (must be valid if provided)
      if (row.typeEtablissement) {
        const typeValue = String(row.typeEtablissement).trim().toLowerCase();
        // Check both the raw value and the translated label
        const validTypes = [...TYPE_ETABLISSEMENT_OPTIONS];
        const typeFromLabel = Object.entries(typeLabels).find(
          ([, label]) => label.toLowerCase() === typeValue
        )?.[0];

        if (!validTypes.includes(typeValue as any) && !typeFromLabel) {
          errors.push({
            row: rowNumber,
            column: "typeEtablissement",
            message: `Type invalide. Valeurs acceptées: ${typeOptions.join(
              ", "
            )}`,
          });
        }
      }

      // Optional: secteur (must be valid if provided)
      if (row.secteur) {
        const secteurValue = String(row.secteur).trim().toLowerCase();
        const validSecteurs = [...SECTEUR_ETABLISSEMENT_OPTIONS];
        const secteurFromLabel = Object.entries(secteurLabels).find(
          ([, label]) => label.toLowerCase() === secteurValue
        )?.[0];

        if (!validSecteurs.includes(secteurValue as any) && !secteurFromLabel) {
          errors.push({
            row: rowNumber,
            column: "secteur",
            message: `Secteur invalide. Valeurs acceptées: ${secteurOptions.join(
              ", "
            )}`,
          });
        }
      }

      // Optional: nombreEleves (must be a valid positive number if provided)
      if (
        row.nombreEleves !== undefined &&
        row.nombreEleves !== null &&
        row.nombreEleves !== ""
      ) {
        const nombre = Number(row.nombreEleves);
        if (isNaN(nombre) || nombre < 0 || !Number.isInteger(nombre)) {
          errors.push({
            row: rowNumber,
            column: "nombreEleves",
            message: "Nombre d'élèves doit être un nombre entier positif",
          });
        }
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
        // Email is required for superviseur
        errors.push({
          row: rowNumber,
          column: "email",
          message: "Email requis pour le superviseur",
        });
      }

      // Required: nomComplet (for superviseur)
      if (!row.nomComplet || String(row.nomComplet).trim().length < 2) {
        errors.push({
          row: rowNumber,
          column: "nomComplet",
          message: "Nom complet du superviseur requis (min 2 caractères)",
        });
      }

      return errors;
    },
    [typeLabels, typeOptions, secteurLabels, secteurOptions]
  );

  // Transform row to API format
  const transformRow = useCallback(
    (row: Record<string, any>): BulkEtablissementExcelItem => {
      // Resolve type from label to value
      let typeValue = String(row.typeEtablissement || "primaire")
        .trim()
        .toLowerCase();
      const typeFromLabel = Object.entries(typeLabels).find(
        ([, label]) => label.toLowerCase() === typeValue
      )?.[0];
      if (typeFromLabel) {
        typeValue = typeFromLabel;
      }
      if (!TYPE_ETABLISSEMENT_OPTIONS.includes(typeValue as any)) {
        typeValue = "primaire";
      }

      // Resolve secteur from label to value
      let secteurValue = String(row.secteur || "public")
        .trim()
        .toLowerCase();
      const secteurFromLabel = Object.entries(secteurLabels).find(
        ([, label]) => label.toLowerCase() === secteurValue
      )?.[0];
      if (secteurFromLabel) {
        secteurValue = secteurFromLabel;
      }
      if (!SECTEUR_ETABLISSEMENT_OPTIONS.includes(secteurValue as any)) {
        secteurValue = "public";
      }

      // Parse nombreEleves
      let nombreEleves = 0;
      if (
        row.nombreEleves !== undefined &&
        row.nombreEleves !== null &&
        row.nombreEleves !== ""
      ) {
        const parsed = Number(row.nombreEleves);
        if (!isNaN(parsed) && parsed >= 0 && Number.isInteger(parsed)) {
          nombreEleves = parsed;
        }
      }

      return {
        nom: String(row.nom || "").trim(),
        numeroImmatriculation: String(row.numeroImmatriculation || "").trim(),
        typeEtablissement: typeValue,
        secteur: secteurValue,
        nombreEleves,
        adresse: row.adresse ? String(row.adresse).trim() : undefined,
        // Superviseur info fields
        nomComplet: String(row.nomComplet || "").trim(),
        email: String(row.email || "").trim(),
        telephone: row.telephone ? String(row.telephone).trim() : undefined,
      };
    },
    [typeLabels, secteurLabels]
  );

  // Generate and download template (French labels)
  const handleDownloadTemplate = useCallback(() => {
    const templateColumns: TemplateColumn[] = [
      { header: "Nom de l'établissement", width: 30 },
      { header: "Numéro d'immatriculation", width: 20 },
      { header: "Type d'établissement", width: 15, dropdown: typeOptions },
      { header: "Secteur", width: 15, dropdown: secteurOptions },
      { header: "Nombre d'élèves", width: 15 },
      { header: "Adresse", width: 30 },
      // Superviseur info fields
      { header: "Nom complet du superviseur", width: 25 },
      { header: "Email du superviseur", width: 25 },
      { header: "Téléphone", width: 15 },
    ];

    generateExcelTemplateWithOptionsSheet(
      templateColumns,
      "modele_etablissements.xlsx",
      "Etablissements",
      "Options"
    );
  }, [typeOptions, secteurOptions]);

  // Handle submit
  const handleSubmit = (data: BulkEtablissementExcelItem[]) => {
    if (!selectedProvinceId) {
      return;
    }

    const payload: BulkEtablissementPayload = {
      provinceId: selectedProvinceId,
      etablissements: data,
    };

    bulkCreate.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  // Check if province is selected
  const canSubmit = !!selectedProvinceId;

  // Custom header content with cascading dropdowns
  const headerContent = (
    <div className="space-y-4 mb-4 p-4 bg-muted/50 rounded-lg">
      <p className="text-sm text-muted-foreground font-medium">
        {d.selectProvinceInstruction}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Region */}
        <div className="space-y-2">
          <Label>{d.region} *</Label>
          <Combobox
            options={regionOptions}
            value={selectedRegionId}
            onValueChange={handleRegionChange}
            placeholder={d.selectionnerRegion}
            searchPlaceholder={d.rechercherRegion}
            emptyMessage={d.aucuneRegion}
          />
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label>{d.province} *</Label>
          <Combobox
            options={provinceOptions}
            value={selectedProvinceId}
            onValueChange={setSelectedProvinceId}
            placeholder={d.selectionnerProvince}
            searchPlaceholder={d.rechercherProvince}
            emptyMessage={d.aucuneProvince}
            disabled={!selectedRegionId}
          />
        </div>
      </div>
      {!canSubmit && (
        <p className="text-sm text-destructive">{d.selectProvinceRequired}</p>
      )}
    </div>
  );

  return (
    <ExcelUploadDialog<BulkEtablissementExcelItem>
      open={open}
      onOpenChange={onOpenChange}
      title={d.titreImport}
      columns={columns}
      validateRow={validateRow}
      transformRow={transformRow}
      onSubmit={handleSubmit}
      isSubmitting={bulkCreate.isPending}
      templateFileName="modele_etablissements.xlsx"
      onDownloadTemplate={handleDownloadTemplate}
      templateInstruction={d.instructionModele}
      downloadTemplateLabel={d.telechargerModele}
      uploadLabel={uploadDict.uploadFile}
      cancelLabel={uploadDict.cancel}
      submitLabel={uploadDict.submit}
      dragDropLabel={uploadDict.dragDropLabel}
      orLabel={uploadDict.or}
      browseLabel={uploadDict.browse}
      validRowsLabel={uploadDict.validRows}
      invalidRowsLabel={uploadDict.invalidRows}
      totalRowsLabel={uploadDict.totalRows}
      noDataLabel={uploadDict.noData}
      errorsSummaryLabel={uploadDict.errorsSummary}
      isRTL={isRTL}
      headerContent={headerContent}
      canSubmit={canSubmit}
    />
  );
}
