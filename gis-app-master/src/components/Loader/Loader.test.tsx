import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { stepMessage } from "@/components/AppLoader/AppLoader";
import { getPendingLoads } from "@/components/AppLoader/loaderStore";
import Loader from "./Loader";

describe("stepMessage", () => {
  it.each([
    [0, "Connecting to RTMES…"],
    [29, "Connecting to RTMES…"],
    [30, "Loading projects & visits…"],
    [65, "Preparing map & reports…"],
    [99, "Preparing map & reports…"],
    [100, "Ready"],
  ])("at %s%% says %s", (progress, message) => {
    expect(stepMessage(progress)).toBe(message);
  });
});

describe("Loader", () => {
  it("shows the compact loader by default", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toHaveTextContent("Connecting to RTMES…");
    expect(screen.getByRole("status")).toHaveTextContent("%");
  });

  it("page variant renders nothing and keeps the full-screen loader up while mounted", () => {
    const before = getPendingLoads();
    const { container, unmount } = render(<Loader variant="page" />);
    expect(container).toBeEmptyDOMElement();
    expect(getPendingLoads()).toBe(before + 1);
    unmount();
    expect(getPendingLoads()).toBe(before);
  });
});
