import { ATTRIBUTE_GROUP_MAPPING_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select, { ActionMeta, MultiValue } from "react-select";
import { toast } from "react-toastify";
import dbGrey from "../../../public/icons/dbGrey.svg";
import { Option } from "./List";

interface Props {
  id: number;
  options: Option[];
}

const GroupingForm = ({ id, options }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const modalId = `groupModal-${id}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
  };
  const handleClose = () => setShow(false);

  // Fetch previously selected groups
  useEffect(() => {
    const fetchSelectedOptions = async () => {
      try {
        const response = await apiClient.get(
          `${ATTRIBUTE_GROUP_MAPPING_API}/${id}`
        );
        const data = response.data.data; // Assuming this returns an array of group objects
        setSelectedOptions(data); // Set the selected groups as objects
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchSelectedOptions();
  }, [id, refresh]);

  const handleSelectGroup = (
    newValue: MultiValue<{ value: number; label: string }>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          attributeId: option.value,
          label: option.label,
        }))
      : [];

    setSelectedOptions(selectedOptions);
  };

  const updated = "Updated Successfully";
  const errorMessage = "Something Bad Happend";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const optionIds = selectedOptions.map((group) => group.attributeId);

    const data = {
      groupId: id,
      attributeIds: optionIds,
    };

    try {
      const response = await apiClient.post(ATTRIBUTE_GROUP_MAPPING_API, data);
      // notifyCreate(updated);
      console.log(response);
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const availableOptions = options.map((group) => ({
    value: group.attributeId,
    label: group.label,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues = selectedOptions.map((group) => ({
    value: group.attributeId,
    label: group.label,
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
          title="Attributes"
        >
          <Image src={dbGrey} alt="dbGrey" width={20} height={20} />
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
              className="container-fluid pt-3 pb-3 ps-4 pe-4"
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
                        SELECT ATTRIBUTES
                      </p>
                    </div>
                  </div>

                  <Select
                    id="groupSelect"
                    isMulti
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChange={handleSelectGroup} // Correct handler
                    styles={customStyles}
                    closeMenuOnSelect={false}
                    placeholder="Choose Attributes..."
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
