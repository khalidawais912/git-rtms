import Cookies from "js-cookie";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { endRequestSession, getRequestState } from "@/components/AppLoader/loaderStore";
import apiClient from "./client";

// Answers inside the test instead of going to the server
const respond =
  (status = 200): AxiosAdapter =>
  async (config: InternalAxiosRequestConfig) => {
    const response = { data: { ok: true }, status, statusText: "", headers: {}, config };
    if (status >= 400) {
      throw Object.assign(new Error(`Request failed with status code ${status}`), {
        isAxiosError: true,
        config,
        response,
      });
    }
    return response;
  };

beforeEach(() => {
  Cookies.remove("token");
});

afterEach(() => {
  Cookies.remove("token");
});

describe("apiClient", () => {
  it("sends the saved login token", async () => {
    Cookies.set("token", "abc123");
    const res = await apiClient.get("/x", { adapter: respond() });
    expect(res.config.headers.Authorization).toBe("Bearer abc123");
  });

  it("keeps an Authorization header the caller set", async () => {
    Cookies.set("token", "abc123");
    const res = await apiClient.get("/x", {
      adapter: respond(),
      headers: { Authorization: "Bearer other" },
    });
    expect(res.config.headers.Authorization).toBe("Bearer other");
  });

  it("sends no Authorization header when logged out", async () => {
    const res = await apiClient.get("/x", { adapter: respond() });
    expect(res.config.headers.Authorization).toBeUndefined();
  });

  it("tells the page loader when a request starts and its response arrives", async () => {
    const before = getRequestState();
    let during = before;
    const adapter: AxiosAdapter = async (config) => {
      during = getRequestState();
      return respond()(config);
    };
    await apiClient.get("/x", { adapter });
    expect(during.inFlight).toBe(before.inFlight + 1);
    expect(getRequestState().inFlight).toBe(before.inFlight);
    expect(getRequestState().finished).toBe(before.finished + 1);
  });

  it("also counts a failed request as finished", async () => {
    const before = getRequestState();
    await expect(apiClient.get("/x", { adapter: respond(500) })).rejects.toThrow("500");
    expect(getRequestState().inFlight).toBe(before.inFlight);
    expect(getRequestState().finished).toBe(before.finished + 1);
  });

  it("does not count requests after the loader has closed", async () => {
    endRequestSession();
    const before = getRequestState();
    await apiClient.get("/x", { adapter: respond() });
    expect(getRequestState()).toMatchObject({ started: before.started, finished: before.finished });
  });

  it("cannot reach the network in tests", async () => {
    await expect(apiClient.get("/x")).rejects.toThrow("Network is disabled");
  });
});
