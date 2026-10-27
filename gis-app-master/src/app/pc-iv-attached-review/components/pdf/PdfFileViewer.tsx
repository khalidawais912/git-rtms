import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

const PdfFileViewer = () => {
  return (
    <PDFViewer>
      <MyDocument />
    </PDFViewer>
  );
};

export default PdfFileViewer;
