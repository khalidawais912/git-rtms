"use client";
import { PROJECT_DOCUMENT_NAMES_API } from "@/shared/api/endpoints";
import DeleteModal from "@/shared/components/DeleteModal";
import Loader from "@/shared/components/Loader/Loader";
import Actions from "@/shared/components/Table/Actions";
import Pagination from "@/shared/components/Table/Pagination";
import RowHeader from "@/shared/components/Table/RowHeader";
import TableData from "@/shared/components/Table/TableData";
import TableHeader from "@/shared/components/Table/TableHeader";
import TableHeading from "@/shared/components/Table/TableHeading";
import { useProjectDocumentNames } from "../hooks";
import apiClient, { AxiosError } from "@/shared/api/client";
import { sort } from "fast-sort";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import { ProjectDocumentName } from "../schema";

interface Props {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: Props) => {
  const { data, setData, setError, isLoading } = useProjectDocumentNames({
    refresh,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<ProjectDocumentName[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProjectDocumentName;
    direction: "asc" | "desc";
  } | null>(null);
  const [rows, setRows] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLimit, setPageLimit] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstRowRef = useRef<HTMLTableRowElement | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [rowHeight, setRowHeight] = useState<number | null>(null);

  useEffect(() => {
    // Skip recalculation if user manually set page limit
    if (isPageLimit) return;

    if (!containerRef.current) return;

    const availableHeight = containerRef.current.clientHeight - 80;

    // Select all real table rows
    const allRows = containerRef.current.querySelectorAll("tbody tr");
    if (!allRows.length) return;

    // Compute average row height
    const totalHeight = Array.from(allRows).reduce(
      (sum, row) => sum + row.getBoundingClientRect().height,
      0,
    );
    const avgHeight = totalHeight / allRows.length;

    // Only recalc if avg height changed significantly (new page, new data, etc.)
    if (!rowHeight || Math.abs(avgHeight - rowHeight) > 1) {
      const maxRows = Math.floor(availableHeight / avgHeight);
      if (maxRows > 0) {
        setRows(maxRows);
        setRowHeight(avgHeight);
      }
    }
  }, [data, currentPage, isPageLimit]);

  const notifyCreate = (msg: string) => toast.success(msg);
  const notifyError = (msg: string) => toast.error(msg);

  // 🔍 Search handler
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const value = e.target.value.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id, item.documentName]
        .filter(Boolean)
        .map((f) => String(f).toLowerCase())
        .some((field) => field.includes(value)),
    );
    setSearchTerm(e.target.value);
    setFilteredData(filtered);
  };

  // 🔁 Sorting handler
  const handleSort = (key: keyof ProjectDocumentName) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key, direction });
    setData(sort(data)[direction](key));
  };

  // 🗑 Delete handler
  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${PROJECT_DOCUMENT_NAMES_API}/${id}`);
      setRefresh((prev) => !prev);
      notifyCreate("Deleted successfully!");
    } catch (err) {
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  const effectiveData = searchTerm ? filteredData : data;
  const paginatedData = effectiveData.slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  // 🔹 Measure how many rows fit on screen (based on real first row)
  useEffect(() => {
    if (hasMeasured || !containerRef.current || !firstRowRef.current) return;

    const availableHeight = containerRef.current.clientHeight - 80;
    const rowHeight = firstRowRef.current.getBoundingClientRect().height || 40;

    // calculate how many rows fit exactly in the visible area
    const maxRows = Math.floor(availableHeight / rowHeight);
    if (maxRows > 0) setRows(maxRows);
    setHasMeasured(true);
  }, [hasMeasured, data]);

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Project Document Names"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleSearch}
        form={
          <div className="col-auto">
            <Form
              api={PROJECT_DOCUMENT_NAMES_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              setData={setData}
              data={data}
            />
          </div>
        }
      />

      <div className="table-responsive mb-2" style={{ margin: "0 -12px" }}>
        <div
          style={{ height: "calc(100vh - 260px)", overflow: "auto" }}
          ref={containerRef}
        >
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <TableHeading name="id" handleSort={() => handleSort("id")} />
                <TableHeading
                  name="name"
                  handleSort={() => handleSort("documentName")}
                />
                <TableHeading
                  name="isActive"
                  handleSort={() => handleSort("isActive")}
                />
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {paginatedData.map((d, index) => (
                  <motion.tr
                    key={d.id}
                    ref={index === 0 ? firstRowRef : null}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RowHeader>{d.id}</RowHeader>
                    <TableData>{d.documentName}</TableData>
                    <TableData>{d.isActive ? "Yes" : "No"}</TableData>
                    <TableData>
                      <Actions
                        deleteNode={
                          <DeleteModal handleDelete={handleDelete} id={d.id} />
                        }
                        formNode={
                          <Form
                            api={PROJECT_DOCUMENT_NAMES_API}
                            method="PUT"
                            id={d.id}
                            setRefresh={setRefresh}
                            refresh={refresh}
                            setData={setData}
                            data={data}
                          />
                        }
                      />
                    </TableData>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        rows={rows}
        setRows={setRows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setPageLimit={setPageLimit}
      />
    </>
  );
};

export default List;
