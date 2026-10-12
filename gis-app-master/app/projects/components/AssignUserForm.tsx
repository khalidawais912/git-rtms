import {
  ASSIGN_USER_TO_PROJECT_API,
  GET_ASSIGNED_USERS_TO_PROJECT_API,
} from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ActionMeta, MultiValue } from "react-select";
import { toast } from "react-toastify";
import user3Black from "../../../public/icons/user3Black.svg";
import { UserOption } from "./ProjectsList";
import SubmitButton from "@/app/components/Form/SubmitButton";

interface Props {
  id: number;
  options: UserOption[];
}

const AssignUserForm = ({ id, options }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<UserOption[]>([]);
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
          `${GET_ASSIGNED_USERS_TO_PROJECT_API}?projectId=${id}`
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
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          id: Number(option.value),
          userName: option.label,
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

    const data = {
      projectID: id,
      usersIds: optionIds,
    };

    try {
      const response = await apiClient.post(ASSIGN_USER_TO_PROJECT_API, data);
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
    label: group.userName,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues: OptionType[] = selectedOptions.map((group) => ({
    value: group.id.toString(),
    label: group.userName,
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
          title="Users"
        >
          <Image src={user3Black} alt="user" width={26} height={26} />
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
            <FormWrapper heading="Select Users">
              <form onSubmit={handleSubmit}>
                <div
                  className="col text-start mt-0"
                  style={{ marginBottom: "10px" }}
                >
                  <CustomSelect
                    id="groupSelect"
                    isMulti={true}
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChangeMulti={handleSelectGroup} // Correct handler
                    placeholder="Choose Users..."
                  />
                </div>
                <SubmitButton>Save Users</SubmitButton>
              </form>
            </FormWrapper>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AssignUserForm;
