"use client";
import { DEPARTMENT_ROLES_SORTING_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import useRoles from "@/app/hooks/useRoles";
import apiClient from "@/app/services/api-client";
import { getTimeAgo, hexToRgba, Option } from "@/app/utils";
import { Edge, MarkerType, Node } from "@xyflow/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsFullscreenExit } from "react-icons/bs";
import { FiArrowRightCircle } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { SlSizeFullscreen } from "react-icons/sl";
import { SingleValue, StylesConfig } from "react-select";
import { toast } from "react-toastify";
import HirarchyFlow from "./HirarchyFlow";

interface DepartmentRolesSorting {
  roleId: number | unknown;
  sortOrder: number;
  description: string | unknown;
}

const HierarchyBuilder = () => {
  const [roleId, setRoleId] = useState(-1);
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#336B66");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeId, setNodeId] = useState(1);
  const [isClient, setClient] = useState(false);
  const [data, setData] = useState<DepartmentRolesSorting[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiClient.get(
          DEPARTMENT_ROLES_SORTING_API + "/GetByDepartment"
        );
        setData(response.data.data);
        console.log("load previous hirarchy", response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      // Convert data to nodes and edges
      const loadedNodes: Node[] = data.map((item, index) => {
        const id = (index + 1).toString(); // generate node ID from index
        return {
          id,
          data: {
            role: item.roleId,
            description: item.description,
            label: getNodeLabel(
              item.roleId as number,
              item.description as string,
              index,
              () => handleDeleteNode(id)
            ),
          },
          position: { x: 50 * index, y: 110 * index },
          style: {
            backgroundColor: hexToRgba(selectedColor, 0.2),
            color: "#000",
            padding: 10,
            borderRadius: 8,
            fontWeight: "bold",
            textAlign: "center",
            border: `1px solid ${hexToRgba(selectedColor, 1)}`,
            width: "450px",
          },
        };
      });

      const loadedEdges: Edge[] = [];

      for (let i = 0; i < data.length - 1; i++) {
        loadedEdges.push({
          id: `e${i + 1}-${i + 2}`,
          source: (i + 1).toString(),
          target: (i + 2).toString(),
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
        });
      }

      setNodes(loadedNodes);
      setEdges(loadedEdges);
      setNodeId(data.length + 1); // increment for new nodes later

      console.log("📦 Reconstructed flow from DB", {
        loadedNodes,
        loadedEdges,
      });
    }
  }, [data]);

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes, edges]);

  const getNodeLabel = (
    roleId: number,
    description: string,
    index: number, // 👈 Accept current index in array
    onDelete?: () => void
  ) => (
    <div className="position-relative d-flex align-items-center">
      {onDelete && (
        <button
          onClick={onDelete}
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
      )}
      <button
        style={{
          position: "absolute",
          top: 10,
          left: -40,
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
        <Image
          src="/icons/drag-horizontal.svg"
          width={22}
          height={22}
          alt="drag"
        />
      </button>
      <div
        className="fw-bold fs12px rounded-circle d-flex justify-content-center align-items-center text-dark"
        style={{
          width: "40px",
          height: "40px",
          background: "#F2F7FA",
          flexShrink: 0,
        }}
      >
        {index + 1} {/* 👈 Show index + 1 */}
      </div>

      <div className="ms-3">
        <div className="fw-bold">
          {roles.find((role) => role.id === roleId)?.name}
        </div>
      </div>
    </div>
  );

  const getCurrentLeafNode = (
    nodes: Node[],
    edges: Edge[]
  ): Node | undefined => {
    const sourceIds = new Set(edges.map((e) => e.source));
    return nodes.find((node) => !sourceIds.has(node.id));
  };

  const handleAddNode = () => {
    if (!roleId || roleId === -1) {
      toast.error("Please add Role!");
      return;
    }

    const newId = nodeId.toString();

    const newNode: Node = {
      id: newId,
      data: {
        role: roleId,
        description: description,
        label: getNodeLabel(roleId, description, nodes.length, () =>
          handleDeleteNode(newId)
        ),
      },
      position: { x: 50 * nodeId, y: 110 * nodeId },
      style: {
        backgroundColor: hexToRgba(selectedColor, 0.2),
        color: "#000",
        padding: 10,
        borderRadius: 8,
        fontWeight: "bold",
        textAlign: "center",
        border: `1px solid ${hexToRgba(selectedColor, 1)}`,
        width: "450px",
      },
    };

    const leafNode = getCurrentLeafNode(nodes, edges);
    setNodes((prev) => [...prev, newNode]);

    // Create edge from previous node to this node
    if (leafNode) {
      const newEdge: Edge = {
        id: `e${leafNode.id}-${newId}`,
        source: leafNode.id,
        target: newId,
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
      };

      setEdges((prev) => [...prev, newEdge]);
    }

    setNodeId((id) => id + 1);
    // setRoleId(-1);
    // setDescription("");
  };

  const handleDeleteNode = (idToDelete: string) => {
    setNodes((prevNodes) => {
      // Get index of the node to be deleted
      const indexToDelete = prevNodes.findIndex(
        (node) => node.id === idToDelete
      );

      // Get previous and next nodes (based on index BEFORE deletion)
      const prevNode = prevNodes[indexToDelete - 1];
      const nextNode = prevNodes[indexToDelete + 1];

      // Filter out the node to delete
      const filteredNodes = prevNodes.filter((node) => node.id !== idToDelete);

      // Update labels
      const updatedNodes = filteredNodes.map((node, index) => ({
        ...node,
        data: {
          ...node.data,
          label: getNodeLabel(
            node.data.role as number,
            node.data.description as string,
            index,
            () => handleDeleteNode(node.id)
          ),
        },
      }));

      // Update edges after node state is changed
      setEdges((prevEdges) => {
        const cleanedEdges = prevEdges.filter(
          (e) => e.source !== idToDelete && e.target !== idToDelete
        );

        if (prevNode && nextNode) {
          const newEdgeId = `e${prevNode.id}-${nextNode.id}`;

          const exists = cleanedEdges.some((edge) => edge.id === newEdgeId);

          if (!exists) {
            const newEdge: Edge = {
              id: newEdgeId,
              source: prevNode.id,
              target: nextNode.id,
              type: "step",
            };
            return [...cleanedEdges, newEdge];
          }
        }

        return cleanedEdges;
      });

      return updatedNodes;
    });
  };

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

  const [trackTime, setTrackTime] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Watch for changes in nodes
  useEffect(() => {
    const now = new Date().toISOString();
    setLastUpdated(now);

    // Optional: for immediate display
    setTrackTime(getTimeAgo(now));
  }, [nodes.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setTrackTime(getTimeAgo(lastUpdated));
      }
    }, 60000); // update every 60 seconds

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const [toggleFullScreen, setToggleFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isClient) {
      if (!document.fullscreenElement) {
        setToggleFullScreen(true);
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
        setToggleFullScreen(false);
      }
    }
  };

  const logNodesInDisplayOrder = () => {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const childrenMap = new Map<string, string[]>();

    // Build children map from edges
    edges.forEach((edge) => {
      const source = edge.source;
      const target = edge.target;

      if (!childrenMap.has(source)) {
        childrenMap.set(source, []);
      }

      childrenMap.get(source)!.push(target);
    });

    // Find root node(s) — nodes that are not targets
    const allTargets = new Set(edges.map((e) => e.target));
    const rootNodes = nodes.filter((n) => !allTargets.has(n.id));

    const visited = new Set<string>();
    const ordered: typeof nodes = [];

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (node) {
        ordered.push(node);
        const children = childrenMap.get(nodeId) || [];
        children.forEach(dfs);
      }
    };

    // Start DFS from each root node
    rootNodes.forEach((root) => dfs(root.id));

    console.log("🧩 Nodes in display order:");
    ordered.forEach((node, index) => {
      console.log(`Node ${index + 1}:`, {
        displayIndex: index + 1,
        role: node.data.role,
        description: node.data.description,
        staticId: node.id,
      });
    });
  };

  const getNodesInDisplayOrder = (nodes: Node[], edges: Edge[]): Node[] => {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const childrenMap = new Map<string, string[]>();

    edges.forEach((edge) => {
      const source = edge.source;
      const target = edge.target;

      if (!childrenMap.has(source)) {
        childrenMap.set(source, []);
      }

      childrenMap.get(source)!.push(target);
    });

    const allTargets = new Set(edges.map((e) => e.target));
    const rootNodes = nodes.filter((n) => !allTargets.has(n.id));

    const visited = new Set<string>();
    const ordered: typeof nodes = [];

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (node) {
        ordered.push(node);
        const children = childrenMap.get(nodeId) || [];
        children.forEach(dfs);
      }
    };

    rootNodes.forEach((root) => dfs(root.id));
    return ordered;
  };

  const prepareDepartmentRolesSortingPayload = (
    nodes: Node[],
    edges: Edge[]
  ): DepartmentRolesSorting[] => {
    const ordered = getNodesInDisplayOrder(nodes, edges);

    return ordered.map((node, index) => ({
      roleId: node.data.role,
      sortOrder: index + 1,
      description: node.data.description,
    }));
  };

  const handleSubmit = async () => {
    const payload = prepareDepartmentRolesSortingPayload(nodes, edges);
    console.log("🧠 Final API Payload", payload);

    try {
      const response = await apiClient.post(
        `${DEPARTMENT_ROLES_SORTING_API}/save-sorting`,
        payload
      );
      console.log("response", response);
      toast.success("Successfully submitted!");
    } catch (error) {
      toast.error("Failed to submit.");
      console.error(error);
    }
  };

  const { data: roles } = useRoles();
  const defaultNumberOption = { value: "-1", label: "Select" };

  const roleNames: OptionType[] = roles.map((role) => {
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
      <div
        className="row bg-white p-2 d-flex align-items-center"
        style={{
          borderTopRightRadius: "5px",
          borderTopLeftRadius: "5px",
          border: "1px solid #E2E4E5",
        }}
      >
        {/* <Button className="btn btn-danger" onClick={logNodesInDisplayOrder}>
          Log UI Order
        </Button> */}

        <div className="col-12 col-sm-12 col-md-4 col-lg-3">
          <p className="m-0 fs20px fw-5">Department History</p>
        </div>
        <div className="col">
          <div className="row d-flex align-items-center justify-content-between">
            <div className="col-auto">
              <div className="row d-flex align-items-center">
                <div className="col-auto pe-0">
                  <Button
                    className="btn fw-5 fs15px"
                    style={{
                      border: "1px solid #E2E4E5",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      setNodes([]);
                      setEdges([]);
                    }}
                  >
                    <Image
                      src="/icons/refresh.svg"
                      width={24}
                      height={24}
                      alt="refresh"
                    />
                    &nbsp;Reset
                  </Button>
                </div>
                <div className="col-auto pe-0 text-muted">
                  <Image
                    src="/icons/clock-3.svg"
                    width={24}
                    height={24}
                    alt="clock"
                  />
                  &nbsp;&nbsp;{trackTime && <span>{trackTime}</span>}
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="row">
                <div className="col-auto">
                  <div className="row d-flex align-items-center justify-content-end">
                    <div className="col-auto pe-0">
                      <Button
                        className="btn fw-5 fs15px"
                        style={{
                          border: "1px solid #E2E4E5",
                          borderRadius: "8px",
                        }}
                        onClick={handleFullScreen}
                      >
                        {toggleFullScreen ? (
                          <span>
                            <BsFullscreenExit
                              width={24}
                              height={24}
                              className="mb-1"
                            />
                            &nbsp;Exit Full Screen
                          </span>
                        ) : (
                          <span>
                            <SlSizeFullscreen
                              width={24}
                              height={24}
                              className="mb-1"
                            />
                            &nbsp;Full Screen
                          </span>
                        )}
                      </Button>
                    </div>
                    <div className="col-auto pe-0">
                      <Button
                        className="btn fw-5 fs15px"
                        style={{
                          border: "1px solid #E2E4E5",
                          borderRadius: "8px",
                        }}
                      >
                        <MdOutlineRemoveRedEye
                          width={24}
                          height={24}
                          className="mb-1"
                        />
                        &nbsp;Preview
                      </Button>
                    </div>
                    <div className="col-auto">
                      <Button
                        className="btn fw-5 fs15px"
                        style={{
                          border: "1px solid #0C8CE9",
                          boxShadow: "0px 0px 5px 0px rgba(12, 140, 233, 0.35)",
                          borderRadius: "8px",
                        }}
                      >
                        <Image
                          src="/icons/ai.svg"
                          width={24}
                          height={24}
                          alt="ai"
                        />
                        &nbsp;AI Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" style={{ height: "72vh" }}>
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
                onClick={handleAddNode}
                className="btn bg-color-sea-blue text-white fs15px fw-5"
                style={{ borderRadius: "8px" }}
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
              <CustomSelect
                options={[defaultNumberOption, ...roleNames]}
                id="role"
                isClearable
                isSearchable
                onChangeSingle={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    setRoleId(Number(newValue.value));
                  }
                }}
              />
            )}
            {/* <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              type="text"
              className="form-control form-control-sm"
              placeholder="Admin"
            /> */}
          </div>

          <div className="col mb-3">
            <p className="fs14px fw-5 mb-2">Stage Color</p>
            <div className="row gap-2 m-0">
              {colorOptions.map((color) => (
                <Button
                  className="btn"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: 34,
                    height: 34,
                    background: color,
                    transition: "all .1s",
                    borderRadius: 5,
                    border:
                      selectedColor === color
                        ? "2px solid black"
                        : "1px solid #ccc",
                    cursor: "pointer",
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
                  onChange={(e) => setSelectedColor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col mb-3">
            <label htmlFor="description" className="form-label fs14px fw-5">
              Write Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              className="form-control form-control-sm"
              placeholder="Description..."
            />
          </div>
        </div>

        <div className="col-12 col-sm-12 col-md-6 col-lg-9 ">
          <HirarchyFlow
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            getNodeLabel={getNodeLabel}
            handleDeleteNode={handleDeleteNode}
          />
        </div>
      </div>
      <div
        className="row bg-white p-2"
        style={{
          position: "relative",
          borderBottomRightRadius: "5px",
          borderBottomLeftRadius: "5px",
          border: "1px solid #E2E4E5",
          zIndex: 999,
        }}
      >
        <div className="col">
          <Link href="/" className="btn">
            Cancel
          </Link>
        </div>
        <div className="col text-end">
          <Link
            href="/"
            className="btn fw-5 fs15px bg-white me-2"
            style={{
              border: "1px solid #E2E4E5",
              borderRadius: "8px",
            }}
          >
            <GoArrowLeft size={24} />
            &nbsp;Back
          </Link>
          <Button
            onClick={handleSubmit}
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
