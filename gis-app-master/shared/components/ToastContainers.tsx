"use client";

import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  {
    ssr: false,
  }
);
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  {
    ssr: false,
  }
);
const ToastContainers = () => {
  return (
    <div>
      <ToastContainer />
      <Toaster />
    </div>
  );
};

export default ToastContainers;
