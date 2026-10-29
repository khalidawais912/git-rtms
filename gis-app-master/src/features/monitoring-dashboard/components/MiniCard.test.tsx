import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MiniCard from "./MiniCard";

describe("MiniCard", () => {
  it("shows the value and label as a button", () => {
    render(<MiniCard icon="folder" value={42} label="Projects" color="var(--info)" />);
    const card = screen.getByRole("button", { name: /42\s*Projects/ });
    expect(card).toHaveAttribute("type", "button");
    expect(card).toHaveStyle({ "--tc": "var(--info)" });
  });

  it("renders as a span inside a link", () => {
    const { container } = render(<MiniCard as="span" icon="folder" value={1} label="Plans" color="red" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  it("shows the All clear chip only when asked", () => {
    const { rerender } = render(<MiniCard icon="check" value={0} label="Pending" color="green" />);
    expect(screen.queryByText("All clear")).not.toBeInTheDocument();
    rerender(<MiniCard icon="check" value={0} label="Pending" color="green" allClear />);
    expect(screen.getByText("All clear")).toBeInTheDocument();
  });

  it("shows the badge only for a count above 0", () => {
    const { rerender } = render(<MiniCard icon="gauge" value={5} label="Utilization" color="red" badge={0} />);
    expect(screen.getByRole("button")).toHaveTextContent(/^5Utilization$/);
    rerender(<MiniCard icon="gauge" value={5} label="Utilization" color="red" badge={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("marks a disabled card", () => {
    render(<MiniCard icon="folder" value={0} label="Projects" color="red" disabled />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
  });
});
