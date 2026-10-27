"use client";

import { getSession } from "@/utils/session";
import { useEffect, useState } from "react";

const useUserInfo = () => {
  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    const id = getSession("userId");
    const role = getSession("role");

    if (id) setUserId(parseInt(id));
    if (role) setRole(role.toLowerCase());
  }, []);

  return { userId, role };
};

export default useUserInfo;
