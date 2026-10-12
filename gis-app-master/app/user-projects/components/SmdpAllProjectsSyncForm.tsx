import Button from "@/app/components/Button";
import useSectors from "@/app/hooks/useSectors";
import apiClient, { AxiosError } from "@/app/services/api-client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import more from "../../../public/icons/more.svg";

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  setShowData: React.Dispatch<React.SetStateAction<boolean>>;
  showData: boolean;
}

interface SmdpSync {
  schemeId: string;
}

const SmdpAllProjectsSyncForm = ({
  api,
  method,
  id,
  setRefresh,
  refresh,
  showData,
  setShowData,
}: Props) => {
  const { data, setError } = useSectors({ refresh });
  const [formData, setFormData] = useState<SmdpSync>({
    schemeId: "",
  });
  const modalId = `formModal-${id}`;
  const [show, setShow] = useState(false);

  // messages
  const created = "Created Successfully";
  const updated = "Updated Successfully";
  const schemeError = "Please Scheme Id!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    switch (true) {
      case !formData.schemeId:
        notifyError(schemeError);
        break;

      default:
        try {
          // send a POST request to the server to add the product
          if (method === "POST") {
            const response = await apiClient({
              method: method,
              url: `${api}?SchemeID=${formData.schemeId}`,
            });
            notifyCreate(created);
            setFormData({
              schemeId: "",
            });
            console.log("response", response);
            setRefresh((prev) => !prev);
            setShowData(true);
            handleClose();
          } else {
            const response = await apiClient({
              method: method,
              url: `${api}/${id}`,
              data: formData,
            });
            console.log("response", response);
            notifyCreate(updated);
            setRefresh((prev) => !prev);
          }
          // handle the response and perform any necessary actions
          console.log("data", formData);
        } catch (err) {
          console.log((err as AxiosError).message);
          notifyError((err as AxiosError).message);
          setError((err as AxiosError).message);
        }
    }
  };

  return (
    <>
      {method === "POST" ? (
        <Button
          type="button"
          className="btn btn-sm text-white bg-color-sea-green"
          onClick={handleShow}
          style={{ whiteSpace: "nowrap" }}
        >
          + SMDP ALL PROJECTS SYNCHRONIZE
        </Button>
      ) : (
        <Button
          className="btn btn-sm rounded-pill"
          style={{ background: "#fff" }}
          onClick={handleShow}
        >
          <Image src={more} alt="more" />
        </Button>
      )}

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
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                {method === "POST" ? (
                  <p
                    className="text-center text-white mt-4"
                    style={{ fontSize: "1.5rem", fontWeight: "800" }}
                  >
                    <span>ADD SMDP SYNCHRONIZATION</span>
                  </p>
                ) : (
                  <p
                    className="text-center text-white mt-4"
                    style={{ fontSize: "1.5rem", fontWeight: "800" }}
                  >
                    <span>UPDATE SMDP SYNCHRONIZATION</span>
                  </p>
                )}
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit}>
                <div className="col-lg-12 col-md-12 col-sm-12 text-start mb-3">
                  <label
                    htmlFor="categoryType"
                    className="form-label text-white"
                  >
                    Category Type
                  </label>
                  <select
                    className="form-select form-select-sm"
                    aria-label="Default select example"
                    name="categoryType"
                    //   onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Scheduled">CM INITIATIVE</option>
                    <option value="Draft">ALL ADP</option>
                    <option value="Completed">PROGRESS GREATER THAN 20%</option>
                  </select>
                </div>
                <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
                  <Button
                    className="btn text-white w-100 border-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
                      borderRadius: "12px",
                    }}
                    type="button"
                  >
                    Done
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SmdpAllProjectsSyncForm;
