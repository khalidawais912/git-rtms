"use client";
import { VEHICLE_API } from "@/services/endpoints";
import Avatar from "@/components/Avatar";
import DeleteModal from "@/components/DeleteModal";
import Loader from "@/components/Loader/Loader";
import Actions from "@/components/Table/Actions";
import Pagination from "@/components/Table/Pagination";
import RowHeader from "@/components/Table/RowHeader";
import TableData from "@/components/Table/TableData";
import TableHeader from "@/components/Table/TableHeader";
import TableHeading from "@/components/Table/TableHeading";
import TableWrapper from "@/components/Table/TableWrapper";
import { useVehicle } from "../hooks";
import { Vehicle } from "../types";
import apiClient, { AxiosError } from "@/services/client";
import { sort } from "fast-sort";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, isLoading } = useVehicle({
    refresh,
  });
  const [isPageLimit, setPageLimit] = useState(false);

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Vehicle[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.color,
        item.fuelType,
        item.description,
        item.model,
        item.name,
        item.seatsCapacity.toString(),
        item.trasnmission,
        item.vehicleNumber,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase())),
    );
    setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Vehicle;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Vehicle) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = sort(data)[direction](key);
    setSortConfig({ key, direction });
    setData([...sortedData]);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${VEHICLE_API}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.id !== id));
      notifyCreate(deleteMessage);
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows,
  );

  return (
    <>
      <>
        {isLoading && <Loader />}
        <TableHeader
          heading="Vehicles"
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          handleChange={handleChange}
          form={
            <div className="col-auto">
              <Form
                api={VEHICLE_API}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          }
        />
      </>
      <TableWrapper
        setRows={setRows}
        currentPage={currentPage}
        data={data}
        isPageLimit={isPageLimit}
      >
        {(firstRowRef) => (
          <>
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
                  name="vehicle Number"
                  handleSort={() => handleSort("vehicleNumber")}
                />
                <TableHeading
                  name="model"
                  handleSort={() => handleSort("model")}
                />
                <TableHeading
                  name="color"
                  handleSort={() => handleSort("color")}
                />
                <TableHeading
                  name="transmission"
                  handleSort={() => handleSort("trasnmission")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="seats Capacity"
                  handleSort={() => handleSort("seatsCapacity")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="fuel Type"
                  handleSort={() => handleSort("fuelType")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="vehicle Image"
                  handleSort={() => handleSort("vehicleImage")}
                />
                <TableHeading
                  className="text-nowrap"
                  name="vehicle Icon"
                  handleSort={() => handleSort("vehicleIcon")}
                />
                <TableHeading name="ACTIONS" textClassName="text-center" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((d, i) => (
                <tr key={i} ref={i === 0 ? firstRowRef : null}>
                  <RowHeader>{d.id}</RowHeader>
                  <TableData>{d.name}</TableData>
                  <TableData>{d.description}</TableData>
                  <TableData>{d.vehicleNumber}</TableData>
                  <TableData>{d.model}</TableData>
                  <TableData>{d.color}</TableData>
                  <TableData>{d.trasnmission}</TableData>
                  <TableData>{d.seatsCapacity}</TableData>
                  <TableData>{d.fuelType}</TableData>
                  <TableData className="text-center">
                    {d.vehicleImage && d.vehicleImage.length > 0 && (
                      <Avatar
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicleImage}`}
                        styles={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                        defaultImagePath="/icons/car1Right.svg"
                        width={70}
                        height={70}
                      />
                    )}
                  </TableData>
                  <TableData className="text-center">
                    {d.vehicleIcon && d.vehicleIcon.length > 0 && (
                      <Avatar
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicleIcon}`}
                        styles={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                        defaultImagePath="/images/carTop2.png"
                        width={70}
                        height={70}
                      />
                    )}
                  </TableData>
                  <TableData>
                    <Actions
                      deleteNode={
                        <DeleteModal handleDelete={handleDelete} id={d.id} />
                      }
                      formNode={
                        <Form
                          api={VEHICLE_API}
                          method="PUT"
                          id={d.id}
                          setRefresh={setRefresh}
                          refresh={refresh}
                        />
                      }
                    />
                  </TableData>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </TableWrapper>
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
