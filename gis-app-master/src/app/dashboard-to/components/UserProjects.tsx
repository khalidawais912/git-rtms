"use client";
import { useState } from "react";
import UserProjectsList from "./UserProjectsList";

const UserProjects = () => {
  const [refresh, setRefresh] = useState(false);
  const [showData, setShowData] = useState(false);

  return (
    <div
      className={"container p-3 mt-3 mb-4"}
      style={{
        background: "rgba(209, 209, 209, 0.4)",
        border: "1px solid #ededed",
        padding: "10px",
        borderRadius: "15px",
      }}
    >
      <div className="row p-3">
        <UserProjectsList
          refresh={refresh}
          setRefresh={setRefresh}
          showData={showData}
          setShowData={setShowData}
        />
      </div>
    </div>
  );
};

export default UserProjects;
