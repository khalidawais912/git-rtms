"use client";

import { useEffect, useState } from "react";
import { useOfficers, Officer, useReportHistoryUsers as useReportHistoryUser } from "@/features/users";
import List from "./list/components/List";
import Cookies from "js-cookie";

const loggedInUsername = Cookies.get("userName");

const PCIVAttachedReviewPage = () => {
  const [refresh, setRefresh] = useState(false);

  const { data: users } = useReportHistoryUser();
  const { data: officers } = useOfficers();
  console.log("users", users);
  console.log("officers", officers);

  const [deputyDirectors, setDeputyDirectors] = useState<Officer[]>();
  const [directors, setDirectors] = useState<Officer[]>();
  const [departmentHead, setDepartmentHead] = useState<Officer>();

  useEffect(() => {
    if (!officers) return;

    setDeputyDirectors(
      officers.filter((o) => o.roleName === "Deputy Director"),
    );

    setDirectors(officers.filter((o) => o.roleName === "Director"));

    setDepartmentHead(
      officers.find(
        (o) =>
          o.roleName === "Department Head" || o.roleName === "Department Admin",
      ),
    );
  }, [officers]);

  return (
    <div className="p-3 pt-0">
      {users &&
        officers &&
        deputyDirectors &&
        directors &&
        loggedInUsername && (
          <List
            users={users}
            officers={officers}
            deputyDirectors={deputyDirectors}
            directors={directors}
            refresh={refresh}
            setRefresh={setRefresh}
            loggedInUsername={loggedInUsername}
          />
        )}
    </div>
  );
};

export default PCIVAttachedReviewPage;
