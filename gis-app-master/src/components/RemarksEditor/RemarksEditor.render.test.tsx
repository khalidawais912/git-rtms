import { render, screen, waitFor } from "@testing-library/react";
import type { Editor } from "@tiptap/react";
import { describe, expect, it, vi } from "vitest";
import RemarksEditor from "./RemarksEditor";

describe("RemarksEditor", () => {
  it("shows the toolbar, the counts and an empty editor", async () => {
    render(<RemarksEditor onChange={() => {}} ariaLabel="Description Level" />);
    await waitFor(() => expect(screen.getByRole("toolbar", { name: "Text formatting" })).toBeTruthy());
    for (const label of ["Undo", "Bold", "Italic", "Heading", "Bullet list", "Numbered list", "Quote", "Link"]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
    expect(screen.getByText("words: 0")).toBeTruthy();
    expect(screen.getByLabelText("Description Level").getAttribute("spellcheck")).toBe("true");
  });

  it("sends Markdown when bold is used", async () => {
    const onChange = vi.fn();
    render(<RemarksEditor onChange={onChange} />);
    await waitFor(() => screen.getByRole("button", { name: "Bold" }));
    screen.getByRole("button", { name: "Bold" }).click();
    // jsdom cannot type, so insert through the editor TipTap puts on its element
    const editor = (screen.getByRole("textbox") as unknown as { editor?: Editor }).editor;
    expect(editor).toBeTruthy();
    editor!.commands.insertContent("Late");
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith("**Late**"));
  });
});
