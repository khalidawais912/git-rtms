"use client";
import { useEffect, useState } from "react";

const FooterToggle = () => {
  const [showFooter, setShowFooter] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = window.scrollY || window.pageYOffset;

      const isShortPage = scrollHeight <= clientHeight + 1;
      const isBottomReached = scrollTop + clientHeight >= scrollHeight - 1;

      setShowFooter(isShortPage || isBottomReached);
    };

    handleScroll(); // run initially

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // handle resizes

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <footer
      className={`position-fixed left-0 bottom-0 w-100 text-white bg-color-sea-blue text-center py-1 ${
        showFooter ? "footer-visible" : "footer-hidden"
      }`}
    >
      Copyright &copy; All Rights Reserved - DGM&E
    </footer>
  );
};

export default FooterToggle;
