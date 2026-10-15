"use client";
import { useState } from "react";
import List from "./List";

const Visits = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
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
          <List refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
    </>
  );
};

export default Visits;
