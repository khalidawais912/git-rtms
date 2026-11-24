import { describe, expect, it } from "vitest";
import { codesOf, newlyRequired, requiredForBody, requiredForName, supportsSeveral } from "./requiredFor";
import { DocumentCategoryNode } from "./types";

const node = (extra: Partial<DocumentCategoryNode>): DocumentCategoryNode => ({
  id: 1,
  docCategoryName: "PC-I",
  parentId: 2,
  level: 3,
  childCount: 0,
  canAddChild: false,
  canDelete: true,
  usedOnPcivCount: 0,
  children: [],
  ...extra,
});

describe("required for (Document Rules guide)", () => {
  it("reads requiredForCodes on the 036 build, and the one value before it", () => {
    expect(codesOf(node({ requiredFor: 3, requiredForCodes: ["PCIV", "PCV"] }))).toEqual(["PCIV", "PCV"]);
    expect(codesOf(node({ requiredFor: 7, requiredForCodes: ["All"] }))).toEqual(["PCIV", "PCV", "Monitoring"]);
    expect(codesOf(node({ requiredFor: null, requiredForCodes: [] }))).toEqual([]);
    // before 036: 3 was Monitoring, 4 All
    expect(codesOf(node({ requiredFor: 3 }))).toEqual(["Monitoring"]);
    expect(codesOf(node({ requiredFor: 4 }))).toEqual(["PCIV", "PCV", "Monitoring"]);
    expect(codesOf(node({ requiredFor: null }))).toEqual([]);
  });

  it("knows the 036 build by requiredForCodes anywhere in the tree", () => {
    const child = node({ requiredForCodes: null });
    expect(supportsSeveral([node({ level: 1, children: [node({ level: 2, children: [child] })] })])).toBe(true);
    expect(supportsSeveral([node({ level: 1 })])).toBe(false);
  });

  it("sends the list of codes on the 036 build", () => {
    expect(requiredForBody(["PCV", "PCIV"], true)).toEqual({ value: ["PCIV", "PCV"] });
    expect(requiredForBody(["PCIV", "PCV", "Monitoring"], true)).toEqual({ value: ["PCIV", "PCV", "Monitoring"] });
    expect(requiredForBody([], true)).toEqual({ value: null });
  });

  it("sends one code before it, and stops two", () => {
    expect(requiredForBody(["PCV"], false)).toEqual({ value: "PCV" });
    expect(requiredForBody(["PCIV", "PCV", "Monitoring"], false)).toEqual({ value: "All" });
    expect(requiredForBody(["PCIV", "PCV"], false)).toHaveProperty("error");
  });

  it("names and compares a choice", () => {
    expect(requiredForName(["PCV", "PCIV"])).toBe("PC-IV + PC-V");
    expect(requiredForName(["PCIV", "PCV", "Monitoring"])).toBe("All");
    expect(requiredForName([])).toBe("Optional");
    expect(newlyRequired(["PCIV"], ["PCIV", "Monitoring"])).toEqual(["Monitoring"]);
    expect(newlyRequired(["PCIV", "PCV"], ["PCIV"])).toEqual([]);
  });
});
