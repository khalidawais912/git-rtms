"use client";

import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import { ReportTypeStatusEnum } from "@/app/dashboard/types/reportTypeStatus";
import { exportDataToPDF } from "@/app/utils";
import { exportDataToExcelDynamicColumn } from "@/app/utils/exportToExcel";
import { SubmittedReport } from "../list/components/List";

interface Props {
  data: SubmittedReport[];
  fileName: string;
}

export const getColumns = (fileName: string) => [
  { label: "GS No.", value: "gsNo" },
  { label: "Report Type", value: "reportType" },
  { label: "Officer Name", value: "officerName" }, //also include this "intiallyDesignation"
  { label: `${fileName} Date`, value: "submittedDate" },
  { label: "Project Name", value: "projectName" },
];

export const getIssuedColumns = () => [
  { label: "GS No.", value: "gsNo" },
  { label: "Report Type", value: "reportType" },
  { label: "Officer Name", value: "officerName" }, //also include this "intiallyDesignation"
  { label: `Submitted Date`, value: "submittedDate" },
  { label: `Issued Date`, value: "issuanceDate" },
  { label: "Project Name", value: "projectName" },
];

const DownloadWrapper = ({ data, fileName }: Props) => {
  const columns = getColumns(fileName);
  const columnsWithIssued = getIssuedColumns();
  // const headers = ["Sr No.", ...columns.map((c) => c.label)];

  const buildRows = () => {
    const rows = data.map((d, index) => ({
      srNo: index + 1,
      gsNo: d.gsNo,
      reportType: ReportTypeStatusEnum[d.reportType],
      officerName: `${d.intiallyUser} (${d.intiallyDesignation})`,
      submittedDate: new Date(d.submittedDate).toLocaleDateString(),
      ...(fileName === "Issued" && {
        issuanceDate: d.issuanceDate
          ? new Date(d.issuanceDate).toLocaleDateString()
          : "",
      }),
      projectName: d.projectName,
    }));

    // Add totals
    // const totals = calculateTotals(data);

    // rows.push({
    //   "Sr No.": "TOTAL",
    //   "Name of District": "",
    //   "Complaints Filed": totals.totalFiled,
    //   Disposal: totals.totalDisposal,
    //   "Percentage of Disposal (%)": totals.totalPercentage,
    //   "Pending Complaints": totals.totalPending,
    // });

    return rows;
  };

  const exportToExcel = () => {
    exportDataToExcelDynamicColumn(
      fileName === "Issued" ? columnsWithIssued : columns,
      buildRows(),
      `${fileName} - ${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  const exportToPDF = () => {
    exportDataToPDF(
      fileName === "Issued" ? columnsWithIssued : columns,
      buildRows(),
      `${fileName} - ${new Date().toLocaleDateString()}.pdf`,
    );
  };

  return (
    <DownloadDropDown onClickExcel={exportToExcel} onClickPdf={exportToPDF} />
  );
};

export default DownloadWrapper;
