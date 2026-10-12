import { Asap } from "next/font/google";
import { useEffect } from "react";
import { Groups } from "./ProjectDetailsDashboard";

const asap = Asap({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Props {
  majorDeliverables: Groups;
}

const WBSReport = ({ majorDeliverables }: Props) => {
  useEffect(() => {
    console.log("majorDeliverables:", majorDeliverables);
  }, [majorDeliverables]);

  return (
    <>
      <div
        className={`col p-2 mb-3 mx-2 ${asap.className}`}
        style={{ background: "#C6D9F1", borderRadius: "17px" }}
      >
        <p className="m-0 fw-bold fs26px ms-3 mt-2">Work Breakdown Structure</p>
        {majorDeliverables.group.length > 0 ? (
          <>
            <div className="row d-flex justify-content-center m-0 mb-5">
              <div className="col text-center text-white">
                <div
                  className="col px-4 py-2 d-inline-block shadow"
                  style={{
                    // "linear-gradient(to bottom right, #14BAE3 , #13B1E6, #11AADF,#0B98C5)",
                    background:
                      "linear-gradient(to bottom right, #1090b0 , #0a4582)",
                    borderRadius: "8px",
                    border: "0px",
                  }}
                >
                  <p className="fs17px fw-bold m-0">{majorDeliverables.name}</p>
                  <p className="fs24px fw-bold m-0">
                    {majorDeliverables.group.reduce((sum, g) => {
                      const groupTotal = g.attributes
                        .filter(
                          (attribute) =>
                            attribute.attributeId !== 68 &&
                            attribute.attributeId !== 69
                        )
                        .reduce((attrSum, attribute) => {
                          const value = attribute.values[0]?.value; // Raw value
                          const numericValue = Math.round(parseFloat(value)); // Convert to number
                          return (
                            attrSum + (isNaN(numericValue) ? 0 : numericValue)
                          ); // Add valid numbers
                        }, 0);
                      return sum + groupTotal; // Add group total to the sum
                    }, 0)}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className="row d-flex m-0">
              {majorDeliverables.group.map((g) => (
                <div className="col" key={g.id}>
                  <div className="col" style={{ marginBottom: "60px" }}>
                    <div className="row d-flex text-white m-0">
                      <div className="col text-center">
                        <div
                          className="col shadow px-3"
                          style={{
                            background: "rgba(12, 93, 233, 0.5)",
                            borderTopRightRadius: "50px",
                            borderBottomRightRadius: "50px",
                            border: "1px solid rgba(12, 123, 233, 0.4)",
                          }}
                        >
                          <div className="col p-2">
                            <p className="fs17px fw-bold m-0 text-wrap text-center text-break">
                              {g.name}
                            </p>
                          </div>
                          <div className="row d-flex m-0">
                            <div className="col">
                              <p className="fs24px fw-bold m-0 mt-3 text-end">
                                {g.attributes.reduce(
                                  (sum, attribute) =>
                                    sum + (attribute.weightage || 0),
                                  0
                                )}
                                %
                              </p>
                            </div>
                            <div className="col pb-2">
                              <div
                                className="rounded-circle fw-bold fs20px text-white text-center ms-2 me-2 my-auto text-wrap text-break"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  background:
                                    "linear-gradient(to bottom right, #001F3F, #09417a)",
                                }}
                              >
                                <p className="py-4">
                                  {g.attributes
                                    .filter(
                                      (attribute) =>
                                        attribute.attributeId !== 68 &&
                                        attribute.attributeId !== 69
                                    )
                                    .reduce(
                                      (sum, attribute) =>
                                        sum +
                                        (Math.round(
                                          parseFloat(
                                            attribute.values[0]?.value || "0"
                                          )
                                        ) || 0),
                                      0
                                    )}
                                  %
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {g.attributes
                    .filter(
                      (attribute) =>
                        attribute.attributeId !== 68 &&
                        attribute.attributeId !== 69
                    )
                    .map((attribute) => (
                      <div
                        key={attribute.attributeId}
                        className="col m-auto mb-5"
                      >
                        <div className="row d-flex text-center text-white px-3">
                          <div className="col px-5">
                            <div
                              className="col shadow px-3"
                              style={{
                                background: "rgba(12, 140, 233, 0.2)",
                                borderTopRightRadius: "50px",
                                borderBottomRightRadius: "50px",
                                border: "1px solid rgba(12, 140, 233, 0.4)",
                              }}
                            >
                              <div className="col p-2">
                                <p className="fs17px fw-bold m-0 text-wrap text-center text-break">
                                  {attribute.label}
                                </p>
                              </div>
                              <div className="row d-flex m-0 ">
                                <div className="col p-0">
                                  <p className="fs24px fw-bold m-0 mt-3 text-end">
                                    {attribute.values[0]?.weightage}%
                                  </p>
                                </div>
                                <div className="col pb-2">
                                  <div
                                    className="rounded-circle fw-bold fs20px text-white text-center ms-2 me-2 my-auto text-wrap text-break"
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      background:
                                        "linear-gradient(to bottom right, #0C8CE9, #074F83)",
                                    }}
                                  >
                                    <p className="py-4">
                                      {attribute?.values[0]?.value &&
                                        Math.round(
                                          parseFloat(attribute.values[0]?.value)
                                        )}
                                      %
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="row d-flex justify-content-center m-0 mb-5">
              <div className="col text-center text-white">
                <div
                  className="col px-4 py-2 d-inline-block shadow"
                  style={{
                    // "linear-gradient(to bottom right, #14BAE3 , #13B1E6, #11AADF,#0B98C5)",
                    background:
                      "linear-gradient(to bottom right, #1090b0 , #0a4582)",
                    borderRadius: "8px",
                    border: "0px",
                  }}
                >
                  <p className="fs17px fw-bold m-0">{majorDeliverables.name}</p>
                  <p className="fs24px fw-bold m-0">
                    {majorDeliverables.attributes
                      .filter(
                        (attribute) =>
                          attribute.attributeId !== 68 &&
                          attribute.attributeId !== 69 &&
                          attribute?.values[0]?.value
                      )
                      .reduce(
                        (sum, attribute) =>
                          sum +
                          (Math.round(parseFloat(attribute.values[0].value)) ||
                            0),
                        0
                      )}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className="row d-flex m-0">
              {majorDeliverables.attributes
                .filter(
                  (attribute) =>
                    attribute.attributeId !== 68 && attribute.attributeId !== 69
                )
                .map((attribute) => (
                  <div
                    className="col-lg-4 col-md-6 col-sm-12"
                    key={attribute.attributeId}
                  >
                    <div className="col" style={{ marginBottom: "60px" }}>
                      <div className="row d-flex text-white m-0">
                        <div className="col text-center">
                          <div
                            className="col shadow px-3"
                            style={{
                              background: "rgba(12, 93, 233, 0.5)",
                              borderTopRightRadius: "50px",
                              borderBottomRightRadius: "50px",
                              border: "1px solid rgba(12, 123, 233, 0.4)",
                            }}
                          >
                            <div className="col p-2">
                              <p className="fs17px fw-bold m-0 text-wrap text-center text-break">
                                {attribute.label}
                              </p>
                            </div>
                            <div className="row d-flex m-0">
                              <div className="col">
                                <p className="fs24px fw-bold m-0 mt-3 text-end">
                                  {attribute.weightage}%
                                </p>
                              </div>
                              <div className="col pb-2">
                                <div
                                  className="rounded-circle fw-bold fs20px text-white text-center ms-2 me-2 my-auto text-wrap text-break"
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    background:
                                      "linear-gradient(to bottom right, #001F3F, #09417a)",
                                  }}
                                >
                                  <p className="py-4">
                                    {attribute?.values[0]?.value &&
                                      Math.round(
                                        parseFloat(attribute?.values[0]?.value)
                                      )}
                                    %
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WBSReport;
// {Math.round(
//   majorDeliverables.group.reduce((sum, g) => {
//     const groupTotal = g.attributes
//       .filter(
//         (attribute) =>
//           attribute.attributeId !== 68 &&
//           attribute.attributeId !== 69
//       )
//       .reduce((attrSum, attribute) => {
//         const value = attribute.values[0]?.value; // Raw value
//         const numericValue = parseFloat(value); // Convert to number
//         return (
//           attrSum + (isNaN(numericValue) ? 0 : numericValue)
//         ); // Add valid numbers
//       }, 0);
//     return sum + groupTotal; // Add group total to the sum
//   }, 0)
// )}
