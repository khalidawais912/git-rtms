"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Props {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  getNodeLabel: (
    roleId: number,
    designation: string,
    index: number,
    onDelete?: () => void
  ) => JSX.Element;
  handleDeleteNode: (idToDelete: string) => void;
}

function HirarchyFlow({
  nodes,
  setNodes,
  edges,
  setEdges,
  getNodeLabel,
  handleDeleteNode,
}: Props) {
  const updateDisplayIndexesFromEdges = () => {
    const incomingMap: Record<string, string[]> = {};
    const outgoingMap: Record<string, string[]> = {};

    edges.forEach((edge) => {
      if (!outgoingMap[edge.source]) outgoingMap[edge.source] = [];
      outgoingMap[edge.source].push(edge.target);

      if (!incomingMap[edge.target]) incomingMap[edge.target] = [];
      incomingMap[edge.target].push(edge.source);
    });

    // Find the root node (no incoming edges)
    const rootNode = nodes.find((node) => !incomingMap[node.id]);

    if (!rootNode) return;

    const visited = new Set();
    const ordered: Node[] = [];

    const dfs = (id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (!node || visited.has(id)) return;
      visited.add(id);
      ordered.push(node);

      const children = outgoingMap[id] || [];
      children.forEach(dfs);
    };

    dfs(rootNode.id); // Start DFS from root

    // Update node display label based on new order
    setNodes((prev) =>
      prev.map((node) => {
        const newIndex = ordered.findIndex((n) => n.id === node.id);
        return {
          ...node,
          data: {
            ...node.data,
            label: getNodeLabel(
              node.data.role as number,
              node.data.designation as string,
              newIndex !== -1 ? newIndex : 999,
              () => handleDeleteNode(node.id)
            ),
          },
        };
      })
    );
  };

  useEffect(() => {
    // Recalculate node display indexes on edge change
    updateDisplayIndexesFromEdges();
  }, [edges]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "step",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#0C8CE9",
            },
            style: {
              strokeWidth: 2,
              stroke: "#939393",
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div style={{ height: "104%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default HirarchyFlow;
