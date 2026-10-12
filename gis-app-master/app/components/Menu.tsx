import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import { AutoTextSize } from "auto-text-size";

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
        className={`row d-flex justify-content-center align-items-center m-0 position-relative ${
          showArrow && isGrouped
            ? "mt-1"
            : showArrow && !isGrouped
            ? "mt-2"
            : ""
        }`}
        style={{
          zIndex: 2,
          padding: showArrow && !isGrouped ? "7.6px 0px 7px 0px" : "",
        }}
      >
        {icon && (
          <div className="col text-end pe-0">
            <img
              src={icon}
              alt={icon}
              className="img-fluid"
              style={{
                width: `${isGrouped ? "20px" : "40px"}`,
                height: `${isGrouped ? "20px" : "40px"}`,
              }}
            />
          </div>
        )}
        {icon ? (
          <div
            // className={`col-auto text-white fw-5 ps-2 ${
            //   isGrouped ? "fs-6" : "fs18px"
            // }`}
            className={`col text-white fw-5 ps-2`}
          >
            <AutoTextSize
              mode="oneline"
              maxFontSizePx={isGrouped ? 24 : 30}
              minFontSizePx={isGrouped ? 14 : 22}
            >
              <AnimatedCounter
                from={0}
                to={value}
                showValueInDecimal={showValueInDecimal}
              />
              {showPercentageSign && "%"}
            </AutoTextSize>
          </div>
        ) : (
          <div
            className="col-auto text-white fw-bold text-wrap"
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
        className="col-auto text-center text-white px-2 position-relative"
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
                  width: isGrouped ? "100%" : "auto",
                }}
              >
                <div
                  className={`${styles.labelHoverDown} mb-0 text-nowrap fw-5`}
                  style={{
                    fontWeight: "500",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    color: labelColor,
                  }}
                >
                  <AutoTextSize
                    maxFontSizePx={18}
                    minFontSizePx={12}
                    mode="oneline"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </AutoTextSize>
                </div>
                <div
                  className={`row d-flex justify-content-between m-0 ${styles.labelHoverUp} mb-2 text-nowrap fw-5`}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                  }}
                >
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    <AutoTextSize
                      maxFontSizePx={18}
                      minFontSizePx={12}
                      mode="oneline"
                      style={{
                        display: "inline-block",
                        width: "100%",
                      }}
                    >
                      SNE&nbsp;
                      <AnimatedCounter
                        from={0}
                        to={sneCount}
                        showValueInDecimal={showValueInDecimal}
                      />
                    </AutoTextSize>
                  </div>
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    <AutoTextSize
                      maxFontSizePx={18}
                      minFontSizePx={12}
                      mode="oneline"
                      style={{
                        display: "inline-block",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      Non-SNE&nbsp;
                      <AnimatedCounter
                        from={0}
                        to={nonSneCount}
                        showValueInDecimal={showValueInDecimal}
                      />
                    </AutoTextSize>
                  </div>
                </div>
              </div>
            ) : toggleLabel ? (
              <div
                className="col"
                style={{
                  position: "relative",
                  minHeight: "28px",
                  minWidth: isGrouped ? "130px" : "200px",
                  maxWidth: isGrouped ? "200px" : "100%",
                }}
              >
                <div
                  className={`${styles.labelHoverDown} mb-0 text-nowrap fw-5`}
                  style={{
                    fontWeight: "500",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    color: labelColor,
                  }}
                >
                  <AutoTextSize
                    maxFontSizePx={18}
                    minFontSizePx={12}
                    mode="oneline"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </AutoTextSize>
                </div>
                <div
                  className={`row d-flex justify-content-between m-0 ${styles.labelHoverUp} mb-2 text-nowrap fw-5`}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                  }}
                >
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    <AutoTextSize
                      maxFontSizePx={18}
                      minFontSizePx={12}
                      mode="oneline"
                      style={{
                        display: "inline-block",
                        width: "100%",
                      }}
                    >
                      SNE {sneCount}
                    </AutoTextSize>
                  </div>
                  <div className="col-auto p-0" style={{ color: labelColor }}>
                    <AutoTextSize
                      maxFontSizePx={18}
                      minFontSizePx={12}
                      mode="oneline"
                      style={{
                        display: "inline-block",
                        width: "100%",
                      }}
                    >
                      Non-SNE {nonSneCount}
                    </AutoTextSize>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`mb-1 text-nowrap text-center fw-5 w-100`}
                style={{ color: labelColor }}
              >
                <AutoTextSize
                  maxFontSizePx={18}
                  minFontSizePx={12}
                  mode="oneline"
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {label}
                </AutoTextSize>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
