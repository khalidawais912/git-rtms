import { describe, expect, it } from "vitest";
import { backendFileUrl } from "./index";

describe("backendFileUrl", () => {
  it("fixes backslashes and the leading slash", () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_API ?? "";
    expect(backendFileUrl(String.raw`UserImages\TD\132\a.png`)).toBe(`${base}/upload/UserImages/TD/132/a.png`);
    expect(backendFileUrl("/upload/UserImages/TD/1/b.png")).toBe(`${base}/upload/UserImages/TD/1/b.png`);
    expect(backendFileUrl("upload/files/c.pdf")).toBe(`${base}/upload/files/c.pdf`);
    expect(backendFileUrl("/upload/x.png")).toBe(`${base}/upload/x.png`);
    expect(backendFileUrl("https://x.pk/a.png")).toBe("https://x.pk/a.png");
    expect(backendFileUrl(null)).toBe("");
  });
});
