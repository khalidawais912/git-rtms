// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import HirarchyFlow from "./HirarchyFlow";
// import { Node } from "@xyflow/react";
// import { Button } from "react-bootstrap"; // or your button component
// import { Edge } from "@xyflow/react";

// const HierarchyBuilder = () => {
//   const [role, setRole] = useState("");
//   const [designation, setDesignation] = useState("");
//   const [selectedColor, setSelectedColor] = useState("#336B66");
//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [edges, setEdges] = useState<Edge[]>([]);
//   const [nodeId, setNodeId] = useState(1);

//   const getNodeLabel = (
//     role: string,
//     designation: string,
//     index: number, // 👈 Accept current index in array
//     onDelete?: () => void
//   ) => (
//     <div className="position-relative d-flex align-items-center">
//       {onDelete && (
//         <button
//           onClick={onDelete}
//           style={{
//             position: "absolute",
//             top: 0,
//             right: -30,
//             border: "none",
//             borderRadius: "50%",
//             background: "transparent",
//             width: 20,
//             height: 20,
//             fontSize: 12,
//             cursor: "pointer",
//             lineHeight: 0,
//           }}
//           title="Delete node"
//         >
//           🗑️
//         </button>
//       )}

//       <div
//         className="fw-bold fs12px rounded-circle d-flex justify-content-center align-items-center text-dark"
//         style={{
//           width: "40px",
//           height: "40px",
//           background: "#F2F7FA",
//           flexShrink: 0,
//         }}
//       >
//         {index + 1} {/* 👈 Show index + 1 */}
//       </div>

//       <div className="ms-3">
//         <div className="fw-bold">{role}</div>
//         <div>{designation}</div>
//       </div>
//     </div>
//   );

//   const handleAddNode = () => {
//     if (!role || !designation) return;

//     const newId = nodeId.toString();

//     const newNode: Node = {
//       id: newId,
//       data: {
//         role,
//         designation,
//         label: getNodeLabel(role, designation, nodes.length, () =>
//           handleDeleteNode(newId)
//         ),
//       },
//       position: { x: 50 * nodeId, y: 50 * nodeId },
//       style: {
//         backgroundColor: selectedColor,
//         color: "#fff",
//         padding: 10,
//         borderRadius: 8,
//         fontWeight: "bold",
//         textAlign: "center",
//       },
//     };

//     // Create edge from previous node to this node
//     const newEdge: Edge | null =
//       nodes.length > 0
//         ? {
//             id: `e${nodes[nodes.length - 1].id}-${newId}`,
//             source: nodes[nodes.length - 1].id,
//             target: newId,
//             type: "step",
//           }
//         : null;

//     setNodes((prev) => [...prev, newNode]);
//     if (newEdge) setEdges((prev) => [...prev, newEdge]);

//     setNodeId((id) => id + 1);
//     setRole("");
//     setDesignation("");
//   };

//   const handleDeleteNode = (idToDelete: string) => {
//     setNodes((prevNodes) => {
//       // Get index of the node to be deleted
//       const indexToDelete = prevNodes.findIndex(
//         (node) => node.id === idToDelete
//       );

//       // Get previous and next nodes (based on index BEFORE deletion)
//       const prevNode = prevNodes[indexToDelete - 1];
//       const nextNode = prevNodes[indexToDelete + 1];

//       // Filter out the node to delete
//       const filteredNodes = prevNodes.filter((node) => node.id !== idToDelete);

//       // Update labels
//       const updatedNodes = filteredNodes.map((node, index) => ({
//         ...node,
//         data: {
//           ...node.data,
//           label: getNodeLabel(
//             node.data.role as string,
//             node.data.designation as string,
//             index,
//             () => handleDeleteNode(node.id)
//           ),
//         },
//       }));

//       // Update edges after node state is changed
//       setEdges((prevEdges) => {
//         const cleanedEdges = prevEdges.filter(
//           (e) => e.source !== idToDelete && e.target !== idToDelete
//         );

//         if (prevNode && nextNode) {
//           const newEdgeId = `e${prevNode.id}-${nextNode.id}`;

//           const exists = cleanedEdges.some((edge) => edge.id === newEdgeId);

//           if (!exists) {
//             const newEdge: Edge = {
//               id: newEdgeId,
//               source: prevNode.id,
//               target: nextNode.id,
//               type: "step",
//             };
//             return [...cleanedEdges, newEdge];
//           }
//         }

//         return cleanedEdges;
//       });

//       return updatedNodes;
//     });
//   };

//   const colorOptions = [
//     "#336B66",
//     "#F9DA57",
//     "#B7BCC8",
//     "#969FAE",
//     "#1578BB",
//     "#E64D0A",
//     "#9DC082",
//     "#8BBFE9",
//     "#678E48",
//     "#8D9ABC",
//     "#4FCDC7",
//   ];

//   useEffect(() => {
//     console.log("nodes", nodes);
//   }, [nodes]);

//   return (
//     <div className="row">
//       <div
//         className="col-3 bg-white p-4"
//         style={{ border: "1px solid #E2E4E5" }}
//       >
//         <div className="row">
//           <div className="col">
//             <p className="m-0 fw-5 fs20px">Add Hierarchy</p>
//           </div>
//           <div className="col text-end">
//             <Button
//               onClick={handleAddNode}
//               className="btn bg-color-sea-blue text-white fs15px fw-5"
//               style={{ borderRadius: "8px" }}
//             >
//               Add
//             </Button>
//           </div>
//         </div>

//         <div className="col mb-3">
//           <label htmlFor="role" className="form-label fs14px fw-5">
//             Select Role
//           </label>
//           <input
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             type="text"
//             className="form-control form-control-sm"
//             placeholder="Admin"
//           />
//         </div>

//         <div className="col mb-3">
//           <p className="fs14px fw-5 mb-2">Stage Color</p>
//           <div className="row gap-2 m-0">
//             {colorOptions.map((color) => (
//               <div
//                 key={color}
//                 onClick={() => setSelectedColor(color)}
//                 style={{
//                   width: 34,
//                   height: 34,
//                   background: color,
//                   borderRadius: 5,
//                   border:
//                     selectedColor === color
//                       ? "2px solid black"
//                       : "1px solid #ccc",
//                   cursor: "pointer",
//                 }}
//               />
//             ))}
//             <div
//               className="col-auto p-1"
//               style={{ borderRadius: "5px", border: "1px solid #D9D9D9" }}
//             >
//               <Image
//                 src="/icons/color-picker.svg"
//                 width={24}
//                 height={24}
//                 alt="color-picker"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="col mb-3">
//           <label htmlFor="designation" className="form-label fs14px fw-5">
//             Choose Designation
//           </label>
//           <input
//             value={designation}
//             onChange={(e) => setDesignation(e.target.value)}
//             type="text"
//             className="form-control form-control-sm"
//             placeholder="Assistant Director"
//           />
//         </div>
//       </div>

//       <div className="col">
//         <HirarchyFlow
//           nodes={nodes}
//           setNodes={setNodes}
//           edges={edges}
//           setEdges={setEdges}
//         />
//       </div>
//     </div>
//   );
// };

// export default HierarchyBuilder;
