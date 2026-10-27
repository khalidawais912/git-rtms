"use client";
import { motion } from "framer-motion";

const WaveAnimation = () => {
  return (
    <>
      <motion.div
        initial={{ x: 0, y: 150 }} // Start from off-screen or higher Y position
        animate={{ x: 0, y: -50 }} // End position (smoothly move down)
        transition={{ duration: 2, ease: "easeInOut" }} // Duration of the animation
        style={{ position: "absolute", zIndex: 1, left: -50, right: 0 }} // Set proper z-index
      >
        <img
          src="/images/attendance/wave1Blue.png"
          alt="Wave1Blue"
          style={{ width: "100%", height: "200px", opacity: "0.4" }}
        />
      </motion.div>

      <motion.div
        initial={{ x: -300, y: 100 }} // Start from off-screen or higher Y position
        animate={{ x: 0, y: -50 }} // End position (smoothly move down)
        transition={{ duration: 3, ease: "easeInOut" }} // Same duration for smooth animation
        style={{ position: "absolute", zIndex: 0, left: 0, right: 0 }} // Set proper z-index
      >
        <img
          src="/images/attendance/wave2Blue.png"
          alt="Wave2Blue"
          style={{ width: "100%", height: "200px", opacity: "0.6" }}
        />
      </motion.div>
    </>
  );
};

export default WaveAnimation;
