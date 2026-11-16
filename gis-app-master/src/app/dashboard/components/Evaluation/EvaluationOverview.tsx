"use client";
import CustomModal from "@/components/CustomModal/CustomModal";
import Loader from "@/components/Loader/Loader";
import ActiveFilters from "@/features/monitoring-dashboard/components/ActiveFilters";
import DashboardHeader from "@/features/monitoring-dashboard/components/DashboardHeader";
import FiltersPanel from "@/features/monitoring-dashboard/components/FiltersPanel";
import { IconName } from "@/features/monitoring-dashboard/components/Icon";
import MiniCard from "@/features/monitoring-dashboard/components/MiniCard";
import mon from "@/features/monitoring-dashboard/components/MonitoringDashboard.module.css";
import { useBigScreen, useUserFilters } from "@/features/monitoring-dashboard/hooks";
import { FilterData } from "@/features/monitoring-dashboard/types";
import { fmt } from "@/features/monitoring-dashboard/utils";
import { getPcvCounts, PcvEvaluationCounts, toPcvEvaluationCounts } from "@/features/pcv";
import SplitTiles, { SplitTile } from "@/features/proformas/components/SplitTiles";
import { ProjectView } from "@/features/proformas/projectRows";
import apiClient, { AxiosError } from "@/services/client";
import { EVALUATION_MAIN_DASHBOARD_API } from "@/services/endpoints";
import { inter } from "@/styles/fonts";
import { devMap } from "@/utils";
import { Clock, Inbox, Undo2, UserRound } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./EvaluationOverview.module.css";
import EvaluationOutcomeMap from "./map/EvaluationOutcomeMap";
import PCIVReportReview from "./PCIVReportReview";
import PCVReportReview from "./PCVReportReview";
import ProjectsTable from "./ProjectsTable/ProjectsTable";
import { EvaluationMainDashboard, ProjectsList } from "./types";

const SUBMITTED_COLUMNS = [
  "id",
  "gsNo",
  "name",
  "sectorName",
  "cost",
  "sponsoringAgencyName",
  "executingAgencyName",
  "city",
  "divisionName",
  "districtName",
  "isSNE",
];
const VISIT_COLUMNS = [...SUBMITTED_COLUMNS, "userName"];

interface Config {
  modalId: string;
  /** The `filter` of GetProjectsListByStatus. */
  filter: string;
  label: string;
  columns: string[];
  /** A count of 0 has nothing to show. */
  allowOpen?: boolean;
}

interface Props {
  data?: EvaluationMainDashboard;
  role: string;
  filters: FilterData[];
  onFiltersChange: (filters: FilterData[]) => void;
}

/** Evaluation Dashboard, in the same design as the Monitoring one. Every number opens its projects. */
const EvaluationOverview = ({ data, role, filters, onFiltersChange }: Props) => {
  const fields = useUserFilters();
  const { bigScreen, toggleBigScreen } = useBigScreen();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const [projects, setProjects] = useState<ProjectsList[]>();
  const [pcv, setPcv] = useState<PcvEvaluationCounts>({});

  useEffect(() => {
    let live = true;
    getPcvCounts().then((counts) => live && setPcv(toPcvEvaluationCounts(counts)));
    return () => {
      live = false;
    };
  }, []);

  const load = async (filter: string) => {
    setProjects([]);
    try {
      const response = await apiClient.get(`${EVALUATION_MAIN_DASHBOARD_API}/GetProjectsListByStatus?filter=${filter}`);
      setProjects(response.data.data);
    } catch (err) {
      toast.error((err as AxiosError).message);
    }
  };

  const keysOf = (columns: string[]) =>
    projects?.length ? Object.keys(projects[0]).filter((k) => columns.includes(k)).map((k) => k as keyof ProjectsList) : undefined;

  const opens = (config: Config, trigger: ReactNode) => {
    const keys = keysOf(config.columns);
    return (
      <CustomModal
        key={config.modalId}
        HeaderRightPos={0}
        HeaderTopPos={17}
        buttonColumn=""
        isFullscreen
        modalId={config.modalId}
        allowOpen={config.allowOpen ?? true}
        onOpen={() => load(config.filter)}
        button={trigger}
        body={
          <div className="container-fluid border-0 p-0">
            {projects && keys ? (
              <ProjectsTable role={role} keys={keys} label={config.label} projectsData={projects} setProjectsData={setProjects} />
            ) : (
              <Loader />
            )}
          </div>
        }
      />
    );
  };

  const mini = (config: Config, value: number | undefined, icon: IconName, label: string, color: string) => {
    const none = config.allowOpen === false;
    return opens(config, <MiniCard icon={icon} value={fmt(value ?? 0)} label={label} color={color} disabled={none} />);
  };

  // PC-IV numbers come from the dashboard (with its filters); PC-V numbers from
  // /api/pcv/overview/counts (no filters). Each half opens the list of that type.
  const listHref = (view: ProjectView) => (type: string) => `/proformas/all?type=${type}&view=${view}&dashboardType=EVALUATION`;
  const statusTiles: SplitTile[] = [
    {
      key: "submittedByDept",
      label: "Submitted by Department",
      icon: <Inbox size={22} />,
      color: "var(--blue)",
      counts: { pc4: data?.totalSubmittedPCIvs, pc5: pcv.submittedByDept },
      href: listHref("submittedByDept"),
    },
    {
      key: "inProgress",
      label: "In Progress",
      icon: <Clock size={22} />,
      color: "var(--navy)",
      counts: { pc4: data?.pCivInProgress, pc5: pcv.inProgress },
      href: listHref("inProgress"),
    },
    {
      key: "assigned",
      label: "Assigned",
      icon: <UserRound size={22} />,
      color: "var(--pc5)",
      counts: { pc4: data?.assignedToEvaluator, pc5: pcv.assigned },
      notes: { pc4: "To Evaluator", pc5: "To Impact Assessment" },
      href: listHref("assigned"),
    },
    {
      key: "referBack",
      label: "Refer Back",
      icon: <Undo2 size={22} />,
      color: "var(--rose)",
      counts: { pc4: data?.refferBackPcIV, pc5: pcv.referBack },
      href: listHref("referBack"),
    },
  ];

  const visits = (data?.noOfVisitsMultipleSitesOrUmbrella ?? 0) + (data?.noOfVisitsSingle ?? 0);
  const lowerRole = role.toLowerCase();
  const reviews = lowerRole.includes("director") || lowerRole === "department head";

  return (
    <div className={`${mon.root} ${inter.className} ${bigScreen ? mon.big : ""}`} aria-busy={!data}>
      <DashboardHeader
        section="Evaluation"
        filterCount={filters.length}
        onOpenFilters={() => setFiltersOpen(true)}
        bigScreen={bigScreen}
        onToggleBigScreen={toggleBigScreen}
        chartsHref="/charts"
      />
      <ActiveFilters applied={filters} fields={fields} onChange={onFiltersChange} onClear={() => onFiltersChange([])} />

      <SplitTiles tiles={statusTiles} label="PC-IV and PC-V status" />

      {reviews && (
        <section className={styles.reviews} aria-label="Reviews">
          <PCIVReportReview />
          <PCVReportReview />
        </section>
      )}

      <section className={styles.panels}>
        <div className={mon.panel}>
          <div className={mon.panelH}>
            <h2>Projects Evaluated</h2>
            <span className={mon.phNote}>
              <span className={mon.num}>{fmt(visits)}</span> visits
            </span>
          </div>
          <div className={mon.pair}>
            {mini(
              { modalId: "umbrella", filter: "umbrella", label: "No. of Visits (Umbrella)", columns: VISIT_COLUMNS },
              data?.noOfVisitsMultipleSitesOrUmbrella,
              "umbrella",
              "No. of Visits (Umbrella)",
              "var(--teal)",
            )}
            {mini(
              { modalId: "single", filter: "single", label: "No. of Visits (Single)", columns: VISIT_COLUMNS },
              data?.noOfVisitsSingle,
              "box",
              "No. of Visits (Single)",
              "var(--info)",
            )}
          </div>
        </div>

        <div className={mon.panel}>
          <div className={mon.panelH}>
            <h2>Evaluation results</h2>
            <span className={mon.phNote}>Outcome of evaluated projects, and reports still being written</span>
          </div>
          <div className={styles.four}>
            {mini(
              { modalId: "successful", filter: "successful", label: "Successful Projects", columns: VISIT_COLUMNS, allowOpen: data?.successful !== 0 },
              data?.successful,
              "check",
              "Successful",
              "var(--good)",
            )}
            {mini(
              { modalId: "partial", filter: "partial", label: "Partial Success Projects", columns: VISIT_COLUMNS, allowOpen: data?.partiallySuccessful !== 0 },
              data?.partiallySuccessful,
              "gauge",
              "Partial Success",
              "var(--average)",
            )}
            {mini(
              { modalId: "notsuccessful", filter: "notsuccessful", label: "Not Successful Projects", columns: VISIT_COLUMNS, allowOpen: data?.notSuccessful !== 0 },
              data?.notSuccessful,
              "ban",
              "Not Successful",
              "var(--critical)",
            )}
            {mini(
              { modalId: "reportsInProgress", filter: "inprogress", label: "Reports In Progress", columns: SUBMITTED_COLUMNS },
              data?.reportsInProgress,
              "edit",
              "Reports In Progress",
              "var(--info)",
            )}
          </div>
        </div>
      </section>

      <section className={`${mon.main2} ${mon.main2Full}`}>
        {devMap && data ? <EvaluationOutcomeMap districts={data.districtList ?? []} /> : <div className={mon.map2} />}
      </section>

      <FiltersPanel
        open={filtersOpen}
        onClose={closeFilters}
        fields={fields}
        applied={filters}
        onApply={onFiltersChange}
        onReset={() => onFiltersChange([])}
      />
    </div>
  );
};

export default EvaluationOverview;
