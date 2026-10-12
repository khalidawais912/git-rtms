// import React, { useEffect, useRef, useState } from "react";
// import ApexCharts, { ApexOptions } from "apexcharts";
// import { ProjectsList } from "./components/ProjectsTable/ProjectsTable";

// interface Props {
//   data: ProjectsList;
// }

// const SimplePieChart = ({ data }: Props) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const [series, setSeries] = useState<number[]>([]);
//   const [labels, setLabels] = useState<string[]>([]);
//   const [calculatedData, setCalculatedData] = useState<string[]>([]);

//   useEffect(() => {
//     const accumulativePc1Cost = data.groups
//       .find((group) => group.name.toLowerCase() === "project profile")
//       ?.attributes.find(
//         (attribute) => attribute.label.toLowerCase() === "pc-i cost"
//       )?.values[0].value;
//     // setCalculatedData(
//     //   financialAnalysis.attributes.slice(1, -2).map((attribute) => {
//     //     const value = parseFloat(attribute.values[0]?.value || "0");
//     //     const percentage = (value / accumulativePc1Cost) * 100; // Calculate percentage and fix to 2 decimal points
//     //     return `${Math.round(percentage)}%`;
//     //   })
//     // );
//     setCalculatedData(["30%", "70%"]);

//     // Initialize series and labels
//     const parsedSeries = financialAnalysis.attributes
//       .slice(1, -2)
//       .map((attribute) =>
//         Math.round(parseFloat(attribute.values[0]?.value || "0"))
//       );

//     const parsedLabels = financialAnalysis.attributes
//       .slice(1, -2)
//       .map((attribute) => attribute.label);

//     // setSeries(parsedSeries);
//     const oneThirdValue = Number(accumulativePc1Cost) / 3;
//     setSeries([
//       Math.round(oneThirdValue),
//       Math.round(oneThirdValue + oneThirdValue),
//     ]);
//     setLabels(parsedLabels);
//   }, [financialAnalysis, projectProfile]);

//   useEffect(() => {
//     // Render chart only when both series and labels are initialized
//     if (chartRef.current && series.length && labels.length) {
//       const chartOptions: ApexOptions = {
//         chart: {
//           type: "pie",
//         },
//         labels: ["Revenue Cost", "Capital Cost"],
//         colors: ["#4A90FB", "#6FE397"],
//         stroke: {
//           show: false,
//           width: 0,
//         },
//         legend: {
//           show: true, // Keep the legend visible if needed
//           // formatter: function (val, opts) {
//           //   return `${val}: ${opts.w.globals.series[opts.seriesIndex]}%`;
//           // },
//           position: "bottom", // Position legend at the bottom
//           onItemHover: {
//             highlightDataSeries: false, // Disable highlighting on hover
//           },
//           fontSize: "16px",
//           fontWeight: "500",
//         },
//         dataLabels: {
//           enabled: true, // Enable data labels on the chart slices
//           formatter: function (val, opts) {
//             return (
//               opts.w.globals.series[opts.seriesIndex].toString() +
//               `M, ${calculatedData[opts.seriesIndex]}`
//             );
//           },
//           style: {
//             fontSize: "18px",
//             colors: ["#fff"],
//           },
//           dropShadow: {
//             opacity: 0.3,
//           },
//         },
//         responsive: [
//           {
//             breakpoint: 2561,
//             options: {
//               chart: {
//                 width: 400,
//               },
//               legend: {
//                 fontSize: "16px",
//                 position: "bottom",
//               },
//             },
//           },
//           {
//             breakpoint: 1441,
//             options: {
//               chart: {
//                 width: 450,
//               },
//               legend: {
//                 fontSize: "16px",
//                 position: "bottom",
//               },
//             },
//           },
//           {
//             breakpoint: 1025,
//             options: {
//               chart: {
//                 width: 320,
//               },
//               legend: {
//                 fontSize: "10px",
//                 position: "bottom",
//               },
//             },
//           },
//           {
//             breakpoint: 769,
//             options: {
//               chart: {
//                 width: 500,
//               },
//               legend: {
//                 fontSize: "16px",
//                 position: "bottom",
//               },
//             },
//           },
//           {
//             breakpoint: 426,
//             options: {
//               chart: {
//                 width: 450,
//               },
//               legend: {
//                 fontSize: "16px",
//                 position: "bottom",
//               },
//             },
//           },
//           {
//             breakpoint: 321,
//             options: {
//               chart: {
//                 width: 350,
//               },
//               legend: {
//                 fontSize: "12px",
//                 position: "bottom",
//               },
//             },
//           },
//         ],
//       };

//       const chart = new ApexCharts(chartRef.current, {
//         series,
//         ...chartOptions,
//       });

//       chart.render();

//       // Cleanup the chart on component unmount
//       return () => {
//         chart.destroy();
//       };
//     }
//   }, [series, labels]);

//   return (
//     <div
//       className="col shadow-sm mb-2"
//       style={{
//         background: "#C6D9F1",
//         borderRadius: "15px",
//         fontSize: ".9rem",
//         height: "450px",
//       }}
//     >
//       <div className="row d-flex m-0">
//         <div
//           className="col pb-2 ms-3 me-3"
//           style={{ borderBottom: "1px dashed #97ABBD" }}
//         >
//           <div className="row d-flex">
//             <div className="col pt-2">
//               <p className="m-0 fw-bold" style={{ fontSize: "1.563rem" }}>
//                 Financial Progress
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="d-flex justify-content-center m-0">
//         <div className="col">
//           <div ref={chartRef}></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimplePieChart;
