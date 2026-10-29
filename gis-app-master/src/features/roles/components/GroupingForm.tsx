import { ADD_RIGHTS_TO_ROLE_API, GET_RIGHTS_BY_ROLE_API } from "@/services/endpoints";
import Button from "@/components/Button";
import CustomSelect from "@/components/Form/CustomSelect";
import { OptionType } from "@/components/types";
import FormWrapper from "@/components/Form/FormWrapper";
import apiClient from "@/services/client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { MultiValue } from "react-select";
import rightsBlack from "@/public/icons/rightsBlack.svg";
import { Option } from "../types";
import SubmitButton from "@/components/Form/SubmitButton";
import { useEffectEvent } from "@/hooks/useEffectEvent";

interface Props {
  id: number;
  options: Option[];
  name: string;
}

const GroupingForm = ({ id, options, name }: Props) => {
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
  const onIdChange = useEffectEvent(() => {
    const fetchSelectedOptions = async () => {
      try {
        const response = await apiClient.get(
          `${GET_RIGHTS_BY_ROLE_API}?RoleName=${name}`
        );
        const data = response.data.data; // Assuming this returns an array of group objects
        setSelectedOptions(data); // Set the selected groups as objects
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchSelectedOptions();
  });
  useEffect(() => onIdChange(), [id, refresh, onIdChange]);

  const handleSelectGroup = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          rightId: Number(option.value),
          rightName: option.label,
        }))
      : [];

    setSelectedOptions(selectedOptions);
  };



  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const optionIds = selectedOptions.map((group) => group.rightId);

    const data = optionIds;

    try {
      await apiClient.post(
        `${ADD_RIGHTS_TO_ROLE_API}?RoleID=${id}`,
        data
      );
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const availableOptions: OptionType[] = options.map((group) => ({
    value: group.rightId.toString(),
    label: group.rightName,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues: OptionType[] = selectedOptions?.map((group) => ({
    value: group.rightId.toString(),
    label: group.rightName,
  }));

  // Custom styles for react-select options

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
          title="Rights"
        >
          <Image src={rightsBlack} alt="rightsBlack" width={26} height={26} />
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
            <FormWrapper heading="Select Rights">
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
                    placeholder="Choose Rights..."
                  />
                </div>
                <SubmitButton>Save Rights</SubmitButton>
              </form>
            </FormWrapper>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
