export const getFormattedDate = (
  dateInput: string | Date,
  formatType: "short" | "numeric" = "short",
): string => {
  let date: Date | null = null;

  if (typeof dateInput === "string") {
    if (dateInput.includes("-")) {
      const parts = dateInput.split("-");
      if (parts.length === 3) {
        const [first, second, third] = parts.map((part) => parseInt(part, 10));

        if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // yyyy-mm-dd
          date = new Date(first, second - 1, third);
        } else if (third > 31) {
          // dd-mm-yyyy (year at the end)
          date = new Date(third, second - 1, first);
        } else {
          // mm-dd-yyyy (month at the start)
          date = new Date(third, first - 1, second);
        }
      }
    }
  } else if (dateInput instanceof Date) {
    // Use Date instance directly
    date = dateInput;
  }

  if (!date || isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid dates
  }

  // Format the date as dd-MMM-yyyy
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// Usage examples
// const shortDate = getFormattedDate(new Date(), "short"); // Outputs: "Sep 10, 2024"
// const numericDate = getFormattedDate(new Date(), "numeric"); // Outputs: "10.9.2024"

export const getName = (id: number, data: any) => {
  const record = data.find((item: any) => item.id === id);
  if (record?.name) return record?.name;
  if (record?.userName) return record?.userName;
  if (record?.regNumber) return record?.regNumber;
  if (record?.driverName) return record?.driverName;
};

export function formatDateTime(dateTimeString: string, formatType: string) {
  const date = new Date(dateTimeString);

  if (formatType === "time") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (formatType === "date") {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .toUpperCase()
      .replace(/\//g, "-");
  } else {
    throw new Error("Invalid format type. Use 'time' or 'date'.");
  }
}

export const devMap = true;

// "yyyy-MM-dd" to the desired format "dd-MMM-yyyy"
export function formatHHLStringDate(inputDate: string): string {
  //HHL(High Level Language) - human readable
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Parse the input date string
  const [year, month, day] = inputDate.split("-");

  // Format the date
  const formattedDate = `${parseInt(day)}-${
    months[parseInt(month) - 1]
  }-${year}`;

  return formattedDate;
}

import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const renameMap: Record<string, string> = {
  id: "GS No.",
  fileGenrated: "REPORT GENERATED",
  visitStartDate: "DATE RANGE",
  // Add other mappings as needed
};

export const formatKeyName = (key: string): string => {
  return renameMap[key] || key.replace(/([A-Z])/g, " $1").toUpperCase(); // Default formatting
};

export const exportToPDF = (
  columns: { header: string; dataKey: string }[],
  tableRows: any[],
  selectedDate: Date,
  label: string,
) => {
  const doc = new jsPDF("landscape");
  doc.setFont("helvetica", "bold"); // Set font to bold
  doc.setFontSize(16); // Set font size for the heading
  // const titleText = `${label} ${
  // new Date(selectedDate).toLocaleDateString(
  //                           "en-GB",
  //                           {
  //                             weekday: "short",
  //                             day: "2-digit",
  //                             month: "short",
  //                             year: "numeric",
  //                           },
  //                         )
  // }`;
  const titleText = label;
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(titleText);
  const xPosition = (pageWidth - textWidth) / 2;
  doc.text(titleText, xPosition, 10); // Centered title at the top of the page

  // Reset font style for the rest of the content
  doc.setFont("helvetica", "normal"); // Change font back to normal for other text
  doc.setFontSize(10); // Set a smaller font size for the rest of the content

  // Define columns and rows for the PDF table
  // const columns = [
  //   { header: "GS NO", dataKey: "id" },
  //   { header: "Project Name", dataKey: "projectName" },
  // { header: "Sr", dataKey: "userId" },
  // { header: "Name", dataKey: "employeeName" },
  // { header: "Designation", dataKey: "employeeDesignation" },
  // { header: "In Time", dataKey: "punchInTime" },
  // { header: "Punch In", dataKey: "punchInStatus" },
  // { header: "Out Time", dataKey: "punchOutTime" },
  // { header: "Punch Out", dataKey: "punchOutStatus" },
  // ];

  // Map over your attendance data to create rows for the table
  // const trimDataMethod = (designation: any) => {
  //   let updatedText = "";
  //   let trimedText = designation.trim();

  //   for (let i = 0; i < trimedText.length; i++) {
  //     if (i !== trimedText.length - 1) {
  //       updatedText += trimedText[i];
  //     }
  //   }

  //   return updatedText.trim() + ")";
  // };

  // const tableRows =
  //   attendanceData &&
  //   attendanceData?.map((data: any, index: any) => ({
  //     id: index + 1,
  //     projectName: data.projectName,
  // employeeDesignation: trimDataMethod(data.employeeDesignation),
  // punchInTime: data.punchInTime,
  // punchInStatus: data.punchInStatus,
  // punchOutTime: data.punchOutTime,
  // punchOutStatus: data.punchOutStatus,
  // }));

  // Add table to PDF using autoTable plugin
  doc.autoTable({
    columns,
    body: tableRows,
    // startY: 20,
    theme: "grid", // Options: 'grid', 'plain', or 'striped'

    headStyles: {
      fillColor: [12, 140, 233], // Darker background color
      fontSize: 10, // Smaller text size
      fontStyle: "bold", // Bold text
      halign: "center", // Center the text horizontally
      valign: "middle",

      textColor: [255, 255, 255], // Optional: White text for contrast
      lineWidth: 0.2, // Border width for header cells
      lineColor: [255, 255, 255], // Border color as RGB
    },
    styles: {
      fontSize: 8,
      halign: "left", // Horizontal text alignment: 'left', 'center', 'right'
      valign: "middle", // Adjust table body font size if needed
    },
    // columnStyles: {
    //   0: { cellWidth: "auto" }, // First column width set to 30
    //   1: { cellWidth: "auto", halign: "left" }, // Second column width set to 50
    //   2: { cellWidth: 80, overflow: "hidden" }, // Third column auto width
    //   3: { cellWidth: 18, halign: "center" }, // Fourth column width set to 40
    //   4: { cellWidth: "auto", halign: "center" }, // Fourth column width set to 40
    //   5: { cellWidth: 18, halign: "center" }, // Fourth column width set to 40
    //   6: { cellWidth: "auto", halign: "center" }, // Fourth column width set to 40
    // },
  });

  // Save the PDF
  doc.save(`${label}.pdf`);
};

export const exportToPDFNew = (
  columns: { header: string; dataKey: string }[],
  tableRows: any[],
  selectedDate: Date,
  label: string,
) => {
  const doc = new jsPDF("landscape");
  doc.setFont("helvetica", "bold"); // Set font to bold
  doc.setFontSize(16); // Set font size for the heading
  // const titleText = `${label} ${
  // new Date(selectedDate).toLocaleDateString(
  //                             "en-GB",
  //                             {
  //                               weekday: "short",
  //                               day: "2-digit",
  //                               month: "short",
  //                               year: "numeric",
  //                             },
  //                           )
  // }`;
  const titleText = `${label}`;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20; // side margin
  const wrappedTitle = doc.splitTextToSize(titleText, pageWidth - margin * 2);

  // Center each line of the wrapped title
  wrappedTitle.forEach((line: string, i: number) => {
    const textWidth = doc.getTextWidth(line);
    const xPosition = (pageWidth - textWidth) / 2;
    doc.text(line, xPosition, 15 + i * 8);
  });

  // Reset font style for the rest of the content
  doc.setFont("helvetica", "normal"); // Change font back to normal for other text
  doc.setFontSize(16); // Set a smaller font size for the rest of the content

  // Define columns and rows for the PDF table
  // const columns = [
  //   { header: "GS NO", dataKey: "id" },
  //   { header: "Project Name", dataKey: "projectName" },
  // { header: "Sr", dataKey: "userId" },
  // { header: "Name", dataKey: "employeeName" },
  // { header: "Designation", dataKey: "employeeDesignation" },
  // { header: "In Time", dataKey: "punchInTime" },
  // { header: "Punch In", dataKey: "punchInStatus" },
  // { header: "Out Time", dataKey: "punchOutTime" },
  // { header: "Punch Out", dataKey: "punchOutStatus" },
  // ];

  // Map over your attendance data to create rows for the table
  // const trimDataMethod = (designation: any) => {
  //   let updatedText = "";
  //   let trimedText = designation.trim();

  //   for (let i = 0; i < trimedText.length; i++) {
  //     if (i !== trimedText.length - 1) {
  //       updatedText += trimedText[i];
  //     }
  //   }

  //   return updatedText.trim() + ")";
  // };

  // const tableRows =
  //   attendanceData &&
  //   attendanceData?.map((data: any, index: any) => ({
  //     id: index + 1,
  //     projectName: data.projectName,
  // employeeDesignation: trimDataMethod(data.employeeDesignation),
  // punchInTime: data.punchInTime,
  // punchInStatus: data.punchInStatus,
  // punchOutTime: data.punchOutTime,
  // punchOutStatus: data.punchOutStatus,
  // }));

  // Add table to PDF using autoTable plugin
  doc.autoTable({
    columns,
    body: tableRows,
    theme: "grid", // grid gives bordered cells like Bootstrap table
    startY: 25 + (wrappedTitle.length - 1) * 8,

    // Header style (like .table thead-dark or .table-primary)
    headStyles: {
      fillColor: [12, 140, 233], // Bootstrap primary blue
      textColor: [255, 255, 255], // White text
      fontSize: 10,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      lineWidth: 0.5,
      lineColor: [200, 200, 200],
    },

    // Body cell styles (like .table-bordered .table-striped)
    styles: {
      fontSize: 9,
      cellPadding: 3, // like Bootstrap padding
      halign: "left",
      valign: "middle",
      lineWidth: 0.5,
      lineColor: [220, 220, 220], // light border like Bootstrap
    },

    // Alternate row colors (striped)
    alternateRowStyles: {
      fillColor: [245, 245, 245], // light gray for stripes
    },

    // Optional: footer styling if needed
    footStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },

    // columnStyles: {
    //   0: { cellWidth: "auto" }, // First column width set to 30
    //   1: { cellWidth: "auto", halign: "left" }, // Second column width set to 50
    //   2: { cellWidth: 80, overflow: "hidden" }, // Third column auto width
    //   3: { cellWidth: 18, halign: "center" }, // Fourth column width set to 40
    //   4: { cellWidth: "auto", halign: "center" }, // Fourth column width set to 40
    //   5: { cellWidth: 18, halign: "center" }, // Fourth column width set to 40
    //   6: { cellWidth: "auto", halign: "center" }, // Fourth column width set to 40
    // },
  });

  // Save the PDF
  doc.save(`${label}.pdf`);
};

export const addDayToFormattedDate = (formattedDate: string): string => {
  // Parse the input formatted date
  const [day, month, year] = formattedDate.split("-");
  const dateString = `${month}-${day}-${year}`;

  // Create a Date object
  const date = new Date(dateString);

  // Get the weekday name
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });

  // Get the month name
  const monthName = date.toLocaleDateString("en-GB", { month: "short" });

  // Construct and return the final string
  return `${weekday}-${day}-${monthName}-${year}`;
};

export const getTimeLeft = (deadline: string): string => {
  const now = new Date();
  const targetDate = new Date(deadline);
  const diffInMs = targetDate.getTime() - now.getTime();

  const isDelayed = diffInMs < 0; // Check if the deadline has passed
  const absDiffInMs = Math.abs(diffInMs);

  const minutes = Math.floor(absDiffInMs / (1000 * 60));
  const hours = Math.floor(absDiffInMs / (1000 * 60 * 60));
  const days = Math.floor(absDiffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30); // Approximation for months
  const years = Math.floor(days / 365); // Approximation for years

  if (years > 0) {
    return `${years} ${years === 1 ? "Year" : "Years"} ${
      isDelayed ? "-Delayed" : "Left"
    }`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? "Month" : "Months"} ${
      isDelayed ? "-Delayed" : "Left"
    }`;
  }
  if (days > 0) {
    return `${days} ${days === 1 ? "Day" : "Days"} ${
      isDelayed ? "-Delayed" : "Left"
    }`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"} ${
      isDelayed ? "-Delayed" : "Left"
    }`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} ${
      isDelayed ? "-Delayed" : "Left"
    }`;
  }
  return "No Delay or Time Left";
};

// Utility function to calculate "x days ago"
export const getDaysAgo = (targetDate: string) => {
  const today = new Date();
  const givenDate = new Date(targetDate);

  // Calculate the difference in milliseconds
  const differenceInTime = today.getTime() - givenDate.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  // Return a formatted string
  if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays === 1) {
    return "Yesterday";
  } else {
    return `${differenceInDays} Days ago`;
  }
};

export const getTimeAgo = (targetDate: string) => {
  const now = new Date();
  const past = new Date(targetDate);
  const diffInMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

/**
 * Formats a number by placing commas as thousands separators.
 *
 * @param amount - The number to be formatted.
 * @param decimals - Number of decimal places to retain (default is 2).
 * @returns The formatted amount as a string.
 */
export function formatAmountWithCommas(
  amount: number,
  decimals: number = 3,
): string {
  if (isNaN(amount) && !amount) {
    throw new Error("Invalid amount. Please provide a valid number.");
  }

  // Convert the number to a fixed decimal string
  const fixedAmount = amount?.toFixed(decimals);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixedAmount?.split(".");

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return the formatted amount with decimals
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export const renderTinyMCEData = (info: any) => {
  if (info) {
    return <div dangerouslySetInnerHTML={{ __html: info }} />;
  }
  return null;
};

export interface SingleProjectLessData {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  gsNo: number;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
}

export const triggerEscapeKeyPress = () => {
  if (typeof window === "undefined") return; // Prevents SSR crash
  const escapeEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    keyCode: 27,
    code: "Escape",
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(escapeEvent);
};

const postData = async (url: string, data: Record<string, any>) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Inform the server you're sending JSON data
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json(); // Parse the response JSON
    console.log("Response:", result);
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error; // Optional: re-throw the error to handle it higher up
  }
};

export function addSpaceToCamelCase(text: string) {
  return text.replace(/([a-z])([A-Z])/g, "$1 $2");
}

import * as XLSX from "xlsx";
import { OptionType } from "./components/Form/CustomSelect";

export const downloadReportAnalysisToExcel = (
  data: any,
  filename: string = "Report.xlsx",
) => {
  // Flatten the data into rows
  const flattenData = (items: any[], parentLabels: string[] = []) => {
    const rows: any[] = [];
    items.forEach((item) => {
      const { groups, subGroups, ...rest } = item;
      const row = {
        ...rest,
        rowLabels: [...parentLabels, item.rowLabels].join(" > "),
      };

      rows.push(row);

      if (groups) {
        rows.push(...flattenData(groups, [...parentLabels, item.rowLabels]));
      }

      if (subGroups) {
        rows.push(...flattenData(subGroups, [...parentLabels, item.rowLabels]));
      }
    });
    return rows;
  };

  // Generate worksheet for each dataset
  const sheets: { [key: string]: XLSX.WorkSheet } = {};
  for (const [sheetName, dataset] of Object.entries(data)) {
    const flattened = flattenData(dataset as any[]);
    sheets[sheetName] = XLSX.utils.json_to_sheet(flattened);
  }

  // Create workbook and add sheets
  const workbook = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([sheetName, worksheet]) => {
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Write workbook to file
  XLSX.writeFile(workbook, filename);
};

export const createdMessage = "Created Successfully";
export const updatedMessage = "Updated Successfully";
export const deleteMessage = "Deleted Successfully";

export const displayStatusText = (statusId: number) => {
  return statusId === 0
    ? "SCHEDULED"
    : statusId === 1
      ? "COMPLETED"
      : statusId === 2
        ? "CANCELLED"
        : statusId === 3
          ? "SUBMITTED"
          : statusId === 4
            ? "APPROVED"
            : statusId === 5
              ? "REFERBACK"
              : statusId === 6
                ? "ISSUED"
                : "";
};

export interface Option {
  label: string;
  value: string;
}

export interface StringOption {
  label: string;
  value: string;
}

export interface NumberOption {
  label: string;
  value: number;
}

/**
 * Converts a hex color code to an RGBA string.
 * @param hex - The hex color code (e.g., "#ff0000" or "ff0000").
 * @param alpha - The alpha value (between 0 and 1). Defaults to 1.
 * @returns A string in the form "rgba(r, g, b, a)"
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Handle shorthand hex (e.g., "f00")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length !== 6) {
    throw new Error("Invalid hex color.");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getBGColor(
  status: string | null,
  requireColorCode: boolean,
): string {
  return status === "EVALUATION" && !requireColorCode
    ? "bg-color-evaluation-dark-blue"
    : status === "EVALUATION" && requireColorCode
      ? "#2377b6"
      : status === null && !requireColorCode
        ? "bg-color-sea-blue"
        : status === null && requireColorCode
          ? "#0c8ce9"
          : "";
}

export function getColor(
  status: string | null,
  requireColorCode: boolean,
): string {
  return status === "EVALUATION" && !requireColorCode
    ? "color-evaluation-dark-blue"
    : status === "EVALUATION" && requireColorCode
      ? "#2377b6"
      : status === null && !requireColorCode
        ? "color-sea-blue"
        : status === null && requireColorCode
          ? "#0c8ce9"
          : "";
}

export const allPagesPath = [
  "/dashboard",
  "/department-dashboard-summary",
  "/vehicle-tracking",
  "/staff-tracking",
  "/sectors",
  "/projects",
  "/super-group",
  "/attribute-groups",
  "/attributes",
  "/users",
  "/roles",
  "/rights",
  "/vehicles",
  "/drivers",
  "/visits",
  "/user-projects",
  "/visits-scheduled",
  "/visit-plans",
  "/visits-new",
  "/dashboard-director",
  "/dashboard-deputy-director",
  "/dashboard-dg",
  "/dashboard-officer",
  "/dashboard-it",
  "/dashboard-to",
  "/project-details-dashboard",
  "/project-details-dashboard/:path*",
  "/feedback",
  "/dashboard-attendance",
  "/dashboard-attendance/:path*",
  "/report-history",
  "/departments",
  "/report-analysis",
  "/report-analysis/list",
  "/new-visit-plan",
  "/process",
  "/projects-live-view/:path*",
  "/charts",
  "/pc-iv-report-history/:path",
  "/director-reports",
  "/project-document-names",
  "/pc-iv-review/:path",
  "/pc-iv-attached-review/:path",
  "/pc-iv-referback-review/:path",
];

// for new-visit-plan starts

/**
 * Converts a date to local date string (YYYY-MM-DD) without timezone offset
 * This prevents the "day behind" issue when copying dates
 */
export const toLocalDateString = (date: Date | string | null): string => {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);

  // Check if date is valid
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Creates a Date object from YYYY-MM-DD string at local midnight
 * Prevents timezone conversion issues
 */
export const fromLocalDateString = (dateString: string): Date | null => {
  if (!dateString || !isValidDate(dateString)) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  // Create date at local midnight (not UTC midnight)
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

/**
 * Converts ISO string to local date string
 */
export const isoToLocalDateString = (isoString: string): string => {
  if (!isoString) return "";

  const date = new Date(isoString);
  return toLocalDateString(date);
};

/**
 * Enhanced date validation
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;

  // Check format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// for new-visit-plan ends

export type Column<T> = {
  label: string;
  value?: keyof T;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

// Generic PDF export method
export interface PdfColumn {
  label: string;
  value: string;
}

export const exportDataToPDF = (
  columns: PdfColumn[],
  rows: any[],
  filename: string,
  orientation: "portrait" | "landscape" = "portrait",
) => {
  const doc = new jsPDF({ orientation });

  doc.setFontSize(14);
  doc.text(filename.replace(".pdf", ""), 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => row[c.value])),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [19, 66, 115] },
  });

  doc.save(filename);
};

export function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export const booleanOptions: OptionType[] = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
];

export const exportDataToPDFNEW = (
  headers: string[],
  rows: any[],
  filename: string,
  beforeTable?: {
    headers: string[];
    rows: any[];
  },
  afterTable?: {
    headers: string[];
    rows: any[];
  },
  orientation: "portrait" | "landscape" = "portrait",
) => {
  const doc = new jsPDF({ orientation });

  doc.setFontSize(14);
  doc.text(filename.replace(".pdf", ""), 14, 15);

  let currentY = 25;

  // Patient Details
  if (beforeTable) {
    autoTable(doc, {
      startY: currentY,
      head: [beforeTable.headers],
      body: beforeTable.rows.map((row) =>
        beforeTable.headers.map((h) => row[h]),
      ),
      didParseCell: (data) => {
        if (data.column.index === 0) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Main Table
  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body: rows.map((row) => headers.map((h) => row[h])),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [65, 105, 225] },

    didParseCell: (data) => {
      const row = data.row.raw as string[];

      if (row?.[0] === "TOTAL") {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Summary Table
  if (afterTable) {
    autoTable(doc, {
      startY: currentY,
      head: [afterTable.headers],
      body: afterTable.rows.map((row) => afterTable.headers.map((h) => row[h])),
      didParseCell: (data) => {
        if (data.column.index === 0) {
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
  }

  doc.save(filename);
};

export const getSpiStatus = (spi: number) => {
  if (spi > 1) {
    return {
      message: "No Time Overrun",
      label: "SPI > 1",
      color: "#32b334",
    };
  }

  if (spi < 1) {
    return {
      message: "Time Overrun",
      label: "SPI < 1",
      color: "#A61C1C",
    };
  }

  return {
    message: "On Time",
    label: "SPI = 1",
    color: "#e8c00f",
  };
};

export const getCpiStatus = (cpi: number) => {
  if (cpi > 1) {
    return {
      message: "No Cost Overrun",
      label: "CPI > 1",
      color: "#32b334",
    };
  }

  if (cpi < 1) {
    return {
      message: "Cost Overrun",
      label: "CPI < 1",
      color: "#A61C1C",
    };
  }

  return {
    message: "On Cost",
    label: "CPI = 1",
    color: "#e8c00f",
  };
};
