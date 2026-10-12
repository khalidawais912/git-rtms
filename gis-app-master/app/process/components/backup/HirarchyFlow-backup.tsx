// "use client";

// import { useState, useCallback, Dispatch, SetStateAction } from "react";
// import {
//   ReactFlow,
//   Controls,
//   Background,
//   applyNodeChanges,
//   applyEdgeChanges,
//   addEdge,
//   Node,
//   Edge,
//   Connection,
//   OnNodesChange,
//   OnEdgesChange,
//   OnConnect,
//   NodeMouseHandler,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// const initialEdges: Edge[] = [];

// interface Props {
//   nodes: Node[];
//   setNodes: Dispatch<SetStateAction<Node[]>>;
//   onNodeClick: NodeMouseHandler;
// }

// function HirarchyFlow({ nodes, setNodes, onNodeClick }: Props) {
//   const [edges, setEdges] = useState<Edge[]>(initialEdges);

//   const onNodesChange: OnNodesChange = useCallback(
//     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     []
//   );

//   const onEdgesChange: OnEdgesChange = useCallback(
//     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     []
//   );

//   //   for analog edges
//   //   const onConnect: OnConnect = useCallback(
//   //     (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
//   //     []
//   //   );

//   //   for step edges
//   const onConnect: OnConnect = useCallback(
//     (connection: Connection) =>
//       setEdges((eds) => addEdge({ ...connection, type: "step" }, eds)),
//     []
//   );

//   return (
//     <div style={{ height: "100%" }}>
//       <ReactFlow
//         nodes={nodes}
//         onNodesChange={onNodesChange}
//         edges={edges}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//         onNodeClick={onNodeClick}
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// }

// export default HirarchyFlow;
