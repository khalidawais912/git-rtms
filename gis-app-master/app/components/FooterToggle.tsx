"use client";

import { usePathname } from "next/navigation";
import { allPagesPath } from "../utils";

const FooterToggle = () => {
  const currentPath = usePathname();

  if (
    currentPath !== "" &&
    !currentPath.startsWith("/projects-live-view/project-details-dashboard") &&
    allPagesPath.some((path) => currentPath.startsWith(path))
  ) {
    return (
      <footer className="w-100 text-white bg-color-sea-blue text-center py-1">
        Copyright &copy; All Rights Reserved - DGM&E
      </footer>
    );
  }
};

export default FooterToggle;
