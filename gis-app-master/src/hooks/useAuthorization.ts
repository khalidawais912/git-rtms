"use client";

import { getSession, getRights } from "@/utils/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setContent } from "@/store/contentSlice";

const useAuthorization = (requiredRight: string) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  useEffect(() => {
    // ✅ Prevent running on the server
    if (typeof window === "undefined") return;

    const token = getSession("token");
    handleButtonClick(requiredRight);

    if (!token) {
      router.push("/login");
      return;
    }

    const rights = getRights();
    if (!rights.includes(requiredRight)) {
      router.push(rights.length > 0 ? `/${rights[0]}` : "/not-authorized");
    }
  }, [router, requiredRight]);
};

export default useAuthorization;
