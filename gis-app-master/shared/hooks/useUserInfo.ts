"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const useUserInfo = () => {
  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    const id = Cookies.get("userId");
    const role = Cookies.get("role");

    if (id) setUserId(parseInt(id));
    if (role) setRole(role.toLowerCase());
  }, []);

  return { userId, role };
};

export default useUserInfo;
