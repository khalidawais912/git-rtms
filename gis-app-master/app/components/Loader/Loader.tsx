"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import EarthLoading from "./earthLoading.json";

// Dynamically import Lottie only on client
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Loader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures code only runs on client
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevent SSR crash

  return (
    <Suspense fallback={"Loading..."}>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          style={{ width: "100px", height: "100px" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Lottie animationData={EarthLoading} loop={true} />
        </motion.div>
      </div>
    </Suspense>
  );
};

export default Loader;
