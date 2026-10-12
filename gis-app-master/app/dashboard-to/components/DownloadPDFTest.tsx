// "use client";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";
// import Image from "next/image";
// import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
// import DownloadFile from "./DownloadFile";
// import MonitoringReportConverted from "./MonitoringReportConverted";

// // // Create styles for the PDF document
// // const styles = StyleSheet.create({
// //   page: {
// //     flexDirection: "column",
// //     padding: 30,
// //     fontSize: 12,
// //   },
// //   section: {
// //     margin: 10,
// //     padding: 10,
// //   },
// //   title: {
// //     fontSize: 20,
// //     textAlign: "center",
// //     color: "#00205f",
// //     marginBottom: 20,
// //   },
// //   image: {
// //     width: "75%",
// //     marginVertical: 15,
// //     alignSelf: "center",
// //   },
// //   table: {
// //     width: "auto",
// //     borderStyle: "solid",
// //     borderWidth: 1,
// //     borderColor: "#4bacc6",
// //     marginBottom: 10,
// //   },
// //   tableRow: {
// //     flexDirection: "row",
// //   },
// //   tableColHeader: {
// //     backgroundColor: "#4bacc6",
// //     fontWeight: "bold",
// //     padding: 5,
// //   },
// //   tableCol: {
// //     width: "50%",
// //     borderStyle: "solid",
// //     borderWidth: 1,
// //     borderColor: "#4bacc6",
// //     padding: 5,
// //   },
// //   textCenter: {
// //     textAlign: "center",
// //   },
// // });

// // // Create a PDF document component
// // const MyPDFDocument = () => (
// //   <Document>
// //     <Page style={styles.page}>
// //       <View style={styles.section}>
// //         <Text style={styles.text}>This is the content of your PDF!</Text>
// //       </View>
// //       <View style={styles.section}>
// //         <Text style={styles.text}>Add more sections or content as needed.</Text>
// //       </View>
// //     </Page>
// //   </Document>
// // );

// const DownloadPDFTest = () => {
//   return (
//     <>
//       <PDFDownloadLink
//         document={<MonitoringReportConverted />}
//         fileName="sample.pdf"
//         className="btn text-white rounded-pill shadow ps-3 pe-3 pt-1 pb-1"
//         style={{ fontSize: ".8rem", background: "rgba(255, 255, 255,.5)" }}
//       >
//         <>
//           <Image
//             src={downloadLineBlack}
//             alt="download"
//             width={20}
//             height={20}
//           />
//         </>
//       </PDFDownloadLink>
//     </>
//   );
// };

// export default DownloadPDFTest;
