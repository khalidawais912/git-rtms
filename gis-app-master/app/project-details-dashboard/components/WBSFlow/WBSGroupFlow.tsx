import ReactFlow, { Controls } from "reactflow";
import "reactflow/dist/style.css";
import { Groups } from "../ProjectDetailsDashboard";
import { FaImage } from "react-icons/fa";
import CustomModal from "@/app/components/CustomModal/CustomModal";

interface Props {
  majorDeliverables: Groups;
}

const WBSGroupFlow = ({ majorDeliverables }: Props) => {
  // Generate unique IDs for nodes and edges
  const getNodeId = (prefix: any, id: any) => `${prefix}-${id}`;

  // Transform data into nodes
  const nodes = [
    // Major Deliverable Node
    {
      id: getNodeId("major", majorDeliverables.id),
      type: "default",
      data: {
        label: (
          <div
            className="col p-2 d-inline-block shadow text-center"
            style={{
              // "linear-gradient(to bottom right, #14BAE3 , #13B1E6, #11AADF,#0B98C5)",
              background: "linear-gradient(to bottom right, #1090b0 , #0a4582)",
              borderRadius: "8px",
              border: "0px",
            }}
          >
            <p className="fs17px fw-bold m-0 text-center">
              {majorDeliverables.name}
            </p>
            <p className="fs24px fw-bold m-0">
              {majorDeliverables.group.reduce((sum, g) => {
                const groupTotal = g.attributes
                  .filter(
                    (attribute) =>
                      attribute.attributeId !== 68 &&
                      attribute.attributeId !== 69
                  )
                  .reduce((attrSum, attribute) => {
                    const value = attribute.values[0]?.value;
                    const numericValue = Math.round(parseFloat(value));
                    return attrSum + (isNaN(numericValue) ? 0 : numericValue);
                  }, 0);
                return sum + groupTotal;
              }, 0)}
              %
            </p>
          </div>
        ),
      },
      position: { x: 350 + majorDeliverables.group.length * 150, y: 50 },
      style: nodeStyle,
    },
    // Group Nodes
    ...majorDeliverables.group.map((g, index) => ({
      id: getNodeId("group", g.id),
      type: "default",
      data: {
        label: (
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
                    (sum, attribute) => sum + (attribute.weightage || 0),
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
                            parseFloat(attribute.values[0]?.value || "0")
                          ) || 0),
                        0
                      )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      position: { x: 400 + index * 350, y: 200 },
      style: groupNodeStyle,
    })),
    // Attribute Nodes
    ...majorDeliverables.group.flatMap((g, groupIndex) =>
      g.attributes
        .filter(
          (attribute) =>
            attribute.attributeId !== 68 && attribute.attributeId !== 69
        )
        .map((attribute, attrIndex) => ({
          id: getNodeId("attribute", attribute.attributeId),
          type: "default",
          data: {
            label: (
              <>
                {attribute?.values[0]?.verificatioContentPath &&
                attribute?.values[0]?.verificatioContentPath.length > 0 ? (
                  <CustomModal
                    HeaderRightPos={0}
                    HeaderTopPos={0}
                    size="lg"
                    button={
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
                              className="position-relative rounded-circle fw-bold fs20px text-white text-center ms-2 me-2 my-auto text-wrap text-break"
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
                              <span className="position-absolute top-0 start-100 translate-middle p-2 rounded-circle">
                                <FaImage size={25} className="color-sea-blue" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    body={
                      <div className="col text-center bg-white p-3 rounded-3">
                        <p className="mb-0 fs-4 fw-bold text-start">{g.name}</p>
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_API}${attribute?.values[0]?.verificatioContentPath}`}
                          className="img-fluid rounded-3 w-100"
                          style={{
                            objectFit: "contain",
                          }}
                          alt="img"
                        />
                        <p className="mb-0 fs-4 fw-normal">{attribute.label}</p>
                      </div>
                    }
                    modalId={`modal-id:${attribute.label}`}
                  />
                ) : (
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
                          className="position-relative rounded-circle fw-bold fs20px text-white text-center ms-2 me-2 my-auto text-wrap text-break"
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
                )}
              </>
            ),
          },
          position: {
            x: 400 + groupIndex * 350,
            y: 400 + attrIndex * 200, // Adjust the vertical spacing
          },
          style: groupNodeStyle,
        }))
    ),
  ];

  // Transform data into edges
  const edges = [
    // Edges from Major Deliverable to Groups
    ...majorDeliverables.group.map((g) => ({
      id: `edge-major-${g.id}`,
      sourceHandle: "right", // Connect from right of the major node
      targetHandle: "right", // Connect to left of the group node
      source: getNodeId("major", majorDeliverables.id),
      target: getNodeId("group", g.id),
      animated: false,
      style: edgeStyle,
      type: "step",
    })),
    // Edges from Groups to Attributes
    ...majorDeliverables.group.flatMap((g) =>
      g.attributes
        .filter(
          (attribute) =>
            attribute.attributeId !== 68 && attribute.attributeId !== 69
        )
        .map((attribute) => ({
          id: `edge-group-${attribute.attributeId}`,
          sourceHandle: "right", // Connect from right of the major node
          targetHandle: "right", // Connect to left of the group node
          source: getNodeId("group", g.id),
          target: getNodeId("attribute", attribute.attributeId),
          animated: false,
          style: edgeStyle,
        }))
    ),
  ];

  return (
    <div style={{ height: "160vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        {/* <MiniMap /> */}
        <Controls />
        {/* <Background color="#aaa" gap={16} /> */}
      </ReactFlow>
    </div>
  );
};

// Styles for nodes and edges
const nodeStyle = {
  borderRadius: "8px",
  background: "#2B2B38",
  color: "#fff",
  fontWeight: "bold",
  width: "auto",
  padding: "0px",
  border: "0px",
  zIndex: 2,
};

const groupNodeStyle = {
  background: "rgba(232, 224, 255,1)",
  color: "#fff",
  fontWeight: "bold",
  width: "20%",
  padding: "0px",
  border: "0px",
  borderTopRightRadius: "50px",
  borderBottomRightRadius: "50px",
};

const edgeStyle = {
  stroke: "#009688",
  // display: "none",
};

const majorDeliverableStyle = {
  textAlign: "center",
  fontSize: "16px",
};

// const groupNodeStyle = {
//   textAlign: "center",
//   fontSize: "14px",
// };

const attributeNodeStyle = {
  textAlign: "center",
  fontSize: "12px",
};

export default WBSGroupFlow;
