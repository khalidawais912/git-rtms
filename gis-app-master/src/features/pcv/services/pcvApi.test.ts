import { beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "@/services/client";
import { GENERATE_REPORT_API, PCV_API, PCV_MAIN_API, PCV_WORKFLOW_API } from "@/services/endpoints";
import {
  createPcv,
  generatePcvPreview,
  getPcv,
  getPcvHistory,
  getPcvInbox,
  getPcvList,
  PcvApiError,
  pressPcvButton,
  saveChapter,
  updatePcvHeader,
} from "./pcvApi";

vi.mock("@/services/client", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const get = vi.mocked(apiClient.get);
const post = vi.mocked(apiClient.post);
const put = vi.mocked(apiClient.put);
const reply = (data: unknown, responseCode = 200, responseMessage = "") => ({
  data: { responseCode, responseMessage, data },
});

beforeEach(() => {
  get.mockReset();
  post.mockReset();
  put.mockReset();
});

describe("PC-V API", () => {
  it("getPcvList sends mine and turns null into []", async () => {
    get.mockResolvedValue(reply(null));
    await expect(getPcvList(true)).resolves.toEqual([]);
    expect(get).toHaveBeenCalledWith(`${PCV_API}/GetALLPCVs`, { params: { mine: true } });
  });

  it("createPcv posts id 0 and the trimmed name", async () => {
    post.mockResolvedValue(reply({ id: 9, name: "A", submissionNo: 1 }));
    await expect(createPcv("  A ")).resolves.toMatchObject({ id: 9 });
    expect(post).toHaveBeenCalledWith(PCV_MAIN_API, { id: 0, name: "A" });
  });

  it("a refused create keeps blockedReason on the error", async () => {
    const data = { id: 0, name: "A", submissionNo: 2, blockedReason: "notOpenYet" };
    post.mockResolvedValue(reply(data, 409, "opens later"));
    const err = await createPcv("A").catch((e) => e);
    expect(err).toBeInstanceOf(PcvApiError);
    expect(err).toMatchObject({ code: 409, message: "opens later", data });
  });

  it("getPcv sorts chapters and fills missing photos", async () => {
    get.mockResolvedValue(
      reply({
        pcvMain: { id: 3 },
        chapters: [
          { chapterNo: 5, photos: null },
          { chapterNo: 2, photos: [{ id: 1 }] },
        ],
      }),
    );
    const form = await getPcv(3);
    expect(form.chapters.map((c) => c.chapterNo)).toEqual([2, 5]);
    expect(form.chapters[1].photos).toEqual([]);
  });

  it("saveChapter sends the chapter as headId", async () => {
    post.mockResolvedValue(reply(null));
    await saveChapter(3, 12, "[]");
    expect(post).toHaveBeenCalledWith(
      `${PCV_API}/SaveOrUpdatePcVAsync`,
      { pcvId: 3, chapterNo: 12, content: "[]" },
      { params: { headId: 12 } },
    );
  });

  it("updatePcvHeader puts only the given fields", async () => {
    put.mockResolvedValue(reply(null));
    await updatePcvHeader(3, { executingAgencyIds: [] });
    expect(put).toHaveBeenCalledWith(`${PCV_MAIN_API}/3`, { executingAgencyIds: [] });
  });

  it("the preview succeeds on responseCode 1 and fails on 0", async () => {
    post.mockResolvedValueOnce(reply("/files/pcv-3.pdf", 1));
    await expect(generatePcvPreview(3)).resolves.toBe("/files/pcv-3.pdf");
    expect(post).toHaveBeenCalledWith(`${GENERATE_REPORT_API}/GenerateReportPCV`, null, {
      params: { pcvId: 3 },
    });
    post.mockResolvedValueOnce(reply(null, 0, "No template"));
    await expect(generatePcvPreview(3)).rejects.toMatchObject({ code: 0, message: "No template" });
  });

  it("submit sends the chosen person; refer back sends remarks only", async () => {
    post.mockResolvedValue(reply({ status: 2, statusName: "Submitted" }));
    await pressPcvButton(3, "submit", { toUserId: 44 });
    expect(post).toHaveBeenLastCalledWith(`${PCV_WORKFLOW_API}/3/submit`, {
      remarks: null,
      toUserId: 44,
    });
    await pressPcvButton(3, "referBack", { remarks: "Fix chapter 5", toUserId: 44 });
    expect(post).toHaveBeenLastCalledWith(`${PCV_WORKFLOW_API}/3/refer-back`, {
      remarks: "Fix chapter 5",
    });
  });

  it("getPcvInbox returns rows in the PC-IV shape", async () => {
    get.mockResolvedValue(reply({ totalIssuedCount: 1, reports: [{ pcvId: 12, projectName: "A" }] }));
    const inbox = await getPcvInbox(5);
    expect(get).toHaveBeenCalledWith(`${PCV_WORKFLOW_API}/submitted-reports`, { params: { userId: 5 } });
    expect(inbox.reports[0]).toMatchObject({ pcivId: 12, projectName: "A" });
    get.mockResolvedValue(reply(null, 404));
    await expect(getPcvInbox(5)).resolves.toEqual({ totalIssuedCount: 0, reports: [] });
  });

  it("getPcvHistory reads the PC-V PDF path", async () => {
    get.mockResolvedValue(reply([{ id: 1, pcv_pdf_path: "/a.pdf" }]));
    const rows = await getPcvHistory(12);
    expect(get).toHaveBeenCalledWith(`${PCV_WORKFLOW_API}/history`, { params: { pcvId: 12 } });
    expect(rows[0].pciv_pdf_path).toBe("/a.pdf");
  });

  it("HTTP 401 becomes a session message", async () => {
    get.mockRejectedValue({ response: { status: 401 } });
    await expect(getPcvList(false)).rejects.toMatchObject({ code: 401 });
  });
});
