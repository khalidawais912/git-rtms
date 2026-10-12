"use client";
import { SECTOR_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader/Loader";
import Actions from "@/app/components/Table/Actions";
import Pagination from "@/app/components/Table/Pagination";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import RowHeader from "@/app/components/Table/RowHeader";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SectorForm from "./SectorForm";

interface SectorsTableProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SectorsTable = ({ refresh, setRefresh }: SectorsTableProps) => {
  const { data, setData, setError, isLoading } = useSectors({ refresh });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Sector[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Sector;
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
      [item.id, item.name, item.description, item.sortId]
        .filter(Boolean)
        .map((f) => String(f).toLowerCase())
        .some((field) => field.includes(value)),
    );
    setSearchTerm(e.target.value);
    setFilteredData(filtered);
  };

  // 🔁 Sorting handler
  const handleSort = (key: keyof Sector) => {
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
      await apiClient.delete(`${SECTOR_API}/${id}`);
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

  const getParentSector = (parentId: number, data: Sector[]) =>
    data.find((s) => s.id === parentId)?.name || "-";

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
        heading="Sectors"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleSearch}
        form={
          <div className="col-auto">
            <SectorForm
              api={SECTOR_API}
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
                  handleSort={() => handleSort("name")}
                />
                <TableHeading
                  name="description"
                  handleSort={() => handleSort("description")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="parent sector"
                  handleSort={() => handleSort("parentId")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="sort id"
                  handleSort={() => handleSort("sortId")}
                />
                {/* <TableHeading
                  className="text-nowrap"
                  name="created at"
                  handleSort={() => handleSort("createdAt")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="update at"
                  handleSort={() => handleSort("updateAt")}
                /> */}
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
                    <TableData>{d.name}</TableData>
                    <TableData>{d.description}</TableData>
                    <TableData>{getParentSector(d.parentId, data)}</TableData>
                    <TableData className="text-center">{d.sortId}</TableData>
                    {/* <TableData>
                      {d.createdAt &&
                        new Date(d.createdAt).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                    </TableData> */}
                    {/* <TableData>
                      {d.updateAt &&
                        new Date(d.updateAt).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                    </TableData> */}
                    <TableData>
                      <Actions
                        deleteNode={
                          <DeleteModal handleDelete={handleDelete} id={d.id} />
                        }
                        formNode={
                          <SectorForm
                            api={SECTOR_API}
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

export default SectorsTable;
