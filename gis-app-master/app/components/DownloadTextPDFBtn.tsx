// import jsPDF from "jspdf";
// import Image from "next/image";
// import { useRef } from "react";
// import downloadLineBlack from "../../public/icons/downloadLineBlack.svg";
// import DownloadFile from "../projects/components/DownloadFile";
// import Button from "./Button";

// const DownloadTextPDFBtn = () => {
//   const componentRef = useRef<HTMLDivElement | null>(null);

//   const downloadPdf = () => {
//     const input = componentRef.current;

//     if (input) {
//       const clonedElement = input.cloneNode(true) as HTMLElement; // Clone the component
//       document.body.appendChild(clonedElement); // Temporarily append to DOM for rendering

//       const pdf = new jsPDF("p", "mm", "a4");

//       pdf.html(clonedElement, {
//         callback: function (pdf) {
//           pdf.save("download.pdf");

//           // Remove the cloned element from the DOM after PDF generation
//           document.body.removeChild(clonedElement);
//         },
//         x: 10,
//         y: 10,
//         html2canvas: {
//           scale: 1, // Adjust the scale factor if needed
//         },
//         width: 190, // A4 page width minus margins
//       });
//     }
//   };

//   return (
//     <>
//       <Button
//         className="btn text-white rounded-pill shadow ps-3 pe-3 pt-1 pb-1"
//         style={{ fontSize: ".8rem", background: "rgba(255, 255, 255,.5)" }}
//         onClick={downloadPdf}
//       >
//         <Image src={downloadLineBlack} alt="download" width={20} height={20} />
//       </Button>

//       {/* Hidden component */}
//       <div ref={componentRef} style={{ display: "none" }}>
//         <DownloadFile />
//       </div>
//     </>
//   );
// };

// export default DownloadTextPDFBtn;
