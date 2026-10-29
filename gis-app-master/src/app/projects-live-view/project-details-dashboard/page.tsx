"use client";
import { MAIN_DASHBOARD_API } from "@/services/endpoints";
import useLazyFetch from "@/hooks/useLazyFetch";

const ProjectDetailsDashboard = () => {
  const { data, error, isLoading, fetchData } = useLazyFetch<Record<string, unknown>>();
  const handleFetch = () => {
    fetchData({
      endpoint: `${MAIN_DASHBOARD_API}`,
      method: "POST",
      body: [
        {
          filterIdentifier: "",
          filterValues: "",
        },
      ],
    });
  };

  return (
    <div>
      <button onClick={handleFetch} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Data"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default ProjectDetailsDashboard;
