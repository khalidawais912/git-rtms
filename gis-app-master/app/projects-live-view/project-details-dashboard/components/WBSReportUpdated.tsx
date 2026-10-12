"use client";

import { Asap } from "next/font/google";
import { Groups } from "./ProjectDetailsDashboard";
import WBSAttributesFlow from "./WBSFlow/WBSAttributesFlow";
import WBSGroupFlow from "./WBSFlow/WBSGroupFlow";

const asap = Asap({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
// {Math.round(
//   majorDeliverables.group.reduce((sum, g) => {
//     const groupTotal = g.attributes
//       .filter(
//         (attribute) =>
//           attribute.attributeId !== 68 &&
//           attribute.attributeId !== 69
//       )
//       .reduce((attrSum, attribute) => {
//         const value = attribute.values[0]?.value; // Raw value
//         const numericValue = parseFloat(value); // Convert to number
//         return (
//           attrSum + (isNaN(numericValue) ? 0 : numericValue)
//         ); // Add valid numbers
//       }, 0);
//     return sum + groupTotal; // Add group total to the sum
//   }, 0)
// )}
