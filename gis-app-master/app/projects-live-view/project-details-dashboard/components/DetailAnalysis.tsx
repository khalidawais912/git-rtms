import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import { DetailedAnalysis } from "./ProjectDetailsDashboard";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import DistributedColumnChart2 from "./DistributedColumnChart2";
import LinearChart from "./LinearChart";

const DetailAnalysis = ({ data }: { data: DetailedAnalysis[] }) => {
  const labels = data.map((d) => new Date(d.visitDate).toDateString());
  const planned = data.map((d) => Number(d.actualPlannedProject));
  const financial = data.map((d) => Number(d.actualFinancialProgress));
  const physical = data.map((d) => Number(d.actualPhysicalProgress));

  return (
    <CustomModal
      size="xl"
      modalId="detailAnalysis"
      HeaderTopPos={0}
      HeaderRightPos={10}
      button={
        <Button
          className="btn w-100 fs12px color-sea-blue"
          style={{
            background: "rgba(253, 253, 253, 0.41)",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
            marginTop: "-73px",
          }}
        >
          Detail Analysis
        </Button>
      }
      body={
        <div
          className="container-fluid overflow-hidden"
          style={{
            borderRadius: "20px",
            background:
              "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6) , rgba(255, 255, 255, 0.1))",
            padding: "2px",
          }}
        >
          <div
            className="container-fluid px-0"
            style={{
              borderRadius: "20px",
              background: "#7ABEF0",
            }}
          >
            <div className="table-responsive" style={{ height: "200px" }}>
              &nbsp;
              <table className="table">
                <thead>
                  <tr className="bg-color-sea-blue text-white fs12px">
                    <th className="border-0 text-center text-nowrap">
                      Sr. No.
                    </th>
                    <th className="border-0 text-center text-nowrap">
                      VISIT DATE
                    </th>
                    <th className="border-0 text-center text-nowrap">
                      OFFICER NAME
                    </th>
                    <th className="border-0 text-center text-nowrap">
                      VISIT LOCATION
                    </th>
                    <th className="border-0 text-nowrap">CONTRACTOR</th>
                    <th className="border-0 text-center text-nowrap">
                      RESIDENT ENGINEER
                    </th>
                    <th className="border-0 text-center text-nowrap">
                      PLANNED PHYSICAL PROGRESS
                    </th>
                    <th className="border-0 text-center text-nowrap">
                      ACTUAL PHYSICAL PROGRESS
                    </th>
                    <th className="border-0 text-center text-nowrap">
                      MONITORING RATING INDEX
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i} className="fs12px fw-bold">
                      <th
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {i + 1}
                      </th>
                      <td
                        className="text-center text-nowrap"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {new Date(d.visitDate).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {d.officerName}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {d.location}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {d.contractorName}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {d.reName}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {Number(d.actualPlannedProject).toFixed() + "%"}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {Number(d.actualFinancialProgress).toFixed() + "%"}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          borderBottom: "1px solid rgba(159, 159, 159, 0.75)",
                        }}
                      >
                        {Number(d.actualPhysicalProgress).toFixed() + "%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="container text-nowrap d-flex"
              style={{
                overflow: "hidden",
                overflowX: "scroll",
              }}
            >
              <div className="col-12 bg-white" style={{ borderRadius: "20px" }}>
                <LinearChart
                  title=""
                  categories={labels}
                  series={[
                    {
                      name: "Planned Physical Progress",
                      data: planned,
                      color: "blue",
                    },
                    {
                      name: "Actual Financial Progress",
                      data: financial,
                      color: "green",
                    },
                    {
                      name: "Actual Physical Progress",
                      data: physical,
                      color: "orange",
                    },
                  ]}
                />
              </div>
            </div>
            &nbsp;
          </div>
        </div>
      }
    />
  );
};

export default DetailAnalysis;
