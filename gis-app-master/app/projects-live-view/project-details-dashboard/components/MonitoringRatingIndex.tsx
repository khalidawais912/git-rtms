import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import { useEffect, useState } from "react";

interface Props {
  group: Groups;
}
const MonitoringRatingIndex = ({ group }: Props) => {
  const [mri, setMRI] = useState<number>();
  useEffect(() => {
    const mriValue = group.group
      .find((g) => g.name.toLowerCase() === "performance")
      ?.attributes.find(
        (attribute) =>
          attribute.label.toLowerCase() === "overall project rating"
      )?.values[0]?.value;
    setMRI(Math.round(Number(mriValue)));
  }, [group]);

  let totalValue = 0;
  let obtainValue = 0;

  return (
    <div
      className="position-relative col px-2"
      style={{ height: "85vh", overflow: "hidden", overflowY: "scroll" }}
    >
      <div
        className="col bg-white py-2 table-responsive"
        style={{ position: "sticky", top: "0" }}
      >
        <p className="fw-bold fs18px mb-2">Monitoring Rating Index</p>
        <table className="table mb-0">
          <thead>
            <tr>
              <td
                style={{ width: "50%" }}
                className="bg-color-sea-blue rounded-pill rounded-end ps-0 border-0"
              >
                <span
                  style={{ background: "#0468C8" }}
                  className="rounded-pill text-white px-5 py-2 fs18px fw-bold"
                >
                  Criteria
                </span>
              </td>
              <td
                style={{ width: "25%" }}
                className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold"
              >
                Maximum Points
              </td>
              <td
                style={{ width: "25%" }}
                className="bg-color-sea-blue border-0 text-white rounded-pill rounded-start text-center fs18px fw-bold"
              >
                Points Obtained
              </td>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-responsive">
        <table className="table table-hover">
          <tbody>
            {group.group.map((g, i) => (
              <>
                <tr key={g.id}>
                  <th colSpan={3} className="text-center border-0">
                    {i + 1}. {g.name}
                  </th>
                </tr>
                {g.attributes.map((attribute) => (
                  <>
                    {attribute.label.toLowerCase().endsWith("obtain") ||
                    attribute.label.toLowerCase().endsWith("obtained") ? (
                      <tr key={attribute.attributeId} className="d-none">
                        <td>
                          {
                            (obtainValue = Math.round(
                              parseFloat(attribute?.values[0]?.value)
                            ))
                          }
                        </td>
                      </tr>
                    ) : attribute.label.toLowerCase().endsWith("total") ? (
                      <>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td className="d-none">
                            {
                              (totalValue = Math.round(
                                parseFloat(attribute?.values[0]?.value)
                              ))
                            }
                          </td>
                        </tr>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td
                            style={{
                              background: "#9F9F9F",
                              width: "50%",
                            }}
                            className="rounded-pill rounded-end border-0 ps-0"
                          >
                            <span
                              style={{ background: "#555555" }}
                              className="rounded-pill text-white px-5 py-2 fs18px fw-bold"
                            >
                              Total
                            </span>
                          </td>
                          <td
                            style={{
                              background: "#9F9F9F",
                              width: "25%",
                            }}
                            className="border-0 text-center text-white fw-bold"
                          >
                            {attribute?.values[0]?.value}
                          </td>
                          <td
                            style={{
                              background: "#9F9F9F",
                              width: "25%",
                            }}
                            className="rounded-pill rounded-start border-0 text-center text-white fw-bold"
                          >
                            {obtainValue}
                          </td>
                        </tr>
                      </>
                    ) : attribute.label.toLowerCase().endsWith("weightage") ? (
                      <tr key={attribute.attributeId}>
                        <td
                          className="border-0 px-0"
                          style={{ width: "50%", color: "#414651" }}
                        >
                          <div className="rounded-pill rounded-end ps-4 pb-2 border-bottom fs14px fw-normal">
                            Weightage of P
                            {g.name.toLowerCase() === "planning"
                              ? 1
                              : g.name.toLowerCase() === "execution"
                              ? 2
                              : g.name.toLowerCase() === "performance"
                              ? 3
                              : 0}{" "}
                            Indicator={" "}
                            {g.name.toLowerCase() === "planning"
                              ? 30
                              : g.name.toLowerCase() === "execution"
                              ? 35
                              : g.name.toLowerCase() === "performance"
                              ? 45
                              : 0}
                            % ((Points Obtained in Performance/30 x 100) *
                            {g.name.toLowerCase() === "planning"
                              ? 0.1
                              : g.name.toLowerCase() === "execution"
                              ? 0.3
                              : g.name.toLowerCase() === "performance"
                              ? 0.6
                              : 0}
                            )
                          </div>
                        </td>
                        <td
                          className="border-0 px-0"
                          style={{ width: "25%", color: "#414651" }}
                        >
                          <div className="pt-2 border-bottom text-center fs14px fw-normal">
                            {totalValue}
                            <br />
                            &nbsp;
                          </div>
                        </td>
                        <td
                          className="border-0 px-0"
                          style={{ width: "25%", color: "#414651" }}
                        >
                          <div className="rounded-pill rounded-start pt-2 border-bottom text-center fs14px fw-normal">
                            {attribute?.values[0]?.value}
                            <br />
                            &nbsp;
                          </div>
                        </td>
                      </tr>
                    ) : attribute.label
                        .toLowerCase()
                        .endsWith("overall project rating") ? (
                      <>
                        <tr key={attribute.attributeId}>
                          <td
                            style={{
                              background: "#9F9F9F",
                              width: "50%",
                            }}
                            className="rounded-pill rounded-end border-0 ps-0"
                          >
                            <span
                              style={{ background: "#555555" }}
                              className="rounded-pill text-white px-3 py-2 fs18px fw-bold"
                            >
                              Planning + Execution + Performance
                            </span>
                          </td>
                          <td
                            style={{
                              background: "#9F9F9F",
                              width: "25%",
                            }}
                            className="border-0 text-center text-white fw-bold"
                          >
                            Total
                          </td>
                          <td
                            style={{
                              background: "#9F9F9F",
                              width: "25%",
                            }}
                            className="rounded-pill rounded-start border-0 text-center text-white fw-bold"
                          >
                            {attribute?.values[0]?.value}
                          </td>
                        </tr>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td
                            className="border-0 pb-2 px-0"
                            style={{ width: "50%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-end border-bottom fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                <span className="ps-2">{attribute.label}</span>
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 pb-2 px-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                {parseFloat(attribute.values[0].value) > 70
                                  ? "Above 70 Points"
                                  : parseFloat(attribute.values[0].value) < 35
                                  ? "Below 35 Points"
                                  : parseFloat(attribute.values[0].value) <=
                                      70 &&
                                    parseFloat(attribute.values[0].value) >= 35
                                  ? "35-70 Points"
                                  : ""}
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 pb-2 px-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-start border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span
                                style={{
                                  background: `${
                                    parseFloat(attribute.values[0].value) > 70
                                      ? "#86FF64"
                                      : parseFloat(attribute.values[0].value) <
                                        35
                                      ? "#CA0C0C"
                                      : parseFloat(attribute.values[0].value) <=
                                          70 &&
                                        parseFloat(attribute.values[0].value) >=
                                          35
                                      ? "#FFF764"
                                      : ""
                                  }`,
                                  width: "90px",
                                }}
                                className={`rounded-pill px-3 py-2 fs14px fw-bold d-inline-block ${
                                  parseFloat(attribute.values[0].value) < 35
                                    ? "text-white"
                                    : ""
                                }`}
                              >
                                {parseFloat(attribute.values[0].value) > 70
                                  ? "Good"
                                  : parseFloat(attribute.values[0].value) < 35
                                  ? "Critical"
                                  : parseFloat(attribute.values[0].value) <=
                                      70 &&
                                    parseFloat(attribute.values[0].value) >= 35
                                  ? "Average"
                                  : ""}
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td
                            style={{
                              background: "#555555",
                              width: "50%",
                            }}
                            className="rounded-pill rounded-end border-0 ps-3 text-white fs18px fw-bold"
                          >
                            Rating Parameters
                          </td>
                          <td
                            style={{
                              background: "#555555",
                              width: "25%",
                            }}
                            className="border-0 text-center text-white fw-bold"
                          ></td>
                          <td
                            style={{
                              background: "#555555",
                              width: "25%",
                            }}
                            className="rounded-pill rounded-start border-0 text-center text-white fw-bold"
                          ></td>
                        </tr>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td
                            className="border-0 p-0"
                            style={{ width: "50%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-end border-bottom fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                <span className="ps-2">Above 70 Points</span>
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 p-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                &nbsp;
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 p-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-start border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span
                                style={{ background: "#86FF64", width: "90px" }}
                                className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block"
                              >
                                Good
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td
                            className="border-0 p-0"
                            style={{ width: "50%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-end border-bottom fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                <span className="ps-2">35-70 Points</span>
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 p-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                &nbsp;
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 p-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-start border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span
                                style={{ background: "#FFF764", width: "90px" }}
                                className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block"
                              >
                                Average
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr key={attribute.attributeId + Math.random()}>
                          <td
                            className="border-0 p-0"
                            style={{ width: "50%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-end border-bottom fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                <span className="ps-2">Below 35 Points</span>
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 p-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span className="rounded-pill px-3 py-2 fs14px fw-bold d-inline-block">
                                &nbsp;
                              </span>
                            </div>
                          </td>
                          <td
                            className="border-0 p-0"
                            style={{ width: "25%", color: "#414651" }}
                          >
                            <div
                              className="rounded-pill rounded-start border-bottom text-center fs14px fw-normal"
                              style={{ padding: "5px 0px 10px 0px" }}
                            >
                              <span
                                style={{ background: "#CA0C0C", width: "90px" }}
                                className="rounded-pill px-3 py-2 fs14px fw-bold text-white d-inline-block"
                              >
                                Critical
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr key={attribute.attributeId}>
                        <td
                          style={{
                            background: "rgba(241, 241, 241, 0.88)",
                            width: "50%",
                            color: "#414651",
                          }}
                          className="rounded-pill rounded-end border-0 ps-4 fs14px fw-bold"
                        >
                          {attribute.label}
                        </td>
                        <td
                          style={{
                            background: "rgba(241, 241, 241, 0.88)",
                            width: "25%",
                            color: "#414651",
                          }}
                          className="border-0 text-center fs14px fw-normal"
                        >
                          {Math.max(
                            ...attribute.options.map((option) =>
                              parseFloat(option.value)
                            )
                          )}
                        </td>
                        <td
                          style={{
                            background: "rgba(241, 241, 241, 0.88)",
                            width: "25%",
                            color: "#414651",
                          }}
                          className="rounded-pill rounded-start border-0 text-center fs14px fw-normal"
                        ></td>
                      </tr>
                    )}
                    {attribute.options.map((option) => (
                      <tr key={option.id}>
                        <td
                          className="border-0 px-0"
                          style={{ width: "50%", color: "#414651" }}
                        >
                          <div className="rounded-pill rounded-end ps-4 pb-2 border-bottom fs14px fw-normal">
                            {option.label}
                          </div>
                        </td>
                        <td
                          className="border-0 px-0"
                          style={{ width: "25%", color: "#414651" }}
                        >
                          <div className="pb-2 border-bottom text-center fs14px fw-normal">
                            {option?.value === "-1" ? 0 : option?.value}
                          </div>
                        </td>
                        <td
                          className="border-0 px-0"
                          style={{ width: "25%", color: "#414651" }}
                        >
                          <div className="rounded-pill rounded-start pb-2 border-bottom text-center fs14px fw-normal">
                            {option?.value === attribute?.values[0]?.value &&
                            attribute?.values[0]?.value === "-1" ? (
                              0
                            ) : option?.value ===
                              attribute?.values[0]?.value ? (
                              <span>{option?.value}</span>
                            ) : (
                              <span>&nbsp;</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoringRatingIndex;
