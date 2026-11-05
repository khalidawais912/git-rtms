import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DocumentsMenu from "./DocumentsMenu";

const doc = { id: 1, name: "Annual Accounts Statement", path: "/up/a.pdf" } as Parameters<
  Parameters<typeof DocumentsMenu>[0]["onSelect"]
>[0];

describe("DocumentsMenu", () => {
  it("lists the documents only when opened, and selecting one closes it", () => {
    const onSelect = vi.fn();
    render(<DocumentsMenu documents={[doc]} onSelect={onSelect} />);
    expect(screen.queryByText(doc.name)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Attached Documents/ }));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(doc.name) }));

    expect(onSelect).toHaveBeenCalledWith(doc);
    expect(screen.queryByText(doc.name)).toBeNull();
  });

  it("says when nothing is attached, and Escape closes the list", () => {
    render(<DocumentsMenu documents={[]} onSelect={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Attached Documents/ }));
    expect(screen.getByText("No documents attached.")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("No documents attached.")).toBeNull();
  });
});
