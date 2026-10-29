import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Filter, FilterData } from "../types";
import ActiveFilters from "./ActiveFilters";

const applied: FilterData[] = [
  { filterIdentifier: "District", filterValues: "Lahore" },
  { filterIdentifier: "Year", filterValues: "2025-2026" },
];
const fields: Filter[] = [
  { label: "District name", filterIdentifier: "District", dataType: "string", filterValues: [""] },
];

describe("ActiveFilters", () => {
  it("shows nothing when no filter is in use", () => {
    const { container } = render(<ActiveFilters applied={[]} onChange={vi.fn()} onClear={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a chip per filter, using the field label when there is one", () => {
    render(<ActiveFilters applied={applied} fields={fields} onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText(/District name:/)).toBeInTheDocument();
    expect(screen.getByText("Lahore")).toBeInTheDocument();
    expect(screen.getByText(/Year:/)).toBeInTheDocument();
  });

  it("removes only the chosen filter", async () => {
    const onChange = vi.fn();
    render(<ActiveFilters applied={applied} fields={fields} onChange={onChange} onClear={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove District name filter" }));
    expect(onChange).toHaveBeenCalledWith([applied[1]]);
  });

  it("clears all filters", async () => {
    const onClear = vi.fn();
    render(<ActiveFilters applied={applied} onChange={vi.fn()} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
