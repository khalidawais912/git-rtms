import ReactFlow, { Controls } from "reactflow";
import "reactflow/dist/style.css";
import { Groups } from "../../types";
import CustomModal from "@/components/CustomModal/CustomModal";
import { FaImage } from "react-icons/fa";

interface Props {
  majorDeliverables: Groups;
  progressAnalysis: Groups;
}

const WBSSummary = ({ majorDeliverables, progressAnalysis }: Props) => {

  // Generate unique IDs for nodes and edges
  const getNodeId = (prefix: any, id: any) => `${prefix}-${id}`;

  // Transform data into nodes
  const nodes = [
    // Major Deliverable Node
    {
      id: getNodeId("major", "Total"),
      type: "default",
      data: {
        label: (
          <div
            className="col p-2 d-inline-block shadow"
            style={{
              background: "linear-gradient(to bottom right, #1090b0 , #0a4582)",
              borderRadius: "8px",
              border: "0px",
            }}
          >
            <p className="fs17px fw-bold m-0">
              Work BreakDown Structure Summary
            </p>
            <p className="fs24px fw-bold m-0">
              {
                progressAnalysis.attributes.find(
                  (attribute) =>
                    attribute.label.toLowerCase() === "actual physical progress"
                )?.values[0].value
              }
              %
            </p>
          </div>
        ),
      },
      position: { x: 350 + majorDeliverables?.attributes?.length * 100, y: 50 },
      style: nodeStyle,
    },
  ];

  // Transform data into edges
  const edges = [
    // Edges from Major Deliverable to Groups
    ...majorDeliverables.attributes.map((attribute) => ({
      id: `edge-major-${attribute.attributeId}`,
      source: getNodeId("major", majorDeliverables.id),
      target: getNodeId("attribute", attribute.attributeId),
      animated: false,
      style: edgeStyle,
      type: "step",
    })),
  ];

  return (
    <div style={{ height: "100vh" }}>
      <p className="m-0 fw-bold fs26px ms-3 mt-2 text-center">
        Work BreakDown Structure Summary
      </p>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls />
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
};

const attributeNodeStyle = {
  background: "rgba(255,255,255,0)",
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
};

const majorDeliverableStyle = {
  textAlign: "center",
  fontSize: "16px",
};

export default WBSSummary;
