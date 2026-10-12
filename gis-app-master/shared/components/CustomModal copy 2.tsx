"use client";
import { ReactNode, useState } from "react";
import { Modal } from "react-bootstrap";
import Animation from "./Animation";

interface Props {
  button: ReactNode;
  body: ReactNode | ((close: () => void) => ReactNode);
  modalId: string;
  size?: "sm" | "lg" | "xl";
  isFullscreen?: boolean;
  allowOpen?: boolean;
  HeaderRightPos?: number;
  HeaderTopPos?: number;
  showCloseButton?: boolean;
  buttonColumn?: string; // col || col-auto
  dialogClassName?: string;

  // 👇 new animation props
  initialXPosition?: number;
  initialYPosition?: number;
  animationDuration?: number;
  animationDelay?: number;
  animationType?: "linear" | "easeIn" | "easeOut" | "circInOut" | "backOut";
  animateFromScreenEdge?: boolean;
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

  // default animation values
  initialXPosition = 0,
  initialYPosition = 0,
  animationDuration = 0.6,
  animationDelay = 0,
  animationType = "easeOut",
}: Props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [randomX, setRandomX] = useState<number>();

  // Helper function to randomly select 1500 or -1500
  const getRandomXPosition = (): 1500 | -1500 => {
    // Math.random() < 0.5 gives a 50% chance for each value
    return Math.random() < 0.5 ? 1500 : -1500;
  };

  const handleShow = () => {
    if (allowOpen) {
      setShow(true);
      if (initialXPosition === 0) setRandomX(getRandomXPosition());
    }
  };

  const renderBody = () => {
    if (typeof body === "function") {
      return body(handleClose);
    }
    return body;
  };

  return (
    <>
      {/* Trigger Button */}
      <div
        data-bs-target={`#${modalId}`}
        onClick={handleShow}
        className={`${buttonColumn}`}
      >
        {button}
      </div>

      {/* Modal */}
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
        {/* Close Button */}
        {showCloseButton && (
          <Modal.Header
            closeButton
            className="border-0 position-absolute"
            style={{
              right: HeaderRightPos,
              top: HeaderTopPos,
              zIndex: 2,
            }}
          />
        )}

        {/* Animated Modal Body */}
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          {isFullscreen ? (
            renderBody()
          ) : (
            <Animation
              trigger={show}
              initialXPosition={randomX ? randomX : initialXPosition}
              initialYPosition={initialYPosition}
              duration={animationDuration}
              delay={animationDelay}
              animationType={animationType}
            >
              {renderBody()}
            </Animation>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
