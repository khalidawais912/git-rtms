"use client";
import { ReactNode, useState } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  button: ReactNode;
  body: ReactNode | ((close: () => void) => ReactNode); // ✅ make body a function
  modalId: string;
  size?: "sm" | "lg" | "xl" | undefined;
  isFullscreen?: true | false;
  allowOpen?: true | false;
  HeaderRightPos?: number;
  HeaderTopPos?: number;
  showCloseButton?: true | false;
  buttonColumn?: string; // col || col-auto
  dialogClassName?: string;
}

const CustomModal = ({
  button,
  body,
  modalId,
  size,
  isFullscreen = false,
  allowOpen = true,
  HeaderRightPos = 35,
  HeaderTopPos = 35,
  showCloseButton = true,
  buttonColumn = "col",
  dialogClassName = "custom-modal",
}: Props) => {
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    if (allowOpen) setShow(true);
  };

  const renderBody = () => {
    if (typeof body === "function") {
      return body(handleClose);
    }
    return body;
  };

  return (
    <>
      <div
        data-bs-target={`#${modalId}`}
        onClick={() => {
          handleShow();
        }}
        className={`${buttonColumn}`}
      >
        {button}
      </div>

      <Modal
        size={size}
        id={modalId}
        show={show}
        onHide={handleClose}
        aria-labelledby="position-relative contained-modal-title-vcenter"
        centered
        dialogClassName={dialogClassName}
        fullscreen={isFullscreen ? true : undefined}
      >
        {showCloseButton && (
          <Modal.Header
            closeButton
            className="border-0 position-absolute"
            style={{
              marginTop: "0px",
              right: HeaderRightPos,
              zIndex: 2,
              top: HeaderTopPos,
            }}
          ></Modal.Header>
        )}

        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          {renderBody()}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
