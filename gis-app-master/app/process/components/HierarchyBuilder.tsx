"use client";

import Button from "@/app/components/Button";
import HirarchyFlow from "./HirarchyFlow";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Edge, Node } from "@xyflow/react";
import { HiOutlineTrash } from "react-icons/hi";
import useRoles from "@/app/hooks/useRoles";
import useAuthentication from "@/app/hooks/useAuthentication";
import Select, { SingleValue, StylesConfig } from "react-select";
import { createdMessage, Option } from "@/app/utils";
import { toast } from "react-toastify";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { DEPARTMENT_ROLES_SORTING_API } from "@/app/APIs";
import { GoArrowLeft } from "react-icons/go";
import { FiArrowRightCircle } from "react-icons/fi";
import CustomNode from "./CustomNode";

// Type-safe helper
export interface CustomNode extends Node {
  roleId: number;
  description?: string;
}

interface DepartmentRolesSorting {
  roleId: number;
  sortOrder: number;
  description: string;
}

const HierarchyBuilder = () => {
  const [roleId, setRoleId] = useState<number>(-1);
  const [selectedColor, setSelectedColor] = useState("#336B66");
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isClient, setClient] = useState(false);
  const [apiData, setApiData] = useState<DepartmentRolesSorting[]>([]);

  useEffect(() => {
    console.log("apiData", apiData);
    console.log("nodes", nodes);
  }, [apiData, nodes]);

  useEffect(() => {
    setClient(true);
  }, []);

  const handleSubmit = async (apiData: DepartmentRolesSorting[]) => {
    try {
      const response = await apiClient.post(
        `${DEPARTMENT_ROLES_SORTING_API}/save-sorting`,
        apiData
      );
      if (response.data.responseCode === 200) {
        toast.success("Sorting Updated successfully");
      }
      console.log("response", response);
    } catch (err) {
      console.log("err", err);
      toast.error((err as AxiosError).message);
    }
  };

  const handleAddNode = () => {
    if (!roleId || roleId === -1) {
      toast.error("Please add Role!");
      return;
    }

    const newNodeId = Date.now().toString();
    const newIndex = nodes.length;
    const roleName = roles.find((r) => r.id === roleId)?.name || "";

    const newNode: CustomNode = {
      id: newNodeId,
      roleId,
      data: {
        index: newIndex,
        roleName,
        id: newNodeId,
        onDelete: handleDeleteNode,
      },
      position: { x: 0, y: 100 + newIndex * 130 },
      style: {
        backgroundColor: selectedColor,
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        fontWeight: "bold",
        textAlign: "center",
        border: "1px solid #E2E4E5",
        width: "450px",
      },
    };

    // Render label outside to ensure fresh closure
    newNode.data.label = (
      <CustomNode
        id={newNodeId}
        roleId={roleId}
        index={newIndex}
        onDelete={() => handleDeleteNode(newNodeId, nodes)}
        roleName={roleName}
      />
    );

    setNodes((prev) => [...prev, newNode]);
    const newApiEntry: DepartmentRolesSorting = {
      roleId,
      sortOrder: newIndex,
      description: "",
    };

    setApiData((prev) => [...prev, newApiEntry]);
  };

  const handleDeleteNode = (idToDelete: string, nodes: CustomNode[]) => {
    console.log("idToDelete", idToDelete);
    console.log("nodes", nodes);
    const filtered = nodes.filter((node) => node.id !== idToDelete);
    // console.log("remaining nodes", filtered);
    let newNodes = [];
    console.log("nodes.length", nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      console.log("node index", nodes[i]);
      if (nodes[i].id !== idToDelete) {
        newNodes.push(nodes[i]);
      }
    }
    console.log("new nodes", newNodes);
    const updatedNodes = filtered.map((node, index) => {
      const roleName = roles.find((r) => r.id === node.roleId)?.name || "";
      return {
        ...node,
        position: { x: 0, y: 100 + index * 130 },
        data: {
          ...node.data,
          label: (
            <CustomNode
              id={node.id}
              roleId={node.roleId}
              index={index}
              onDelete={() => handleDeleteNode(node.id, nodes)}
              roleName={roleName}
            />
          ),
        },
      };
    });
    console.log("updatedNodes", updatedNodes);

    setNodes(updatedNodes);

    const updatedApiData = updatedNodes.map((node, index) => ({
      roleId: node.roleId,
      sortOrder: index,
      description:
        apiData.find((entry) => entry.roleId === node.roleId)?.description ||
        "",
    }));

    setApiData(updatedApiData);
  };

  const getNodeLabel = (
    id: string,
    roleId: number,
    index: number,
    nodes: CustomNode[]
  ) => (
    <div className="position-relative">
      <button
        onClick={() => handleDeleteNode(id, nodes)} // <-- should use passed `id`, not closure
        style={{
          position: "absolute",
          top: 0,
          right: -30,
          border: "none",
          borderRadius: "50%",
          background: "transparent",
          width: 20,
          height: 20,
          fontSize: 12,
          cursor: "pointer",
          lineHeight: 0,
        }}
      >
        <HiOutlineTrash style={{ color: "#8E9296" }} size={21} />
      </button>

      <div className="row p-3">
        <div
          className="col-auto fw-bold fs12px rounded-circle d-flex justify-content-center align-items-center text-dark"
          style={{ width: "40px", height: "40px", background: "#F2F7FA" }}
        >
          {index + 1}
        </div>
        <div className="col">
          <p className="mb-2 text-decoration-underline fw-normal text-start">
            {roles.find((role) => role.id === roleId)?.name}
          </p>
        </div>
      </div>
    </div>
  );

  const colorOptions = [
    "#336B66",
    "#F9DA57",
    "#B7BCC8",
    "#969FAE",
    "#1578BB",
    "#E64D0A",
    "#9DC082",
    "#8BBFE9",
    "#678E48",
    "#8D9ABC",
    "#4FCDC7",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Backspace" || e.key === "Delete") && selectedNodeId) {
        handleDeleteNode(selectedNodeId, nodes);
        setSelectedNodeId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNodeId(node.id);
  };

  //   function getSortedNodes(
  //     nodes: NodeWithData[],
  //     edges: Edge[]
  //   ): NodeWithData[] {
  //     const inDegree: Record<string, number> = {};
  //     const graph: Record<string, string[]> = {};

  //     nodes.forEach((node) => {
  //       inDegree[node.id] = 0;
  //       graph[node.id] = [];
  //     });

  //     edges.forEach((edge) => {
  //       graph[edge.source].push(edge.target);
  //       inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
  //     });

  //     const queue: string[] = Object.keys(inDegree).filter(
  //       (id) => inDegree[id] === 0
  //     );
  //     const sorted: NodeWithData[] = [];

  //     while (queue.length) {
  //       const currentId = queue.shift()!;
  //       const node = nodes.find((n) => n.id === currentId);
  //       if (node) sorted.push(node);

  //       for (const neighbor of graph[currentId]) {
  //         inDegree[neighbor]--;
  //         if (inDegree[neighbor] === 0) queue.push(neighbor);
  //       }
  //     }

  //     return sorted;
  //   }

  //   function buildHierarchyPayload(sortedNodes: NodeWithData[]): {
  //     roleId: number;
  //     sortOrder: number;
  //     description: string;
  //   }[] {
  //     return sortedNodes.map((node, index) => ({
  //       roleId: node.data.roleId,
  //       sortOrder: index + 1,
  //       description: `${node.data.name} - ${node.data.designation}`,
  //     }));
  //   }

  //   const sorted = getSortedNodes(nodes, edges);
  // const payload = buildHierarchyPayload(sorted);
  const { data: roles } = useRoles();
  const defaultNumberOption = { value: "-1", label: "Select" };

  const roleNames = roles.map((role) => {
    return {
      value: String(role.id),
      label: role.name,
    };
  });

  const customStyles: StylesConfig<Option, false> = {
    control: (base) => ({
      ...base,
      fontSize: "14px",
      border: "1px solid #E2E4E5",
      fontWeight: "500",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      // backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      // color: "#333",
      fontSize: "14px",
    }),
  };

  return (
    <>
      <div className="row" style={{ height: "65vh" }}>
        <div
          className="col-12 col-sm-12 col-md-6 col-lg-3 bg-white p-4"
          style={{ border: "1px solid #E2E4E5" }}
        >
          <div className="row">
            <div className="col">
              <p className="m-0 fw-5 fs20px">Add Hierarchy</p>
            </div>
            <div className="col text-end">
              <Button
                className="btn bg-color-sea-blue text-white fs15px fw-5"
                style={{ borderRadius: "8px" }}
                onClick={handleAddNode}
              >
                Add
              </Button>
            </div>
          </div>
          <div className="col mb-3">
            <label htmlFor="role" className="form-label fs14px fw-5">
              Select Role
            </label>
            {isClient && (
              <Select
                options={[defaultNumberOption, ...roleNames]}
                name="role"
                id="role"
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                styles={customStyles}
                onChange={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    setRoleId(Number(newValue.value));
                  }
                }}
              />
            )}
            {/* <input
            id="role"
            type="text"
            className="form-control form-control-sm color-light-dark fw-5"
            placeholder="Admin"
            style={{ border: "1px solid #E2E4E5" }}
            onChange={(e) => setRole(e.target.value)}
            value={role}
          /> */}
          </div>
          <div className="col mb-3">
            <p className="fs14px fw-5 mb-2">Stage Color</p>
            <div className="row gap-2 m-0">
              {colorOptions.map((color) => (
                <Button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="btn"
                  style={{
                    width: "34px",
                    height: "34px",
                    background: color,
                    borderRadius: "5px",
                    border:
                      selectedColor === color
                        ? "2px solid black"
                        : "1px solid #ccc",
                  }}
                />
              ))}

              <div
                className="col-auto p-1"
                style={{ borderRadius: "5px", border: "1px solid #D9D9D9" }}
              >
                <Image
                  src="/icons/color-picker.svg"
                  width={24}
                  height={24}
                  alt="color-picker"
                />
                <input
                  type="color"
                  id="favcolor"
                  style={{ height: "18px" }}
                  name="favcolor"
                  onChange={(e) => console.log("color", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <HirarchyFlow
            nodes={nodes}
            setNodes={setNodes}
            onNodeClick={(_, node) => onNodeClick(_, node)}
          />
        </div>
      </div>
      <div
        className="row bg-white p-2"
        style={{
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
          border: "1px solid #E2E4E5",
        }}
      >
        <div className="col">
          <Button className="btn">Cancel</Button>
        </div>
        <div className="col text-end">
          <Button
            className="btn fw-5 fs15px bg-white me-2"
            style={{
              border: "1px solid #E2E4E5",
              borderRadius: "8px",
            }}
          >
            <GoArrowLeft size={24} />
            &nbsp;Back
          </Button>
          <Button
            onClick={() => handleSubmit(apiData)}
            className="btn fw-5 fs15px bg-color-sea-blue text-white"
            style={{
              border: "1px solid #E2E4E5",
              borderRadius: "8px",
            }}
          >
            Save&nbsp;
            <FiArrowRightCircle size={24} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default HierarchyBuilder;
