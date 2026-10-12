// this component uses dynamic aniamtion selection if no animation is passed via props

"use client";
import { ReactNode, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import "./CustomModal.css";

// Animation type definitions
export type ModalAnimationType =
  | "none"
  | "slide-right"
  // | "slide-left"
  // | "slide-top"
  | "slide-bottom"
  | "zoom-in";
// | "zoom-rotate";
// | "fade-scale"
// | "flip-x"
// | "flip-y"
// | "bounce"
// | "elastic"
// | "rotate-3d";
// | "newspaper";
// | "fall";

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

const animationOptions: ModalAnimationType[] = [
  "slide-right",
  // "slide-left",
  // "slide-top",
  // "slide-bottom",
  "zoom-in",
  // "zoom-rotate",
  // "fade-scale",
  // "flip-x",
  // "flip-y",
  // "bounce",
  // "elastic",
  // "rotate-3d",
  // "newspaper",
  // "fall",
];

// const animationSpeeds: AnimationSpeed[] = ["normal", "slow", "fast"];
const animationSpeeds: AnimationSpeed[] = ["slow"];

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
  animation,
  animationSpeed,
  backdropAnimation = true,
  onOpen,
  onClose,
}: Props) => {
  const [show, setShow] = useState(false);

  // 🎲 Pick random animation only if props not provided
  const randomAnimation = useMemo<ModalAnimationType>(
    () =>
      animation ??
      animationOptions[Math.floor(Math.random() * animationOptions.length)],
    [animation]
  );

  const randomSpeed = useMemo<AnimationSpeed>(
    () =>
      animationSpeed ??
      animationSpeeds[Math.floor(Math.random() * animationSpeeds.length)],
    [animationSpeed]
  );

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  const handleShow = async () => {
    if (allowOpen) {
      setShow(true);
      onOpen?.();
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
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
    if (randomAnimation === "none") return "";

    const classes = [`modal-animation-${randomAnimation}`];

    if (randomSpeed !== "normal") {
      classes.push(`modal-animation-speed-${randomSpeed}`);
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

export default CustomModal;
