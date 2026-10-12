import { EVALUATION_SUPER_GROUP_API, SUPER_GROUP_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import { ActionMeta, SingleValue } from "react-select";
import { toast } from "react-toastify";
import superGroupBlack from "../../../public/icons/superGroupBlack.svg";
import { Option } from "./ProjectsList";
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

  const SUPER_GROUP_API_Endpoint = dashboardType
    ? EVALUATION_SUPER_GROUP_API
    : SUPER_GROUP_API;

  // Fetch previously selected groups
  const fetchSelectedOptions = async () => {
    try {
      const response = await apiClient.get(
        `${SUPER_GROUP_API_Endpoint}/GetSuperGroupByProjectId?ProjectId=${id}`
      );
      console.log("supergroup new api", response);
      const data = response.data.data; // Assuming this returns an array of group objects
      if (data?.id) {
        const selectedOptions = {
          id: data.id,
          superGroupLabel:
            options.find((option) => option.id === data.id)?.superGroupLabel ||
            "",
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

  // useEffect(() => {

  //   fetchSelectedOptions();
  // }, [id, refresh]);

  const handleSelectGroup = (
    newValue: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    if (newValue) {
      const selectedOptions = {
        id: Number(newValue.value),
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
          `${SUPER_GROUP_API_Endpoint}/AssignSuperGroupToProject?superGroupID=${optionId}&projectID=${id}`
        );
        console.log("supergroup assigned", response);
      } else {
        const response = await apiClient.post(
          `${SUPER_GROUP_API_Endpoint}/AssignSuperGroupToProject?projectID=${id}`
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
  const availableOptions: OptionType[] = options.map((group) => ({
    value: group.id.toString(),
    label: group.superGroupLabel,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues: OptionType[] = selectedOptions.map((group) => ({
    value: group.id.toString(),
    label: group.superGroupLabel,
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
          title="Super Group"
        >
          <Image
            src={superGroupBlack}
            alt="superGroup"
            width={26}
            height={26}
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
            <FormWrapper heading="Select Super Group">
              <form onSubmit={handleSubmit}>
                <div
                  className="col text-start mt-0"
                  style={{ marginBottom: "10px" }}
                >
                  <CustomSelect
                    id="groupSelect"
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChangeSingle={handleSelectGroup} // Correct handler
                    closeMenuOnSelect={true}
                    placeholder="Choose Super Group"
                  />
                </div>
                <SubmitButton>Save Super Group</SubmitButton>
              </form>
            </FormWrapper>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
