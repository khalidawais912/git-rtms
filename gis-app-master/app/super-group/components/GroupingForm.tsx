import { EVALUATION_SUPER_GROUP_API, SUPER_GROUP_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import { SuperGroup } from "@/app/hooks/useSuperGroups";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ActionMeta, MultiValue } from "react-select";
import { toast } from "react-toastify";
import groupGrey from "../../../public/icons/groupGray.svg";
import { Option } from "./List";
import SubmitButton from "@/app/components/Form/SubmitButton";

interface Props {
  id: number;
  options: Option[];
  superGroups: SuperGroup[];
  dashboardType?: string;
}

const GroupingForm = ({ id, options, dashboardType, superGroups }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const modalId = `groupModal-${id}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
  };
  const handleClose = () => setShow(false);

  const SUPER_GROUP_API_Endpoint = dashboardType
    ? EVALUATION_SUPER_GROUP_API
    : SUPER_GROUP_API;

  const fetchSelectedOptions = async (superGroups: SuperGroup[]) => {
    try {
      const matchedSuperGroup = superGroups?.find(
        (superGroup) => superGroup.id === id
      );

      if (matchedSuperGroup) {
        // Get the list of group IDs from groupsList in the superGroup
        const selectedGroupIds = matchedSuperGroup.groupsList.map(
          (group) => group.id
        );

        // Match these group IDs with available options to pre-select them
        const preSelectedOptions = options.filter((option) =>
          selectedGroupIds.includes(option.id)
        );
        setSelectedOptions(preSelectedOptions); // Set the selected groups as objects
      }
    } catch (error) {
      console.error("Error fetching selected groups:", error);
    }
  };

  // Fetch previously selected groups
  useEffect(() => {
    fetchSelectedOptions(superGroups);
  }, [id, refresh, show, superGroups]);

  const handleSelectGroup = (
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          id: Number(option.value),
          name: option.label,
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
    const optionIds = selectedOptions.map((group) => group.id);
    console.log("optionIds", optionIds);
    const data = {
      superGroupId: id,
      groupsId: optionIds,
    };

    try {
      const response = await apiClient.post(
        `${SUPER_GROUP_API_Endpoint}/addGroupsToSuperGroup`,
        data
      );
      // notifyCreate(updated);
      console.log(response);
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const availableOptions: OptionType[] = options.map((group) => ({
    value: group.id.toString(),
    label: group.name,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues: OptionType[] = selectedOptions.map((group) => ({
    value: group.id.toString(),
    label: group.name,
  }));

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
          title="Attribute Groups"
        >
          <Image src={groupGrey} alt="groupGrey" width={26} height={26} />
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
            <FormWrapper heading="Select Attribute Groups">
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
                    closeMenuOnSelect={false}
                    placeholder="Choose Attribute Groups..."
                  />
                </div>
                <SubmitButton>Save Attribute Groups</SubmitButton>
              </form>
            </FormWrapper>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
