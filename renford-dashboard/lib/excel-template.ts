import * as XLSX from "xlsx";

export type TemplateColumn = {
  header: string;
  width?: number;
  dropdown?: string[];
};

/**
 * Generate an Excel template with optional dropdown validations
 * and download it as a file.
 */
export function generateExcelTemplateWithOptionsSheet(
  columns: TemplateColumn[],
  fileName: string,
  sheetName: string = "Data",
  optionsSheetName: string = "Options"
): void {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create the main data sheet with headers
  const headers = columns.map((col) => col.header);
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  // Set column widths
  const columnWidths = columns.map((col) => ({ wch: col.width || 15 }));
  worksheet["!cols"] = columnWidths;

  // Add the main sheet
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Create options sheet if there are any dropdowns
  const hasDropdowns = columns.some(
    (col) => col.dropdown && col.dropdown.length > 0
  );

  if (hasDropdowns) {
    // Collect all dropdown options
    const optionsData: string[][] = [];

    columns.forEach((col) => {
      if (col.dropdown && col.dropdown.length > 0) {
        optionsData.push([col.header, ...col.dropdown]);
      }
    });

    // Transpose to get columns of options
    const maxLength = Math.max(...optionsData.map((arr) => arr.length));
    const transposed: string[][] = [];

    for (let i = 0; i < maxLength; i++) {
      const row: string[] = [];
      for (let j = 0; j < optionsData.length; j++) {
        row.push(optionsData[j][i] || "");
      }
      transposed.push(row);
    }

    const optionsSheet = XLSX.utils.aoa_to_sheet(transposed);
    XLSX.utils.book_append_sheet(workbook, optionsSheet, optionsSheetName);
  }

  // Generate and download the file
  XLSX.writeFile(workbook, fileName);
}

/**
 * Simple template generator without dropdown options
 */
export function generateExcelTemplate(
  headers: string[],
  fileName: string,
  sheetName: string = "Data"
): void {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}
