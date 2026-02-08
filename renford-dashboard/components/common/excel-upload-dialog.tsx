"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

export type ColumnDefinition = {
  key: string;
  label: string;
  required?: boolean;
};

export type ValidationError = {
  row: number;
  column: string;
  message: string;
};

export type ParsedRow = {
  rowNumber: number;
  data: Record<string, any>;
  errors: ValidationError[];
  isValid: boolean;
};

type ExcelUploadDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  columns: ColumnDefinition[];
  validateRow: (
    row: Record<string, any>,
    rowNumber: number
  ) => ValidationError[];
  transformRow?: (row: Record<string, any>) => T;
  onSubmit: (data: T[]) => void;
  isSubmitting?: boolean;
  templateFileName: string;
  onDownloadTemplate: () => void;
  templateInstruction?: string;
  downloadTemplateLabel: string;
  uploadLabel: string;
  cancelLabel: string;
  submitLabel: string;
  dragDropLabel: string;
  orLabel: string;
  browseLabel: string;
  validRowsLabel: string;
  invalidRowsLabel: string;
  totalRowsLabel: string;
  noDataLabel: string;
  errorsSummaryLabel: string;
  isRTL?: boolean;
  headerContent?: React.ReactNode;
  canSubmit?: boolean;
};

export function ExcelUploadDialog<T>({
  open,
  onOpenChange,
  title,
  columns,
  validateRow,
  transformRow,
  onSubmit,
  isSubmitting = false,
  templateFileName,
  onDownloadTemplate,
  templateInstruction,
  downloadTemplateLabel,
  uploadLabel,
  cancelLabel,
  submitLabel,
  dragDropLabel,
  orLabel,
  browseLabel,
  validRowsLabel,
  invalidRowsLabel,
  totalRowsLabel,
  noDataLabel,
  errorsSummaryLabel,
  isRTL = false,
  headerContent,
  canSubmit = true,
}: ExcelUploadDialogProps<T>) {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const validRows = parsedRows.filter((r) => r.isValid);
  const invalidRows = parsedRows.filter((r) => !r.isValid);

  const processFile = useCallback(
    (file: File) => {
      setParseError(null);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(
            worksheet,
            { defval: "" }
          );

          // Map Excel column headers to our keys
          const keyMap: Record<string, string> = {};
          columns.forEach((col) => {
            keyMap[col.label.toLowerCase()] = col.key;
            keyMap[col.key.toLowerCase()] = col.key;
          });

          const rows: ParsedRow[] = jsonData.map((row, index) => {
            // Normalize row keys
            const normalizedRow: Record<string, any> = {};
            Object.entries(row).forEach(([key, value]) => {
              const normalizedKey =
                keyMap[key.toLowerCase()] || key.toLowerCase();
              normalizedRow[normalizedKey] = value;
            });

            const errors = validateRow(normalizedRow, index + 2); // +2 for 1-based index + header row
            return {
              rowNumber: index + 2,
              data: normalizedRow,
              errors,
              isValid: errors.length === 0,
            };
          });

          setParsedRows(rows);
        } catch (error) {
          console.error("Error parsing file:", error);
          setParseError("Failed to parse the file. Please check the format.");
          setParsedRows([]);
        }
      };
      reader.readAsBinaryString(file);
    },
    [columns, validateRow]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleSubmit = () => {
    const validData = validRows.map((row) =>
      transformRow ? transformRow(row.data) : (row.data as T)
    );
    onSubmit(validData);
  };

  const handleClose = () => {
    setParsedRows([]);
    setFileName(null);
    setParseError(null);
    onOpenChange(false);
  };

  const clearFile = () => {
    setParsedRows([]);
    setFileName(null);
    setParseError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={cn(isRTL && "text-right")}>
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Custom header content (e.g., cascading dropdowns) */}
          {headerContent}

          {/* Instruction text and Download Template Button */}
          <div className={cn("flex flex-col gap-2")}>
            {templateInstruction && (
              <p
                className={cn(
                  "text-sm font-medium text-gray-700",
                  isRTL && "text-right"
                )}
              >
                {templateInstruction}
              </p>
            )}
            <div className={cn("flex")}>
              <Button
                variant="outline"
                onClick={onDownloadTemplate}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {downloadTemplateLabel}
              </Button>
            </div>
          </div>

          {/* Dropzone */}
          {!fileName && (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">{dragDropLabel}</p>
              <p className="text-xs text-gray-400 mb-3">{orLabel}</p>
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {browseLabel}
              </Button>
            </div>
          )}

          {/* Parse Error */}
          {parseError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-sm">{parseError}</span>
            </div>
          )}

          {/* File loaded - Show preview */}
          {fileName && parsedRows.length > 0 && (
            <>
              {/* File info and stats */}
              <div
                className={cn(
                  "flex items-center justify-between bg-gray-50 rounded-lg p-3",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-sm">{fileName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-4 text-sm",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <span className="text-gray-600">
                    {totalRowsLabel}: {parsedRows.length}
                  </span>
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {validRowsLabel}: {validRows.length}
                  </span>
                  {invalidRows.length > 0 && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {invalidRowsLabel}: {invalidRows.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Errors Summary */}
              {invalidRows.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{errorsSummaryLabel}</span>
                  </div>
                  <ScrollArea className="max-h-24">
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {invalidRows.slice(0, 10).map((row) =>
                        row.errors.map((err, errIdx) => (
                          <li key={`${row.rowNumber}-${errIdx}`}>
                            Row {row.rowNumber}: {err.column} - {err.message}
                          </li>
                        ))
                      )}
                      {invalidRows.length > 10 && (
                        <li>
                          ...and {invalidRows.length - 10} more rows with errors
                        </li>
                      )}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {/* Data Preview Table */}
              <div className="flex-1 border rounded-lg overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead className="w-16">Status</TableHead>
                      {columns.map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedRows.slice(0, 100).map((row) => (
                      <TableRow
                        key={row.rowNumber}
                        className={cn(!row.isValid && "bg-red-50")}
                      >
                        <TableCell className="font-medium">
                          {row.rowNumber}
                        </TableCell>
                        <TableCell>
                          {row.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        {columns.map((col) => {
                          const hasError = row.errors.some(
                            (e) => e.column === col.key
                          );
                          return (
                            <TableCell
                              key={col.key}
                              className={cn(hasError && "text-red-600")}
                            >
                              {String(row.data[col.key] ?? "")}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsedRows.length > 100 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    Showing first 100 rows of {parsedRows.length}
                  </p>
                )}
              </div>
            </>
          )}

          {/* No data loaded */}
          {fileName && parsedRows.length === 0 && !parseError && (
            <div className="text-center py-8 text-gray-500">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{noDataLabel}</p>
            </div>
          )}
        </div>

        <DialogFooter className={cn(isRTL && "flex-row-reverse")}>
          <Button variant="ghost" onClick={handleClose}>
            {cancelLabel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={validRows.length === 0 || isSubmitting || !canSubmit}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel} ({validRows.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
