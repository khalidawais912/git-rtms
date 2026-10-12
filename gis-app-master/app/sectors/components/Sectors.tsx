"use client";
import { useState } from "react";
import SectorsTable from "./SectorsTable";
import ListWrapper from "@/app/components/ListWrapper";

const Sectors = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <ListWrapper>
      <SectorsTable refresh={refresh} setRefresh={setRefresh} />
    </ListWrapper>
  );
};

export default Sectors;
