"use client";

import { asap } from "@/styles/fonts";
import { Groups } from "../../types";
import WBSAttributesFlow from "./WBSFlow/WBSAttributesFlow";
import WBSGroupFlow from "./WBSFlow/WBSGroupFlow";

interface Props {
  majorDeliverables: Groups;
}

const WBSReportUpdated = ({ majorDeliverables }: Props) => {
  return (
    <>
      <div
        className={`col p-2 mb-3 mx-2 ${asap.className}`}
        style={{ background: "#C6D9F1", borderRadius: "17px" }}
      >
        <p className="m-0 fw-bold fs26px ms-3 mt-2 text-center">
          {majorDeliverables.attributes[0].values[0].value} (
          {majorDeliverables.attributes[1].values[0].value}%)
        </p>
        {majorDeliverables?.group?.length > 0 ? (
          <WBSGroupFlow majorDeliverables={majorDeliverables} />
        ) : majorDeliverables ? (
          <WBSAttributesFlow majorDeliverables={majorDeliverables} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default WBSReportUpdated;
