import * as XLSX from "xlsx";

/**
 * Exports data to an Excel file.
 * @param data - The data to export.
 * @param headers - The column headers for the Excel file.
 * @param filename - The name of the Excel file (e.g., "data.xlsx").
 */

export const exportDataToExcel = (
  data: Record<string, any>[],
  headers: string[],
  filename: string
) => {
  // Create a worksheet
  const worksheetData = [
    headers, // Add renamed headers as the first row
    ...data.map((row) => headers.map((header) => row[header])), // Populate data using renamed headers
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a file
  XLSX.writeFile(workbook, filename);
};

export const exportDataToExcelNew = (
  data: Record<string, any>[],
  headers: { key: string; label: string }[],
  filename: string
) => {
  // Create a worksheet
  const worksheetData = [
    // Header row
    headers.map((h) => h.label),
    // Data rows, correctly mapping each row's data
    ...data.map((row, rowIndex) => {
      // Create a new array for the current row's data
      const rowData: any[] = [];

      // Loop through the headers to get the data in the correct order
      headers.forEach((h) => {
        // If the key is 'srNo', use the row's index + 1 for the serial number
        if (h.key === "srNo") {
          rowData.push(rowIndex + 1);
        } else {
          // Otherwise, get the value from the original data object
          rowData.push(row[h.key]);
        }
      });

      return rowData;
    }),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a file
  XLSX.writeFile(workbook, filename);
};

// With "Any" type
// export const exportToExcel = (
//   columns: { header: string; dataKey: string }[],
//   tableRows: any[],
//   filename: string
// ) => {
//   // Header row
//   const worksheetData = [
//     columns.map((col) => col.header),
//     ...tableRows.map((row) => columns.map((col) => row[col.dataKey])),
//   ];

//   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
//   XLSX.writeFile(workbook, `${filename}.xlsx`);
// };

// With Generic type
export const exportToExcelNewOne = <T extends Record<string, any>>(
  columns: { header: string; dataKey: keyof T }[], // 👈 keyof T ensures only valid keys
  tableRows: T[],
  filename: string
) => {
  const worksheetData = [
    columns.map((col) => col.header),
    ...tableRows.map((row) =>
      columns.map((col) => row[col.dataKey] as string | number | boolean | null)
    ),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};


// new version for dynamic column name

export interface ExcelColumn {
  label: string;
  value: string;
}

export const exportDataToExcelDynamicColumn = (
  columns: ExcelColumn[],
  rows: Record<string, any>[],
  filename: string
) => {
  const worksheetData = [
    columns.map((c) => c.label), // headers
    ...rows.map((row) =>
      columns.map((c) => row[c.value]) // values
    ),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
};
