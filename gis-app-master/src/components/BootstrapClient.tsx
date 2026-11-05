"use client";

import { useEffect } from "react";

const BootstrapClient = () => {
  useEffect(() => {
    // @ts-expect-error - Ignore TypeScript error for missing type definitions
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .catch((err) => console.error("Bootstrap failed to load", err));
  }, []);

  return null;
};

export default BootstrapClient;
