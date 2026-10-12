import { UPDATE_USER_ROLE_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomSelect, { OptionType } from "@/app/components/Form/CustomSelect";
import FormWrapper from "@/app/components/Form/FormWrapper";
import SubmitButton from "@/app/components/Form/SubmitButton";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import { ActionMeta, SingleValue } from "react-select";
import { toast } from "react-toastify";
import rolesBlack from "../../../public/icons/rolesBlack.svg";
import { Option } from "./List";
interface Props {
  id: number;
  options: Option[];
  userName: string;
}

const GroupingForm = ({ id, options, userName }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const modalId = `groupModal-${id}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
  };
  const handleClose = () => setShow(false);

  // uncomment this hook if api is giving role id, until keep it commented
  // Fetch previously selected groups
  // useEffect(() => {
  //   const fetchSelectedOptions = async () => {
  //     try {
  //       const response = await apiClient.get(`${ROLE_API}/${id}`);
  //       const data = response.data.data; // Assuming this returns an array of group objects
  //       if (data.roleId) {
  //         const selectedOptions = {
  //           id: data.roleId,
  //           name:
  //             options.find((option) => option.id === data.roleId)?.name || "",
  //         };
  //         setSelectedOptions([selectedOptions]);
  //       }
  //       // setSelectedOptions(data.superGroupID); // Set the selected groups as objects
  //     } catch (error) {
  //       console.error("Error fetching selected groups:", error);
  //     }
  //   };

  //   fetchSelectedOptions();
  // }, [id, refresh]);

  const handleSelectGroup = (
    newValue: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>,
  ) => {
    if (newValue) {
      const selectedOptions = {
        id: Number(newValue.value),
        name: newValue.label,
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
    const roleName = selectedOptions
      ? selectedOptions.map((group) => group.name)
      : null;

    console.log("selectedOptions", selectedOptions);
    try {
      const response = await apiClient.post(
        `${UPDATE_USER_ROLE_API}?UserName=${userName}&RoleName=${roleName}`,
      );
      console.log(response);
      // notifyCreate(updated);
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
          title="Role"
        >
          <Image src={rolesBlack} alt="rolesBlack" width={26} height={26} />
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
            <FormWrapper heading="Select Role">
              <form onSubmit={handleSubmit}>
                <div
                  className="col text-start mt-0"
                  style={{ marginBottom: "10px" }}
                >
                  <CustomSelect
                    id="role"
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChangeSingle={handleSelectGroup} // Correct handler
                    placeholder="Choose Role"
                    closeMenuOnSelect
                  />
                </div>
                <SubmitButton>Save Role</SubmitButton>
              </form>
            </FormWrapper>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
