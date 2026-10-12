// this component uses default aniamtion, and you can change animation via props
"use client";
import { ReactNode, useState } from "react";
import { Modal } from "react-bootstrap";
import "./CustomModal.css";

// Animation type definitions
export type ModalAnimationType =
  | "none"
  | "slide-right"
  | "slide-left"
  | "slide-top"
  | "slide-bottom"
  | "zoom-in"
  | "zoom-rotate"
  | "fade-scale"
  | "flip-x"
  | "flip-y"
  | "bounce"
  | "elastic"
  | "rotate-3d"
  | "newspaper"
  | "fall";

export type AnimationSpeed = "normal" | "slow" | "fast";

interface Props {
  button: ReactNode;
  body: ReactNode | ((close: () => void) => ReactNode);
  modalId: string;
  size?: "sm" | "lg" | "xl" | undefined;
  isFullscreen?: boolean;
  allowOpen?: boolean;
  HeaderRightPos?: number;
  HeaderTopPos?: number;
  showCloseButton?: boolean;
  buttonColumn?: string;
  dialogClassName?: string;

  // 🎨 ANIMATION PROPS
  animation?: ModalAnimationType;
  animationSpeed?: AnimationSpeed;
  backdropAnimation?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const CustomModalDefault = ({
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
  animation = "fade-scale",
  animationSpeed = "normal",
  backdropAnimation = true,
  onOpen,
  onClose,
}: Props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  const handleShow = async () => {
    if (allowOpen) {
      setShow(true);
      onOpen?.();
    }
  };

  const renderBody = () => {
    if (typeof body === "function") {
      return body(handleClose);
    }
    return body;
  };

  // 🎨 Build animation class names
  const getAnimationClassName = () => {
    if (animation === "none") return "";

    const classes = [`modal-animation-${animation}`];

    if (animationSpeed !== "normal") {
      classes.push(`modal-animation-speed-${animationSpeed}`);
    }

    return classes.join(" ");
  };

  return (
    <>
      <div
        data-bs-target={`#${modalId}`}
        onClick={handleShow}
        className={buttonColumn}
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
        // 🔥 FIX: Apply animation class to Modal's className, NOT dialogClassName
        className={getAnimationClassName()}
        dialogClassName={dialogClassName}
        fullscreen={isFullscreen ? true : undefined}
        backdrop={backdropAnimation ? true : "static"}
        backdropClassName={backdropAnimation ? "animated-backdrop" : ""}
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
          />
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

export default CustomModalDefault;
