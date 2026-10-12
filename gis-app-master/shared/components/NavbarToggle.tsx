"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/Navbar/Navbar";
import { allPagesPath } from "@/shared/utils";

const NavbarToggle = () => {
  const currentPath = usePathname();

  if (
    currentPath !== "/login" &&
    currentPath !== "/privacy-policy" &&
    allPagesPath.some((path) => currentPath.startsWith(path))
  ) {
    return <Navbar />;
  } else {
    return <div></div>;
  }
};

export default NavbarToggle;
