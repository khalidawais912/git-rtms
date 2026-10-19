"use client";

import { useEffect, useMemo, useState } from "react";
import { useOfficers, Officer, useReportHistoryUsers as useReportHistoryUser } from "@/features/users";
import List from "./list/components/List";
import { getSession } from "@/shared/utils/session";

const loggedInUsername = getSession("userName");

const PCIVAttachedReviewPage = () => {
  const [refresh, setRefresh] = useState(false);

  const { data: users } = useReportHistoryUser();
  const { data: officers } = useOfficers();
  console.log("users", users);
  console.log("officers", officers);

  // DGM&E = "Administrative Department" (pehle "Department Head" role tha)
  const departmentHead = useMemo<Officer | undefined>(() => {
    const normalize = (v?: string) => (v ?? "").toLowerCase().replace(/\s+/g, " ").trim();
    return (
      officers?.find((o) => normalize(o.roleName) === "Administrative Secretary") ??
      officers?.find((o) => normalize(o.roleName) === "department head") ??
      officers?.find((o) => /\bdg\s*m\s*&\s*e\b|director general/i.test(o.designation ?? ""))
    );
  }, [officers]);

  useEffect(() => {
    if (officers && !departmentHead) {
      console.warn(
        "DGM&E (Administrative Department) officer not found. roleNames:",
        officers.map((o) => `${o.id}: ${o.roleName} / ${o.designation}`),
      );
    }
  }, [officers, departmentHead]);

  console.log("departmentHead", departmentHead);

  return (
    <div className="p-3 pt-0">
      {users &&
        officers &&
        loggedInUsername && (
          <List
            users={users}
            departmentHead={departmentHead}
            refresh={refresh}
            setRefresh={setRefresh}
            loggedInUsername={loggedInUsername}
          />
        )}
    </div>
  );
};

export default PCIVAttachedReviewPage;
