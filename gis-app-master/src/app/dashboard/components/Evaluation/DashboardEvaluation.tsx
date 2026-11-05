"use client";
import { EVALUATION_MAIN_DASHBOARD_API, EVALUATION_MAIN_DASHBOARD } from "@/services/endpoints";
import DashboardWrapper from "@/app/dashboard/components/DashboardWrapper";
import { setContent } from "@/store/contentSlice";
import { setTutorial } from "@/store/tutorialSlice";
import apiClient, { AxiosError } from "@/services/client";
import { getSession } from "@/utils/session";
import { lexend } from "@/styles/fonts";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import EvaluationOverview from "./EvaluationOverview";
import EvaluationLeafletMap from "./map/EvaluationLeafletMap";
import { EvaluationMainDashboard } from "./types";
import styles from "./DashboardEvaluation.module.css";
import { FilterData } from "../../types";
import { useEffectEvent } from "@/hooks/useEffectEvent";
import SecretaryTiles from "@/features/proformas/components/SecretaryTiles";
import { getPcvOverviewCounts, PcvTileCounts } from "@/features/pcv";
import { loadTileRowCounts } from "@/features/proformas/inbox";
import useUserInfo from "@/hooks/useUserInfo";

const DashboardEvaluation = () => {
  const [data, setData] = useState<EvaluationMainDashboard>();
  const [role, setRole] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<number>();
  const [filters, setFilters] = useState<FilterData[]>([]);
  const [pcv, setPcv] = useState<PcvTileCounts>({});
  const [rowCounts, setRowCounts] = useState<Awaited<ReturnType<typeof loadTileRowCounts>>>({});
  const { userId } = useUserInfo();
  const isSecretary = role.toLowerCase() === "administrative secretary";

  useEffect(() => {
    if (!isSecretary) return;
    let live = true;
    getPcvOverviewCounts().then((counts) => live && setPcv(counts ?? {}));
    return () => {
      live = false;
    };
  }, [isSecretary]);

  useEffect(() => {
    if (!isSecretary || !userId) return;
    let live = true;
    loadTileRowCounts(userId).then((counts) => live && setRowCounts(counts));
    return () => {
      live = false;
    };
  }, [isSecretary, userId]);
  const dispatch = useDispatch();

  useEffect(() => {
    const userRole = getSession("role");
    const departmentId = getSession("departmentId");
    if (userRole) setRole(userRole);
    if (departmentId) setDepartmentId(parseInt(departmentId));
  }, []);

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  const onMount = useEffectEvent(() => {
    handleButtonClick(
      "https://www.youtube.com/watch?v=1wgAwCufsko&ab_channel=DirectorateGeneralMonitoringandEvaluation",
      "dashboard",
    );
  });
  useEffect(() => onMount(), [onMount]);

  const load = useCallback(async (filterData: FilterData[]) => {
    const secretary = getSession("role")?.toLowerCase() === "administrative secretary";
    try {
      const response = await apiClient.post(
        `${secretary ? EVALUATION_MAIN_DASHBOARD : EVALUATION_MAIN_DASHBOARD_API}/dashboard`,
        filterData.length ? filterData : undefined,
      );
      setData(response.data.data);
    } catch (err) {
      toast.error((err as AxiosError).message);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [load, filters]);

  return (
    <>
      {(departmentId === 0 || departmentId === 1) && (
        <EvaluationOverview data={data} role={role} filters={filters} onFiltersChange={setFilters} />
      )}
      {isSecretary && (
        <DashboardWrapper>
          <div className={styles.wrapper}>
            <div className={`${lexend.className} px-1`}>
              {/* PC-IV numbers: the same fields the old tiles showed. PC-V numbers: from
                  /api/pcv/overview/counts; "–" until they load. Referback and Attached Dept. (both types)
                  count the rows of the tabs they open. */}
              <SecretaryTiles
                counts={{
                  totalPc4: data?.totalSubmittedPCIvs,
                  totalPc5: pcv.total,
                  submittedToDgme: { pc4: data?.pCivInProgress, pc5: pcv.submittedToDgme },
                  takeUp: { pc4: data?.pCivInProgress, pc5: pcv.takeUp },
                  referback: { pc4: rowCounts.pc4?.referback, pc5: rowCounts.pc5?.referback },
                  attached: { pc4: rowCounts.pc4?.attached, pc5: rowCounts.pc5?.attached },
                }}
              />
            </div>
            <div className={`${lexend.className} px-1 pb-2`}>
              {data && <EvaluationLeafletMap data={data} />}
            </div>
          </div>
        </DashboardWrapper>
      )}
    </>
  );
};

export default DashboardEvaluation;
