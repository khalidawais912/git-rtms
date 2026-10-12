"use client";
import {
  ATTRIBUTE_GROUP_MAPPING_API,
  EVALUATION_ATTRIBUTE_GROUP_MAPPING_API,
} from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Select, { ActionMeta, MultiValue } from "react-select";
import { toast } from "react-toastify";
import dbGrey from "../../../public/icons/dbGrey.svg";
import { Option } from "./List";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";

interface Props {
  id: number;
  options: Option[];
  dashboardType?: string;
}

const GroupingForm = ({ id, options, dashboardType }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const modalId = `groupModal-${id}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const ATTRIBUTE_GROUP_MAPPING_API_Endpoint = dashboardType
    ? EVALUATION_ATTRIBUTE_GROUP_MAPPING_API
    : ATTRIBUTE_GROUP_MAPPING_API;

  const fetchSelectedOptions = async () => {
    try {
      const response = await apiClient.get(
        `${ATTRIBUTE_GROUP_MAPPING_API_Endpoint}/${id}`
      );
      const data = response.data.data; // Assuming this returns an array of group objects
      console.log("attribute group mapping response data", data);
      setSelectedOptions(data); // Set the selected groups as objects
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
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          attributeId: Number(option.value),
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
      if (ATTRIBUTE_GROUP_MAPPING_API_Endpoint) {
        const response = await apiClient.post(
          ATTRIBUTE_GROUP_MAPPING_API_Endpoint,
          data
        );
        // notifyCreate(updated);
        console.log(response);
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const availableOptions: OptionType[] = options.map((group) => ({
    value: group.attributeId.toString(),
    label: group.label,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues: OptionType[] = selectedOptions.map((group) => ({
    value: group.attributeId.toString(),
    label: group.label,
  }));

  return (
    <>
      <div>
        <Button
          type="button"
          onClick={handleShow}
          className="btn btn-sm bg-transparent border-0"
          data-bs-target={`#${modalId}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Attributes"
        >
          <Image src={dbGrey} alt="dbGrey" width={26} height={26} />
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
            <FormWrapper heading="Select Attributes">
              <form onSubmit={handleSubmit}>
                <div
                  className="col text-start mt-0"
                  style={{ marginBottom: "10px" }}
                >
                  <CustomSelect
                    id="groupSelect"
                    isMulti
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChangeMulti={handleSelectGroup} // Correct handler
                    placeholder="Choose Attributes..."
                  />
                </div>
                <SubmitButton>Save Attributes</SubmitButton>
              </form>
            </FormWrapper>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
