"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardTypeEnum } from "@/shared/types/dashboard";
import { useOfficers, Officer, useReportHistoryUsers as useReportHistoryUser } from "@/features/users";
import List from "./list/components/List";
import { getSession } from "@/shared/utils/session";

const loggedInUsername = getSession("userName");

const PCIVReviewPage = () => {
  const searchParams = useSearchParams();
  const dashboardType = searchParams.get("dashboardType");
  const [refresh, setRefresh] = useState(false);

  const { data: users } = useReportHistoryUser();
  const { data: officers } = useOfficers();
  console.log("users", users);
  console.log("officers", officers);

  const [deputyDirectors, setDeputyDirectors] = useState<Officer[]>();
  const [directors, setDirectors] = useState<Officer[]>();
  const [departmentHead, setDepartmentHead] = useState<Officer>();

  const types = Object.values(DashboardTypeEnum);
  const currentType = types.includes(dashboardType as any)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

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
        departmentHead &&
        loggedInUsername && (
          <List
            dashbaordType={currentType}
            users={users}
            officers={officers}
            deputyDirectors={deputyDirectors}
            directors={directors}
            departmentHead={departmentHead}
            refresh={refresh}
            setRefresh={setRefresh}
            loggedInUsername={loggedInUsername}
          />
        )}
    </div>
  );
};

export default PCIVReviewPage;
