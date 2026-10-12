"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setContent } from "../features/content/contentSlice";

const useAuthorization = (requiredRight: string) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  useEffect(() => {
    // ✅ Prevent running on the server
    if (typeof window === "undefined") return;

    const token = Cookies.get("token");
    handleButtonClick(requiredRight);

    if (!token) {
      router.push("/login");
      return;
    }

    const rights = JSON.parse(Cookies.get("rights") || "[]");
    if (!rights.includes(requiredRight)) {
      router.push(rights.length > 0 ? `/${rights[0]}` : "/not-authorized");
    }
  }, [router, requiredRight]);
};

export default useAuthorization;
