import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { useEffect, useState } from "react";
import styles from "./Menu.module.css";

interface Props {
  tideOneImage?: string;
  tideTwoImage?: string;
  icon?: string;
  value: number;
  label: string;
  showTides?: boolean;
  background?: string;
  outline?: string;
  showPercentageSign?: boolean;
  showArrow?: boolean;
  textWrap?: boolean;
  isGrouped?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  showValueInDecimal?: boolean;
  toggleLabel?: boolean;
  sneCount?: number;
  nonSneCount?: number;
  classNames?: string;
  labelColor?: string;
}

const Menu = ({
  background,
  tideOneImage = "/images/tideOne.png",
  tideTwoImage = "/images/tideTwo.png",
  icon,
  value,
  label,
  showTides,
  outline,
  showPercentageSign = false,
  showArrow = false,
  textWrap = true,
  isGrouped = false,
  showValueInDecimal = false,
  toggleLabel = false,
  sneCount = 0,
  nonSneCount = 0,
  classNames = "",
  labelColor = "",
}: Props) => {
  const [randomValue1, setRandomValue1] = useState(0);
  const [randomValue2, setRandomValue2] = useState(0);

  useEffect(() => {
    setRandomValue1(Math.random() * 100);
    setRandomValue2(Math.random() * 100);
  }, []);

  return (
    <div
      className={`col-auto ${isGrouped ? "mb-1" : "mb-2"} shadow-sm ${
        styles.cardContainer
      } ${classNames}`}
      style={{
        outline: outline,
        background: background,
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        transition: "all .4s",
      }}
    >
      {showTides && (
        <>
          <motion.div
            initial={{ x: -200, y: 200 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: randomValue1 }} // Move to Y = 0 (top)
            transition={{ duration: 3, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: 1, left: -50, right: 0 }}
          >
            <img
              src={tideOneImage}
              alt="tideOne"
              style={{ width: "160%", height: "170px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 200, y: 200 }} // Start from Y position (dynamic)
            animate={{ x: -200, y: randomValue2 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: 0, left: -35, right: 0 }}
          >
            <img
              src={tideTwoImage}
              alt="tideTwo"
              style={{ width: "250%", height: "170px" }}
            />
          </motion.div>
        </>
      )}
      {showArrow && (
        <div style={{ position: "absolute", right: 0 }}>
          <img
            src="/icons/linkArrow.svg"
            className="img-fluid"
            style={{
              width: `${isGrouped ? "15px" : "20px"}`,
              height: `${isGrouped ? "15px" : "20px"}`,
            }}
            alt="linkArrow"
          />
        </div>
      )}
      <div
        className={`row d-flex flex-nowrap justify-content-center align-items-center m-0 position-relative ${
          showArrow && isGrouped
            ? "mt-1"
            : showArrow && !isGrouped
            ? "mt-2"
            : ""
        }`}
        style={{ zIndex: 2, padding: isGrouped ? "0px" : "8px 0px" }}
      >
        {icon && (
          <div className="col-auto text-lg-end text-md-center text-center pe-0">
            <img
              src={icon}
              alt={icon}
              className="img-fluid"
              style={{
                width: `${isGrouped ? "30px" : "40px"}`,
                height: `${isGrouped ? "30px" : "40px"}`,
              }}
            />
          </div>
        )}
        {icon ? (
          <div
            className={`col-auto text-white fw-5 text-wrap text-break ps-0`}
            style={{
              fontSize: isGrouped ? "1.5rem" : "1.8rem",
            }}
          >
            <AnimatedCounter
              from={0}
              to={value}
              showValueInDecimal={showValueInDecimal}
            />
            {showPercentageSign && "%"}
          </div>
        ) : (
          <div
            className="col-auto text-white fw-bold ps-0 text-wrap"
            style={{ fontSize: "2.5rem" }}
          >
            <AnimatedCounter
              from={0}
              to={value}
              showValueInDecimal={showValueInDecimal}
            />
            {showPercentageSign && "%"}
          </div>
        )}
      </div>
      <div
        className="col d-flex justify-content-center text-center text-white px-2 position-relative"
        style={{ zIndex: 2 }}
      >
        {textWrap ? (
          <p className={`${isGrouped ? "fs12px" : "f14px"} fw-normal mb-2`}>
            {label}
          </p>
        ) : (
          <>
            {toggleLabel && isGrouped ? (
              <div
                className="col"
                style={{
                  position: "relative",
                  minHeight: "28px",
                  width: "130px",
                }}
              >
                <p
                  className={`${styles.labelHoverDown} fs12px mb-0 text-nowrap fw-5 mt-1`}
                  style={{
                    fontWeight: "500",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    color: labelColor,
                  }}
                >
                  {label}
                </p>
                <div
                  className={`row d-flex justify-content-between m-0 ${styles.labelHoverUp} fs12px mb-2 text-nowrap fw-5`}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                  }}
                >
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    SNE&nbsp;
                    <AnimatedCounter
                      from={0}
                      to={sneCount}
                      showValueInDecimal={showValueInDecimal}
                    />
                  </div>
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    Non-SNE&nbsp;
                    <AnimatedCounter
                      from={0}
                      to={nonSneCount}
                      showValueInDecimal={showValueInDecimal}
                    />
                  </div>
                </div>
              </div>
            ) : toggleLabel ? (
              <div
                className="col"
                style={{
                  position: "relative",
                  minHeight: "28px",
                  minWidth: "100px",
                  maxWidth: "100%",
                }}
              >
                <p
                  className={`${styles.labelHoverDown} fs13px mb-0 text-nowrap fw-5 mt-1`}
                  style={{
                    fontWeight: "500",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    color: labelColor,
                  }}
                >
                  {label}
                </p>
                <div
                  className={`row d-flex justify-content-between m-0 ${styles.labelHoverUp} mb-2 text-nowrap fw-5`}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    fontSize: "12px",
                  }}
                >
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    SNE {sneCount}
                  </div>
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    Non-SNE {nonSneCount}
                  </div>
                </div>
              </div>
            ) : (
              <p
                className={`mb-1 fs15px text-nowrap text-center fw-5`}
                style={{ color: labelColor }}
              >
                {label}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
