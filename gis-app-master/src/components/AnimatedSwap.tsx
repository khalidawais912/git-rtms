"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSwapProps {
  isLoading: boolean;
  loadingContent: ReactNode;
  content: ReactNode;
}

const AnimatedSwap = ({
  isLoading,
  loadingContent,
  content,
}: AnimatedSwapProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLoading ? "loading" : "content"}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2 }}
      >
        {isLoading ? loadingContent : content}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedSwap;
