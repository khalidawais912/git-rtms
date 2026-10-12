"use client";
import ListWrapper from "@/app/components/ListWrapper";
import { useState } from "react";
import List from "./List";

const ProjectDocumentNames = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <ListWrapper>
      <List refresh={refresh} setRefresh={setRefresh} />
    </ListWrapper>
  );
};

export default ProjectDocumentNames;
