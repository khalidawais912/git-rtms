import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { PiCircleFill } from "react-icons/pi";
import { GroupBase, SingleValue, StylesConfig } from "react-select";
import Button from "../Button";
import { OptionType } from "../Form/CustomSelect";
import dynamic from "next/dynamic";

const CustomSelect = dynamic(() => import("../Form/CustomSelect"), {
  ssr: false,
});

interface Props {
  searchTerm: string;
  filteredData: any[];
  data: any[];
  rows: number;
  setRows: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  status?: string;
  rowCounts?: number[];
  setPageLimit?: Dispatch<SetStateAction<boolean>>;
}

const Pagination = ({
  searchTerm,
  filteredData,
  data,
  rows,
  setRows,
  currentPage,
  setCurrentPage,
  status,
  rowCounts = [10, 20, 30, 40, 50],
  setPageLimit,
}: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  const handleRowsPerPage = (count: number) => {
    setRows(count);
    setCurrentPage(1);
  };

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  //   const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages = Math.ceil(
    (searchTerm || status ? filteredData : data).length / rows,
  );
  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Maximum visible page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <div className="col p-0" key="ellipsis-start">
          <Button
            className="btn btn-sm bg-color-evaluation-theme-blue rounded-circle text-white border-0 d-flex justify-content-center align-items-center"
            disabled
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            <HiOutlineDotsHorizontal />
          </Button>
        </div>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <div key={i} className="col p-0">
          <Button
            className={`btn btn-sm rounded-circle border-0 d-flex justify-content-center align-items-center shadow-none fs-6 ${
              i === currentPage
                ? " fw-bold mb-2 color-dark-gray"
                : "fw-6 color-evaluation-theme-blue"
            }`}
            onClick={() => handlePageChange(i)}
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            {i}
          </Button>
        </div>,
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <div className="col p-0" key="ellipsis-end">
          <Button
            className="btn btn-sm bg-color-evaluation-theme-blue rounded-circle text-white border-0 d-flex justify-content-center align-items-center"
            disabled
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            <HiOutlineDotsHorizontal />
          </Button>
        </div>,
      );
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const defaultOption = { value: "0", label: "Select" };

  const rowCountOptions: OptionType[] = rowCounts.map((d) => {
    return {
      value: d.toString(),
      label: d.toString(),
    };
  });

  // useEffect(() => {
  //   setSelectedOptions([rowCountOptions[0]]);
  //   handleRowsPerPage(parseInt(rowCountOptions[0].value));
  // }, []);

  return (
    <>
      <div className="row m-0 justify-content-between align-items-center pb-2">
        <div className="col-auto">
          <div className="row align-items-center">
            <div className="col-auto pe-0 color-evaluation-theme-blue fw-6">
              {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, data.length)} of{" "}
              {(searchTerm || status ? filteredData : data).length} Records{" "}
            </div>
            <div className="col-auto">
              <span
                className="badge rounded-pill fs13px fw-6 color-evaluation-theme-blue"
                style={{
                  border: "1.08px solid #1C6BA6",
                  paddingBottom: "2px",
                }}
              >
                <div className="row align-items-center">
                  <div
                    className="col-auto pe-0"
                    style={{ paddingBottom: "4px" }}
                  >
                    <PiCircleFill
                      size={8}
                      className="color-evaluation-theme-blue"
                    />
                  </div>
                  <div className="col ps-1 color-evaluation-theme-blue">10</div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <div className="row align-items-center">
            <div className="col ps-0" style={{ paddingRight: "10px" }}>
              <Button
                className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                  currentPage === 1
                    ? "bg-color-light-gray "
                    : "bg-color-evaluation-theme-blue"
                }`}
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                style={{
                  width: "27px",
                  height: "27px",
                  padding: 0, // remove extra padding from btn-sm
                }}
              >
                <Image
                  src="/icons/evaluation/doubleArrowLeft.svg"
                  alt="doubleArrowLeft"
                  width={13}
                  height={13}
                />
              </Button>
            </div>
            <div className="col ps-0" style={{ paddingRight: "10px" }}>
              <Button
                className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                  currentPage === 1
                    ? "bg-color-light-gray "
                    : "bg-color-evaluation-theme-blue"
                }`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{
                  width: "27px",
                  height: "27px",
                  padding: 0, // remove extra padding from btn-sm
                }}
              >
                <Image
                  src="/icons/evaluation/singleArrowLeft.svg"
                  alt="singleArrowLeft"
                  width={13}
                  height={13}
                />
              </Button>
            </div>
            {renderPageNumbers()}
            <div className="col ps-0" style={{ paddingRight: "10px" }}>
              <Button
                className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                  currentPage === totalPages
                    ? "bg-color-light-gray "
                    : "bg-color-evaluation-theme-blue"
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  width: "27px",
                  height: "27px",
                  padding: 0, // remove extra padding from btn-sm
                }}
              >
                <Image
                  src="/icons/evaluation/singleArrowLeft.svg"
                  alt="singleArrowLeft"
                  width={13}
                  height={13}
                  style={{ rotate: "180deg" }}
                />
              </Button>
            </div>
            {/* <div className="col ps-0" style={{ paddingRight: "10px" }}>
              <Button
                className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                  currentPage === totalPages
                    ? "bg-color-light-gray "
                    : "bg-color-evaluation-theme-blue"
                }`}
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                style={{
                  width: "27px",
                  height: "27px",
                  padding: 0, // remove extra padding from btn-sm
                }}
              >
                <Image
                  src="/icons/evaluation/doubleArrowLeft.svg"
                  alt="doubleArrowLeft"
                  width={13}
                  height={13}
                  style={{ rotate: "180deg" }}
                />
              </Button>
            </div> */}
          </div>
        </div>
        <div className="col-auto">
          {setPageLimit && (
            <CustomSelect
              menuPlacement="top"
              isClearable={false}
              options={[defaultOption, ...rowCountOptions]}
              isSearchable={false}
              closeMenuOnSelect={true}
              singleSelectStyles={paginationSelectStyles}
              value={selectedOptions}
              onChangeSingle={(
                newValue: SingleValue<{ value: string; label: string }>,
              ) => {
                if (newValue) {
                  if (Number(newValue.value) === 0) {
                    setPageLimit(false);
                  } else {
                    setPageLimit(true);
                    handleRowsPerPage(Number(newValue.value));
                    setSelectedOptions([
                      {
                        label: newValue.label,
                        value: newValue.value,
                      },
                    ]);
                  }
                }
              }}
            />
          )}

          {/* <select
            className="rounded bg-color-evaluation-theme-blue text-white p-2"
            style={{
              color: "#fff",
              border: "1px solid #445E84",
              outline: "none",
            }}
            aria-label="Rows per page"
            id="rowPerPage"
            value={rows}
            onChange={handleRowsPerPage}
          >
            {[10, 20, 30, 40, 50].map((num) => (
              <option key={num} value={num}>
                &nbsp;{num}
              </option>
            ))}
          </select> */}
        </div>
      </div>
    </>
  );
};

export default Pagination;

// Custom Single Select Style
export const paginationSelectStyles: StylesConfig<
  OptionType,
  false,
  GroupBase<OptionType>
> = {
  control: (base, state) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "8px", // Narrower scrollbar
      height: "8px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#22a3bd",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#108fa8",
    },
    fontWeight: 600,
    borderRadius: 20,
    background: "#fff",
    border: "none",
    boxShadow: "0 0 0 1.5px #1C6BA6",
    paddingLeft: "7px",
    paddingRight: "6px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#545861", // ✅ selected value text
    fontSize: "16px",
    fontWeight: 600,
    padding: 0,
    margin: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    padding: 0,
    background: "#1C6BA6",
    border: "1.35px solid #1C6BA6",
    overflow: "hidden",
    borderRadius: "20px",
    marginLeft: "5px",
    color: state.isFocused ? "#fff" : "rgba(255,255,255,0.9)",
    width: "21px",
    height: "21px",
    "&:hover": {
      color: "#fff", // hover border color
    },
  }),

  indicatorSeparator: (base) => ({
    ...base,
    display: "none", // remove vertical line if needed
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 4,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    padding: "4px 8px",
    borderRadius: 14,
    border: 0,
    boxShadow: "0px 0px 7px 3px rgba(0,0,0,0.1)",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#C2E7E4" // selected background color
      : state.isFocused
        ? "#E4EDEC" // hover background color
        : "white",
    color: "#333",
    fontSize: "14px",
    padding: "10px",
    borderRadius: 7,
  }),
  // Styles for the dropdown menu list (this is where scrollbar lives)
  menuList: (base) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#22a3bd",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#108fa8",
    },
  }),
};
