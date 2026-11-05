"use client";
import CustomModal from "@/components/CustomModal/CustomModal";
import Loader from "@/components/Loader/Loader";
import ProjectsTable from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import useProjectsTableUtils from "@/app/dashboard/components/ProjectsTable/useProjectsTableUtils";
import { ReactNode } from "react";
import { ProjectsListState } from "../hooks";
import { ProjectsModalConfig } from "../types";

interface Props {
  config: ProjectsModalConfig;
  projects: ProjectsListState;
  role: string;
  /** The card that opens the table */
  trigger: ReactNode;
  /** False keeps the card shut (count is 0) */
  allowOpen?: boolean;
  buttonColumn?: string;
}

/** A dashboard card that loads one status and shows it in the full-screen projects table */
const ProjectsModal = ({
  config,
  projects,
  role,
  trigger,
  allowOpen = true,
  buttonColumn = "",
}: Props) => {
  const { rowCountOptions, districtOptions, sectorOptions, userOptions } = useProjectsTableUtils();
  const { modalId, status, label, columns, rows = "raw", allowLink } = config;

  const keys = projects.columns(columns);
  const data =
    rows === "utilization"
      ? projects.utilizationRows
      : rows === "withUtilization"
        ? projects.withUtilization
        : projects.projectsData;

  return (
    <CustomModal
      HeaderRightPos={0}
      HeaderTopPos={17}
      buttonColumn={buttonColumn}
      isFullscreen
      size="xl"
      modalId={modalId}
      allowOpen={allowOpen}
      onOpen={() => projects.load(status)}
      button={trigger}
      body={
        <div className="container-fluid border-0 p-0">
          {data && keys ? (
            <ProjectsTable
              rowCountOptions={rowCountOptions}
              districtOptions={districtOptions}
              sectorOptions={sectorOptions}
              userOptions={userOptions}
              keys={keys}
              label={label}
              projectsData={data}
              setProjectsData={projects.setProjectsData}
              allowLink={allowLink}
              role={role}
            />
          ) : (
            <Loader />
          )}
        </div>
      }
    />
  );
};

export default ProjectsModal;
