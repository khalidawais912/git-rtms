"use client";

import { useEffect, useState } from "react";
import ProjectDetailsDashboard, {
  SingleProjectDashboard,
} from "../../components/ProjectDetailsDashboard";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { SINGLE_PROJECT_DASHBOARD_API } from "@/app/APIs";
import Loader from "@/app/components/Loader/Loader";

interface Props {
  params: { id: string; visitId: number }; // Change to string to match the routing expectations
}

const SingleProjectDashboardPage = ({ params }: Props) => {
  const { id, visitId } = params; // Use the id as a string here, if necessary convert it later
  const [data, setData] = useState<SingleProjectDashboard>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("check id", id);
    console.log("check visit", visitId);
  }, [id, visitId]);

  useEffect(() => {
    const handleSubmit = async (projectId: number, visitId: number) => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}&visitId=${visitId}`,
        );
        setData(response.data.data);
        console.log(
          `check now: projectid=${projectId}&visit=${visitId}`,
          response,
        );
        setLoading(false);
      } catch (err) {
        console.error("Submission error:", err);
        setError((err as AxiosError).message);
        setLoading(false);
      }
    };

    if (id && visitId) handleSubmit(parseInt(id), visitId);
  }, [id, visitId]);

  if (isLoading) return <Loader />;
  if (data) return <ProjectDetailsDashboard data={data} />;
  if (error) return error;
};

export default SingleProjectDashboardPage;
