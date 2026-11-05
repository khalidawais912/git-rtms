import { DistrictList } from "../types";
import type { MapPin } from "./EvaluationLeafletCanvas";

export type Outcome = "successful" | "partial" | "notSuccessful";

/** Same colours as the Monitoring map's findings. */
export const OUTCOME_COLOR: Record<Outcome, string> = {
  successful: "#1a8150",
  partial: "#c47f0a",
  notSuccessful: "#bf3530",
};

/** A district's worst result, as on the Monitoring map; undefined when nothing was evaluated there. */
export const districtOutcome = (d: DistrictList): Outcome | undefined => {
  if (d.notSuccessful > 0) return "notSuccessful";
  if (d.partiallySuccessful > 0) return "partial";
  if (d.successful > 0) return "successful";
  return undefined;
};

/** One pin per district that has a result and a location. */
export const outcomePins = (districts: DistrictList[]): MapPin[] =>
  districts.flatMap((d) => {
    const outcome = districtOutcome(d);
    const lat = parseFloat(d.latitude);
    const lng = parseFloat(d.longitude);
    if (!outcome || !Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    return [
      {
        key: `d${d.id}`,
        lat,
        lng,
        color: OUTCOME_COLOR[outcome],
        kicker: d.divisionName ? `${d.divisionName} Division` : "District",
        name: d.districtName,
        facts: [
          { label: "Successful", value: d.successful },
          { label: "Partial", value: d.partiallySuccessful },
          { label: "Not successful", value: d.notSuccessful },
        ],
      },
    ];
  });
