"use client";
import { useState } from "react";
import UserProjectsList from "./UserProjectsList";
import ListWrapper from "@/app/components/ListWrapper";

const UserProjects = () => {
  const [refresh, setRefresh] = useState(false);
  const [showData, setShowData] = useState(false);

  return (
    <ListWrapper>
      <UserProjectsList
        refresh={refresh}
        setRefresh={setRefresh}
        showData={showData}
        setShowData={setShowData}
      />
    </ListWrapper>
  );
};

export default UserProjects;
