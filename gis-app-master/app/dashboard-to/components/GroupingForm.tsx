import { PROJECT_API, SUPER_GROUP_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import Select, { ActionMeta, SingleValue } from "react-select";
import { toast } from "react-toastify";
import superGroupBlack from "../../../public/icons/superGroupBlack.svg";
import { Option } from "./UserProjectsList";
interface Props {
  id: number;
  options: Option[];
}

const GroupingForm = ({ id, options }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const modalId = `groupModal-${id}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const fetchSelectedOptions = async () => {
    try {
      const response = await apiClient.get(`${PROJECT_API}/${id}`);
      const data = response.data.data; // Assuming this returns an array of group objects
      if (data?.superGroupID) {
        const selectedOptions = {
          id: data.superGroupID,
          superGroupLabel:
            options.find((option) => option.id === data.superGroupID)
              ?.superGroupLabel || "",
        };
        setSelectedOptions([selectedOptions]);
      }
      // setSelectedOptions(data.superGroupID); // Set the selected groups as objects
    } catch (error) {
      console.error("Error fetching selected groups:", error);
    }
  };

  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
    if (id) {
      fetchSelectedOptions();
    }
  };
  const handleClose = () => setShow(false);

  const handleSelectGroup = (
    newValue: SingleValue<{ value: number; label: string }>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => {
    if (newValue) {
      const selectedOptions = {
        id: newValue.value,
        superGroupLabel: newValue.label,
      };
      setSelectedOptions([selectedOptions]);
    } else {
      setSelectedOptions([]);
    }
  };

  const updated = "Updated Successfully";
  const errorMessage = "Something Bad Happend";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const optionId = selectedOptions
      ? selectedOptions.map((group) => group.id)
      : null;

    console.log("selectedOptions", selectedOptions);
    try {
      if (selectedOptions.length > 0) {
        const response = await apiClient.post(
          `${SUPER_GROUP_API}/AssignSuperGroupToProject?superGroupID=${optionId}&projectID=${id}`
        );
        console.log(response);
      } else {
        const response = await apiClient.post(
          `${SUPER_GROUP_API}/AssignSuperGroupToProject?projectID=${id}`
        );
        console.log(response);
      }
      // notifyCreate(updated);
      // console.log(response);
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const availableOptions = options.map((group) => ({
    value: group.id,
    label: group.superGroupLabel,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues = selectedOptions.map((group) => ({
    value: group.id,
    label: group.superGroupLabel,
  }));

  // Custom styles for react-select options
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#B0E0E6" // Light blue for selected options
        : provided.backgroundColor,
      color: state.isSelected ? "#000" : provided.color,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#B0E0E6", // Light blue for selected values
    }),
  };

  return (
    <>
      <div>
        <Button
          type="button"
          onClick={handleShow}
          className="btn btn-sm"
          data-bs-target={`#${modalId}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Super Group"
        >
          <Image
            src={superGroupBlack}
            alt="superGroup"
            width={20}
            height={20}
          />
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName="custom-modal"
          id={modalId}
        >
          <Modal.Body
            className="p-0"
            style={{ background: "rgba(156,255,255,0)" }}
          >
            <div
              className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
                borderRadius: "15px",
                border: "1.7px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="row d-flex">
                    <div className="col">
                      <p
                        className="text-center text-white"
                        style={{ fontSize: "1.5rem", fontWeight: "800" }}
                      >
                        SELECT SUPER GROUP
                      </p>
                    </div>
                  </div>

                  <Select
                    id="groupSelect"
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChange={handleSelectGroup} // Correct handler
                    styles={customStyles}
                    closeMenuOnSelect={false}
                    placeholder="Choose Super Group"
                    isClearable={true}
                  />
                </div>
                <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
                  <Button
                    className="btn text-white w-100 border-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
                      borderRadius: "12px",
                    }}
                    type="submit"
                  >
                    Done
                  </Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
