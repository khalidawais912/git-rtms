import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DashboardHeader from "./DashboardHeader";

describe("DashboardHeader", () => {
  it("always shows the title", () => {
    render(<DashboardHeader />);
    expect(screen.getByRole("heading", { name: "Monitoring Dashboard" })).toBeInTheDocument();
  });

  it("hides the programme switch and actions in compact mode", () => {
    render(<DashboardHeader compact program="adp" />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Filters/ })).not.toBeInTheDocument();
  });

  it("marks the active programme and shows only its count", () => {
    render(<DashboardHeader program="cmInitiative" total={1371} />);
    const cm = screen.getByRole("tab", { name: /CM Initiatives/ });
    const adp = screen.getByRole("tab", { name: /ADP/ });
    expect(cm).toHaveAttribute("aria-selected", "true");
    expect(cm).toHaveTextContent("1,371");
    expect(adp).toHaveAttribute("aria-selected", "false");
    expect(adp).not.toHaveTextContent(/\d/);
  });

  it("switches programme only when another one is clicked", async () => {
    const onProgramChange = vi.fn();
    render(<DashboardHeader program="cmInitiative" onProgramChange={onProgramChange} />);
    await userEvent.click(screen.getByRole("tab", { name: /CM Initiatives/ }));
    expect(onProgramChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("tab", { name: /ADP/ }));
    expect(onProgramChange).toHaveBeenCalledWith("adp");
  });

  it("opens the filters and shows how many are in use", async () => {
    const onOpenFilters = vi.fn();
    render(<DashboardHeader program="adp" filterCount={2} onOpenFilters={onOpenFilters} />);
    const button = screen.getByRole("button", { name: /Filters/ });
    expect(button).toHaveTextContent("2");
    await userEvent.click(button);
    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });

  it("toggles Big Screen", async () => {
    const onToggleBigScreen = vi.fn();
    const { rerender } = render(
      <DashboardHeader program="adp" bigScreen={false} onToggleBigScreen={onToggleBigScreen} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Big Screen/ }));
    expect(onToggleBigScreen).toHaveBeenCalledTimes(1);

    rerender(<DashboardHeader program="adp" bigScreen onToggleBigScreen={onToggleBigScreen} />);
    expect(screen.getByRole("button", { name: /Normal Screen/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("prints the page on Export", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<DashboardHeader program="adp" />);
    await userEvent.click(screen.getByRole("button", { name: /Export/ }));
    expect(print).toHaveBeenCalledTimes(1);
  });

  it("shows today's date after it mounts", () => {
    render(<DashboardHeader />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`Main Dashboard · .*${year}`))).toBeInTheDocument();
  });
});
