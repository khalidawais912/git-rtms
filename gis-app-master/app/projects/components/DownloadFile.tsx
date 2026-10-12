import Image from "next/image";
import Picture1 from "../../../public/images/projectPdfFile/Picture1.jpg";
import Picture2 from "../../../public/images/projectPdfFile/Picture2.png";
import Picture3 from "../../../public/images/projectPdfFile/Picture3.jpg";
import Picture4 from "../../../public/images/projectPdfFile/Picture4.jpg";
import Picture5 from "../../../public/images/projectPdfFile/Picture5.jpg";
import Picture6 from "../../../public/images/projectPdfFile/Picture6.jpg";
import Picture7 from "../../../public/images/projectPdfFile/Picture7.jpg";

const DownloadFile = () => {
  const projectsTableData = [
    {
      columnHeading: "Objectives",
      columnData:
        "This road section is part of the Lahore Ring Road southern loop, which will facilitate the movement of traffic from Raiwind Road up to SL-4.",
    },
    { columnHeading: "GS NO.", columnData: "4898 (2022-23)" },
    { columnHeading: "Scheme No.", columnData: "01192354147" },
    { columnHeading: "Location", columnData: "Lahore" },
    { columnHeading: "ADP Sector", columnData: "Infrastructure Development" },
    { columnHeading: "Sub-Sector", columnData: "Roads" },
    {
      columnHeading: "Sponsoring Ministry/ Agency",
      columnData: "Communication & Works Department",
    },
    {
      columnHeading: "Execution Agency",
      columnData: "Lahore Ring Road Authority",
    },
    { columnHeading: "PC-I Cost", columnData: "Rs. 17,785.850 M" },
    { columnHeading: "Administrative Approval", columnData: "01-08-2023" },
    { columnHeading: "Expenditure", columnData: "Rs. 6,000.00 M" },
    { columnHeading: "Planned Start", columnData: "Date	01-08-2023" },
    { columnHeading: "Planned End Date", columnData: "01-02-2024" },
    { columnHeading: "Actual Start Date", columnData: "21-08-2023" },
    { columnHeading: "Gestation Period", columnData: "06 Months" },
    { columnHeading: "Approving Authority", columnData: "PDWP" },
    {
      columnHeading: "Contractor",
      columnData: "M/s Frontier Works Organization",
    },
    {
      columnHeading: "Design Engineer",
      columnData: "M/s National Engineering Services Pakistan (NESPEK)",
    },
    {
      columnHeading: "Resident Supervision",
      columnData: "M/S National Engineering Services Pakistan (NESPAK)",
    },
  ];

  const designAndScopeData = [
    {
      tablHeading: "Design Speed",
      tableData1: "120 KPH",
      tableData2: "Metaled width",
      tableData3: "10.8 m",
    },
    {
      tablHeading: "Outer Shoulder",
      tableData1: "3.0 m",
      tableData2: "Central Median",
      tableData3: "0.6 m",
    },

    {
      tablHeading: "Inner Shoulder",
      tableData1: "3.0 m",
      tableData2: "Bridges (Main Carriageway)",
      tableData3: "06 No’s",
    },
    {
      tablHeading: "Asphalt Base Course",
      tableData1: "15 cm",
      tableData2: "Bridges (Service Road)",
      tableData3: "03 No’s",
    },
    {
      tablHeading: "Asphalt Wearing Course",
      tableData1: "5 cm",
      tableData2: "Electric Duct",
      tableData3: "06 No’s",
    },
    {
      tablHeading: "Water Bound Macadam",
      tableData1: "25 cm",
      tableData2: "Pipe Culverts",
      tableData3: "14 No’s",
    },
    {
      tablHeading: "Subbase Course",
      tableData1: "20 cm",
      tableData2: "Underpasses",
      tableData3: "04 No’s",
    },
    { tablHeading: "Side Drain", tableData1: "16 Km" },
  ];

  const majorDeliverables = [
    {
      tableHeading: "Road work",
      qty: "8",
      cost: "11,402.814",
      progress: [
        {
          field: "Formation of Embankment",
          value: "96%",
        },
        {
          field: "Laying of Subbase",
          value: "96%",
        },

        {
          field: "Laying of WBM",
          value: "91%",
        },

        {
          field: "Laying ABC (1st Layer] ",
          value: "89%",
        },
        {
          field: "Laying of Asphalt wearing course",
          value: "0%",
        },
        {
          field: "NJB",
          value: "61%",
        },
      ],
    },
    {
      tableHeading: "Road Structure",
      qty: "8",
      cost: "2,915.341",
      progress: [
        {
          field: "Bridges (6)",
          value: "96%",
        },
        {
          field: "Culverts (14)",
          value: "100%",
        },

        {
          field: "Underpasses (5)",
          value: "94%",
        },

        {
          field: "Side Drains",
          value: "02%",
        },

        {
          field: "Toll Plaza Structure (5)",
          value: "30%",
        },
      ],
    },
    {
      tableHeading: "Ancillary Work",
      qty: "---",
      cost: "369.556",
      progress: [
        {
          field: "Yet to Start.",
          value: "",
        },
      ],
    },
    {
      tableHeading: "General Items",
      qty: "---",
      cost: "19.800",
      progress: [
        {
          field: "Soil Investigation",
          value: "100%",
        },
        {
          field: "EIA Report",
          value: "100%",
        },
        {
          field: "SNGPL NOC",
          value: "100%",
        },
      ],
    },
    {
      tableHeading: "Electric Work",
      qty: "---",
      cost: "325.60",
      progress: [
        {
          field: "Yet to Start.",
          value: "",
        },
      ],
    },
    {
      tableHeading: "Toll Plaza & Weigh Station",
      qty: "---",
      cost: "257.216",
      progress: [
        {
          field: "Ongoing",
          value: "",
        },
      ],
    },
    {
      tableHeading: "Landscaping & Hort. Charges 1%",
      qty: "---",
      cost: "152.903",
      progress: [
        {
          field: "Yet to Start.",
          value: "",
        },
      ],
    },
    {
      tableHeading: "3% Contingency",
      qty: "---",
      cost: "458.709",
      progress: [
        {
          field: "Ongoing",
          value: "",
        },
      ],
    },
    {
      tableHeading: "1% Consultancy Charges",
      qty: "---",
      cost: "152.903",
      progress: [
        {
          field: "NESPAK Consultant",
          value: "",
        },
      ],
    },

    {
      tableHeading: "Consultant Supervision 2%",
      qty: "---",
      cost: "305.807",
      progress: [
        {
          field: "NESPAK Consultant",
          value: "",
        },
      ],
    },

    {
      tableHeading: "PST @16% of Consultancy",
      qty: "---",
      cost: "73.394",
      progress: [
        {
          field: "---",
          value: "",
        },
      ],
    },
    {
      tableHeading: "5% PST",
      qty: "---",
      cost: "764.516",
      progress: [
        {
          field: "Partially Paid",
          value: "",
        },
      ],
    },
    {
      tableHeading: "IT (P.S)",
      qty: "---",
      cost: "600.00",
      progress: [
        {
          field: "Yet to Start",
          value: "",
        },
      ],
    },
  ];

  const ongoingActivities = [
    {
      tableHeading: "A.",
      tableData: "Road Work",
    },
    {
      tableHeading: "Earth Filling, Compaction Embankment",
      tableData:
        "Laying and compaction of embankment earthwork material is in progress. Out of 3,801,008 m3, around 4.2%, i.e., 1,60,000 m3 earthwork material has been laid.",
    },
    {
      tableHeading: "Stacking of Material",
      tableData:
        "Material Stacking is in progress for the construction of the subbase course and base course.",
    },
    {
      tableHeading: "B.",
      tableData: "Road Structures",
    },
    {
      tableHeading: "Bridges",
      tableData: (
        <ul>
          <li>
            Bridge-01 (RD 58+885): 22 out of 32 concrete piles are cast. Steel
            fabrication for the prestressed girders is in progress. Wet Rotatory
            Boring for the pile is in progress.
          </li>
          <li>Bridge-02 (RD 59+195): No Activity observed.</li>
          <li>
            Bridge-03 (RD 60+147): 19 out of 24 concrete piles are completed.
            Steel fabrication for the pile cap is in progress. Wet Rotatory
            Boring for the pile is in progress.
          </li>
          <li>Bridge-04 (RD 62+442): Wet Rotatory Boring was in progress.</li>
          <li>
            Bridge-05 (RD 63+362): 11 out of 32 concrete piles are constructed.
            Steel fixing for the pile is in progress. Wet Rotatory Boring for
            the pile is in progress.
          </li>
          <li>
            Bridge-06 (RD 63+760): 28 out of 42 concrete piles are cast. Steel
            fixing for the pile is in progress. Wet Rotatory Boring for the pile
            is in progress.
          </li>
        </ul>
      ),
    },
    {
      tableHeading: "Underpasses/Subways",
      tableData: (
        <ul>
          <li>
            Excavation for the construction of the Underpass-1 (RD 57+308),
            Underpass-2 (RD 57+990), Underpass-3 (RD 60+710) is completed. Lean
            was laid for two underpasses
          </li>
        </ul>
      ),
    },
    {
      tableHeading: "Culverts",
      tableData:
        "Excavation for the construction of the 09 Culverts was completed.",
    },
  ];

  const earnedValueAnalysis = [
    {
      tableHeading: "Project Cost (M)",
      tableData1: "17,785.9",
      tableData2: "Approved Cost",
    },
    {
      tableHeading: "Percent Completed [Physical]",
      tableData1: "9%",
      tableData2: "Current physical progress",
    },
    {
      tableHeading: "Planned Value or BCWS",
      tableData1: "5,335.8",
      tableData2: "Budgeted Cost of Work Scheduled",
    },
    {
      tableHeading: "Earned Value or BCWP",
      tableData1: "1.600.7",
      tableData2: "Budgeted Cost of Work Performed",
    },
    {
      tableHeading: "Actual cost of work performed (ACWP)",
      tableData1: "2600.0",
      tableData2: "Current financial progress",
    },
    {
      tableHeading: "Scheduled Variance (SV)",
      tableData1: "-3735.0",
      tableData2: "---",
    },
    {
      tableHeading: "Cost Variance (CV)",
      tableData1: "-999.3",
      tableData2: "---",
    },
    {
      tableHeading: "Schedule Performance Index (SPI)",
      tableData1: "0.3",
      tableData2: "Project progress is behind schedule as SPI is less than 1.",
    },
    {
      tableHeading: "Cost Performance Index (CPI)",
      tableData1: "0.6",
      tableData2: "Over Budget if CPI<1",
    },
    {
      tableHeading: "Estimate Cost at Completion (m)",
      tableData1: "18785.1",
      tableData2: "The project is predicted to exceed its original cost.",
    },
    {
      tableHeading: "Estimate Cost to Complete (m)",
      tableData1: "16185.1",
      tableData2:
        "Further funds will be required for completion at the current pace of work & funds utilization.<1",
    },
    {
      tableHeading: "Earned Schedule (ES)",
      tableData1: "1",
      tableData2:
        "Equivalent progress of only 1 Month achieved to date instead of 1.9 months.",
    },
    {
      tableHeading: "Time Variance (TV)",
      tableData1: "-0.9",
      tableData2: "Difference between time passed & earned schedule<1",
    },
    {
      tableHeading: "Time Estimate at Completion (TEAC)",
      tableData1: "12",
      tableData2:
        "12 months will be required to complete this project at the current pace",
    },
  ];

  const observationsAndRecommendations = [
    {
      tableHeading: "Observation 1 (Slow progress)",
      tableData: (
        <p>
          Administrative Approval (AA) of the project was issued on 01-08-2023
          at a cost of Rs. 17,785.849 M with a gestation period of 6 months
          expiring on 01-02-2024. However, the work was awarded to the
          contractor on 21-08-23. Also, it was observed at the time of the visit
          that only 9% of progress could be achieved in 01 month and 25 days,
          against a planned progress of 30%, showing that the progress is
          lagging by 21%. The schedule performance index of the project, is less
          than 1, depicting a slow pace of work. <br />
          <span className="fw-bold">Recommendation:</span> The Executing agency
          may push the contractor to expedite work by mobilizing adequate
          resources.
        </p>
      ),
    },
    {
      tableHeading: "Observation 2 (Project Cost Overrun)",
      tableData: (
        <p>
          The Cost Performance Index of the project, calculated from earned
          value analysis, is less than 1 which indicates that at the current
          pace and financial utilization, the project may face cost overrun.
          <br />
          <span className="fw-bold">Recommendation:</span> The Executing
          Department may take appropriate measures to ensure completion of the
          project within approved cost.
        </p>
      ),
    },
    {
      tableHeading: "Observation 3 (Pile Load Test)",
      tableData: (
        <p>
          Pile load test was not performed before constructing the actual
          concrete pile of any bridge at the site. Non-conformance with the
          standard testing raises concerns about the structural integrity and
          safety of the foundation.
          <br />
          <span className="fw-bold">Recommendation:</span> The Executing
          department must ensure the detailed load pile testing to confirm the
          capacity, integrity and settlement as per the design requirement of
          Bridge Foundation.
        </p>
      ),
    },
    {
      tableHeading: "Observation 4 (Inappropriate Embankment Material)",
      tableData: (
        <p>
          It was observed that at some portions of the site debris of the
          dismantled buildings was spread over sub grade of the embankment which
          may cause poor compaction.{" "}
          <span className="fw-bold">[Figure 01]</span>
          <br />
          <span className="fw-bold">Recommendation:</span> The Executing
          department should ensure the removal of debris and usage of engineered
          approved borrowed material for earthwork.
        </p>
      ),
    },
    {
      tableHeading: "Observation 5 (Delay in shifting of utilities)",
      tableData: (
        <p>
          Shifting of the electric lines and poles is still pending.{" "}
          <span className="fw-bold">[Figure 02]</span>
          <br />
          <span className="fw-bold">Recommendation:</span> Timely Shifting of
          utilities may be ensured to avoid further delay.
        </p>
      ),
    },
    {
      tableHeading: "Observation 6 (Non-barricaded Sites)",
      tableData: (
        <p>
          Bridge construction sites in the urban areas were non-barricaded
          <span className="fw-bold">[Figure 03]</span> and warning signs were
          not displayed.
          <br />
          <span className="fw-bold">Recommendation:</span> Site barricading and
          the hazard prevention sign may be displayed to avoid untoward
          incidents.
        </p>
      ),
    },
    {
      tableHeading: "Observation 7 (Field laboratories)",
      tableData: (
        <p>
          The contractor’s site laboratory has been established at a distance of
          around 2 km from the site. Moreover, the laboratory is not well
          equipped, which may compromise the quality of construction.{" "}
          <span className="fw-bold">[Figure 04]</span>
          <br />
          <span className="fw-bold">Recommendation:</span> The Executing
          Department to ensure establishment of laboratory at site along with
          availability of necessary equipment for comprehensive testing of
          materials.
        </p>
      ),
    },
    {
      tableHeading: "Observation 8 (Non-provision of PPEs)",
      tableData: (
        <p>
          It was observed that the workers were not provided personal protection
          equipment by the contractor{" "}
          <span className="fw-bold">[Figure 05].</span>
          <br />
          <span className="fw-bold">Recommendation:</span> Personal protection
          equipment should be provided to the workers.
        </p>
      ),
    },
  ];

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col-12">
            <div className="col mb-5">
              <div className="row d-flex justify-content-start">
                <div className="col-9 border-dark border-2">
                  <div className="row d-flex">
                    <div className="col"></div>
                    <div className="col">
                      <p
                        className="fs-4 fw-bold text-center pt-5"
                        style={{ color: "#00205f" }}
                      >
                        MONITORING REPORT
                      </p>
                    </div>
                    <div className="col d-flex justify-content-end">
                      <div
                        className="col-6 text-center m-3 ps-3 pe-3 pt-2"
                        style={{
                          border: "2px solid #000",
                          borderRadius: "10px",
                          background: "#FFFF00",
                          fontStyle: "italic",
                        }}
                      >
                        <p className="fw-bold">Needs Consideration</p>
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-center">
                    <div className="col-10">
                      <p
                        className="fs-5 fw-bold text-center pt-5"
                        style={{ color: "#00205f" }}
                      >
                        Lahore Ring Road - Southern Loop (SL-3) Construction of
                        Road from Raiwind Road up to Multan Road
                      </p>
                    </div>
                  </div>

                  <h5 className="text-center pt-5 fw-bold">September 2023</h5>
                  <div className="text-center pb-4">
                    <Image
                      src={Picture1}
                      className="rounded"
                      alt="..."
                      style={{ width: "75%", height: "100%" }}
                    />
                  </div>
                  <div className="text-center pt-5 mt-5">
                    <Image
                      src={Picture2}
                      className="rounded"
                      alt="..."
                      style={{ width: "20%", height: "10%" }}
                    />
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-8">
                      <h4
                        className="text-center pt-5"
                        style={{ color: "#0070C0" }}
                      >
                        Directorate General (Monitoring & Evaluation) Planning
                        and Development Board <br /> Government of the Punjab
                      </h4>
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center mb-5">
                    <div className="col-9">
                      <h5 className="text-center pt-5 fw-bold">
                        4th Floor, 65- Trade Centre Block, Ayub Chowk, Johar
                        Town, Lahore
                      </h5>
                      <h5 className="text-center fw-bold">
                        042-99233177-91, <a href="#">info@dgmepunjab.gov.pk</a>
                      </h5>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "40px" }}></div>
              </div>
            </div>

            {/* <!--Table 01 Start--> */}
            <div className="col mb-5">
              <div className="row d-flex justify-content-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <h4 className="fw-bold" style={{ color: "#0070C0" }}>
                    1. Project Profile
                  </h4>
                  <h5 className="text-center pt-2 fw-bold">Table 1</h5>
                  <table className="table table-hover table-bordered border-light">
                    <thead className="table-primary"></thead>
                    <tbody className="">
                      <tr>
                        <th
                          scope="col"
                          className="text-center text-white bg-color-matte-blue"
                          colSpan={2}
                        >
                          Lahore Ring Road - Southern Loop (SL-3) Construction
                          of Road from Raiwind Road up to Multan Road
                        </th>
                      </tr>
                      {projectsTableData.map((d, i) => (
                        <tr key={i}>
                          <th scope="col" style={{ background: "#4bacc6" }}>
                            {d.columnHeading}
                          </th>
                          <th
                            scope="col"
                            className="fw-normal"
                            style={{
                              background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                            }}
                          >
                            {d.columnData}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* <!--Table 01 End--> */}
            <div style={{ marginBottom: "300px" }}></div>

            {/* <!--Table 02 Start--> */}
            <div className="col mb-5">
              <div className="row d-flex flex-column justify-content-start align-items-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <>
                    <h4 className="fw-bold" style={{ color: "#0070C0" }}>
                      2. Design & Scope
                    </h4>
                    <h5 className="text-center fw-bold">Table 2</h5>
                    <table className="table table-hover table-bordered border-light">
                      <tbody>
                        <tr>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Quantity
                          </th>
                        </tr>
                        {designAndScopeData.map((d, i) => (
                          <tr key={i}>
                            <th
                              scope="col"
                              className="text-center fw-bold"
                              style={{ background: "#4bacc6" }}
                            >
                              {d.tablHeading}
                            </th>
                            <th
                              scope="col"
                              className="fw-normal text-center"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.tableData1}
                            </th>
                            <th
                              scope="col"
                              className="text-center fw-bold"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.tableData2}
                            </th>
                            <th
                              scope="col"
                              className="fw-normal text-center"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.tableData3}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                  {/* <!--Table 02 End--> */}
                  {/* <!--Table 03 Start--> */}
                  <>
                    <h4 className="fw-bold pt-3" style={{ color: "#0070C0" }}>
                      3. Major Deliverables{" "}
                    </h4>
                    <h5 className="text-center pt-3 fw-bold">Table 2</h5>
                    <table className="table table-hover table-bordered border-light">
                      <thead className="table-primary"></thead>
                      <tbody className="">
                        <tr>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            PC-I Components
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Qty. (Km)
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Cost (Rs. M)
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Progress
                          </th>
                        </tr>
                        {majorDeliverables.map((d, i) => (
                          <tr key={i}>
                            <th
                              scope="col"
                              className="text-center align-middle"
                              style={{ background: "#4bacc6" }}
                            >
                              {d.tableHeading}
                            </th>
                            <th
                              scope="col"
                              className="fw-normal text-center align-middle"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.qty}
                            </th>
                            <th
                              scope="col"
                              className="text-center align-middle fw-normal"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.cost}
                            </th>
                            <th
                              scope="col"
                              className="fw-normal text-danger"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              <ul style={{ listStyleType: "none" }}>
                                {d.progress.map((p, j) => (
                                  <li
                                    key={i}
                                    className="row d-flex justify-content-end m-0"
                                  >
                                    <div
                                      className={`col p-0 ${
                                        (i === 3 && j == 1) ||
                                        i === 7 ||
                                        i === 8 ||
                                        i === 9 ||
                                        i === 10 ||
                                        i === 11
                                          ? "text-dark"
                                          : "text-danger"
                                      }`}
                                      style={{
                                        whiteSpace: "nowrap",
                                        background:
                                          i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                                      }}
                                    >
                                      {p.field}
                                    </div>
                                    <div
                                      className="col text-end"
                                      style={{
                                        background:
                                          i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                                      }}
                                    >
                                      {p.value}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                  {/* <!--Table 03 End--> */}
                  <>
                    {/* <!--Table 04 Start--> */}
                    <h4
                      className="fw-bold pt-5 pb-5"
                      style={{ color: "#0070C0" }}
                    >
                      4. Ongoing Activities{" "}
                    </h4>
                    <table className="table table-hover table-bordered border-light">
                      <tbody>
                        <tr>
                          <th
                            scope="col"
                            className="text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Component
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            {" "}
                            Progress
                          </th>
                        </tr>
                        {ongoingActivities.map((d, i) => (
                          <tr key={i}>
                            <th
                              scope="col"
                              className={`${
                                i === 0 || i === 3 ? "text-center" : ""
                              }`}
                              style={{ background: "#4bacc6" }}
                            >
                              {d.tableHeading}
                            </th>
                            <th
                              scope="col"
                              className={`${
                                i === 0 || i === 3 ? "text-center" : "fw-normal"
                              }`}
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.tableData}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <table
                      className="table table-hover table-bordered border-light"
                      style={{ backgroundColor: "yellow" }}
                    >
                      <tbody>
                        <tr>
                          <th className="pt-3" style={{ whiteSpace: "nowrap" }}>
                            <span></span>Progress Analysis
                          </th>
                          <th>Planned progress 32%</th>
                          <th>Achieved progress. 11 %</th>
                          <th>Financial progress 16%</th>
                          <th>Lag in physical progress -21%</th>
                          <th>Lag in financial progress 5%</th>
                        </tr>
                      </tbody>
                    </table>

                    {/* <!--Table 04 End--> */}
                  </>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "190px" }}></div>

            {/* <!--Table 05 Start--> */}
            <div className="col mb-5">
              <div className="row d-flex flex-column justify-content-start align-items-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <>
                    <h4 className="fw-bold pt-1" style={{ color: "#0070C0" }}>
                      5. Earned Value Analysis
                    </h4>
                    <h5 className="text-center fw-bold">Table 5</h5>
                    <table className="table table-hover table-bordered border-light">
                      <tbody className="">
                        <tr>
                          <th
                            scope="col"
                            colSpan={2}
                            className="text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Earned Value Analysis/Parameters
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            {" "}
                            Remarks
                          </th>
                        </tr>
                        {earnedValueAnalysis.map((d, i) => (
                          <tr key={i}>
                            <th scope="col" style={{ background: "#4bacc6" }}>
                              {d.tableHeading}
                            </th>
                            <th
                              scope="col"
                              className="fw-normal text-center"
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.tableData1}
                            </th>
                            <th
                              scope="col"
                              className={`fw-normal text-center ${
                                i > 6 ? "text-danger" : ""
                              }`}
                              style={{
                                background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                              }}
                            >
                              {d.tableData2}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <table
                      className="table table-hover table-bordered border-dark"
                      style={{ background: "#FF0000" }}
                    >
                      <tbody>
                        <tr>
                          <th className="text-center text-white p-5">
                            <p className="mt-2">Alert:</p>
                          </th>
                          <th className="text-white p-5 ps-1 pe-1">
                            Earned Value Analysis shows that the project would
                            face time and cost overrun if the same pace of work
                            persists.
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </>
                  {/* <!--Table 05 End--> */}
                  <>
                    {/* <!--Table 06 Start--> */}

                    <h4 className="fw-bold" style={{ color: "#0070C0" }}>
                      6. Financial Analysis
                    </h4>
                    <h5 className="text-center fw-bold">Table 6</h5>
                    <table className="table table-hover table-bordered border-light">
                      <tbody className="">
                        <tr>
                          <th
                            scope="col"
                            rowSpan={2}
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Fiscal Year
                          </th>
                          <th
                            scope="col"
                            rowSpan={2}
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Allocation (M)
                          </th>
                          <th
                            scope="col"
                            rowSpan={2}
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Releases (M)
                          </th>
                          <th
                            scope="col"
                            rowSpan={2}
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            Utilization (M)
                          </th>
                          <th
                            scope="col"
                            className="text-center text-white"
                            style={{ background: "#4bacc6" }}
                            colSpan={6}
                          >
                            Financial Efficiency
                          </th>
                        </tr>
                        <tr>
                          <th
                            scope="col"
                            className="fw-bold table-primary text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            Release/Allocation
                          </th>
                          <th
                            scope="col"
                            className="fw-bold table-primary text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            Utilization/Releases
                          </th>
                        </tr>
                        <tr>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#4bacc6" }}
                          >
                            2023-24
                          </th>
                          <th
                            scope="col"
                            className="fw-normal text-center"
                            style={{ background: "#DAEEF3" }}
                          >
                            6,000
                          </th>
                          <th
                            scope="col"
                            className="fw-normal text-center"
                            style={{ background: "#DAEEF3" }}
                          >
                            6,000
                          </th>
                          <th
                            scope="col"
                            className="fw-normal text-center"
                            style={{ background: "#DAEEF3" }}
                          >
                            2,900
                          </th>
                          <th
                            scope="col"
                            className="fw-normal text-center"
                            style={{ background: "#DAEEF3" }}
                          >
                            100 %
                          </th>
                          <th
                            scope="col"
                            className="fw-normal text-center"
                            style={{ background: "#DAEEF3" }}
                          >
                            48 %
                          </th>
                        </tr>
                        <tr>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#4bacc6" }}
                          >
                            Total
                          </th>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            6,000
                          </th>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            6,000
                          </th>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            2,900
                          </th>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            100 %
                          </th>
                          <th
                            scope="col"
                            className="text-center"
                            style={{ background: "#B6DDE8" }}
                          >
                            48 %
                          </th>
                        </tr>
                      </tbody>
                    </table>

                    {/* <!--Table 06 End--> */}
                  </>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "110px" }}></div>

            {/* <!--Table 07 Start--> */}
            <div className="col mb-5">
              <div className="row d-flex justify-content-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <h4
                    className="fw-bold pt-1 pb-1"
                    style={{ color: "#0070C0" }}
                  >
                    7. Observations & Recommendations
                  </h4>
                  <table className="table table-hover table-bordered border-light">
                    <tbody>
                      <tr>
                        <th
                          scope="col"
                          className="text-center"
                          style={{ background: "#4bacc6" }}
                        >
                          Observations
                        </th>
                        <th scope="col" style={{ background: "#4bacc6" }}>
                          Description
                        </th>
                      </tr>
                      {observationsAndRecommendations.map((d, i) => (
                        <tr key={i}>
                          <th
                            scope="col"
                            className="text-white"
                            style={{ background: "#4bacc6" }}
                          >
                            {d.tableHeading}
                          </th>
                          <th
                            scope="col"
                            className="fw-normal"
                            style={{
                              background: i % 2 === 0 ? "#B6DDE8" : "#DAEEF3",
                            }}
                          >
                            {d.tableData}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* <!--Table 07 End--> */}

            <div style={{ marginBottom: "100px" }}></div>

            {/* <!--Photo Gallery--> */}
            <div className="col mb-5">
              <div className="row d-flex justify-content-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <h4
                    className="fw-bold pt-1 pb-2"
                    style={{ color: "#0070C0" }}
                  >
                    8. Photo Gallery
                  </h4>
                  <div className="text-center border border-dark ps-2 pe-2">
                    <Image
                      src={Picture3}
                      className="rounded"
                      alt="..."
                      style={{ width: "100%", height: "100%" }}
                    />
                    <h5 className="fw-bold mt-2">
                      Figure 01{" "}
                      <span className="fw-normal">
                        [Dismantled Material laid for embankment formation]
                      </span>
                    </h5>
                  </div>
                  <div className="text-center border border-dark ps-2 pe-2 mb-5">
                    <Image
                      src={Picture4}
                      className="rounded"
                      alt="..."
                      style={{ width: "100%", height: "100%" }}
                    />
                    <h5 className="fw-bold mt-2">
                      Figure 02{" "}
                      <span className="fw-normal">
                        [Shifting of the Utility lines was remaining]
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="col mb-5">
              <div className="row d-flex justify-content-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <div className="text-center border border-dark ps-2 pe-2">
                    <Image
                      src={Picture5}
                      className="rounded"
                      alt="..."
                      style={{ width: "100%", height: "100%" }}
                    />
                    <h5 className="fw-bold mt-2 mb-3">
                      Figure 03{" "}
                      <span className="fw-normal">
                        [Non-Barricaded Bridge Construction site Bahria Town]
                      </span>
                    </h5>
                  </div>
                  <div className="text-center border border-dark ps-2 pe-2">
                    <Image
                      src={Picture6}
                      className="rounded"
                      alt="..."
                      style={{ width: "100%", height: "100%" }}
                    />
                    <h5 className="fw-bold mt-2 mb-4">
                      Figure 04{" "}
                      <span className="fw-normal">
                        [Missing Essential Apparatus at Site Laboratory]
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="col mb-5">
              <div className="row d-flex justify-content-start">
                <div className="col-9 border-2 border-dark p-5 pt-3">
                  <div className="text-center border border-dark ps-2 pe-2 mb-5">
                    <Image
                      src={Picture7}
                      className="rounded"
                      alt="..."
                      style={{ width: "100%", height: "100%" }}
                    />
                    <h5 className="fw-bold mt-1 mb-3">
                      Figure 05{" "}
                      <span className="fw-normal">
                        [Workers without Personal Protection Equipment]
                      </span>
                    </h5>
                  </div>
                  <div className="row d-flex justify-content-end">
                    <div className="col-3 mt-5 text-center pt-5">
                      <p>Engr. Arif Ahsan Assistant Director (Buildings)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadFile;
