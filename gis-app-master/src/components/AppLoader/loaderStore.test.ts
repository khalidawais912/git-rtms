import { beforeEach, describe, expect, it, vi } from "vitest";

// The store keeps module-level state, so every test gets a fresh copy
let store: typeof import("./loaderStore");
beforeEach(async () => {
  vi.resetModules();
  store = await import("./loaderStore");
});

describe("page holds", () => {
  it("counts holds and releases each one", () => {
    const a = store.holdAppLoader();
    const b = store.holdAppLoader();
    expect(store.getPendingLoads()).toBe(2);
    a();
    expect(store.getPendingLoads()).toBe(1);
    b();
    expect(store.getPendingLoads()).toBe(0);
  });

  it("ignores releasing the same hold twice", () => {
    const a = store.holdAppLoader();
    store.holdAppLoader();
    a();
    a();
    expect(store.getPendingLoads()).toBe(1);
  });

  it("tells listeners about every change until they unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribeAppLoader(listener);
    const release = store.holdAppLoader();
    release();
    expect(listener.mock.calls).toEqual([[1], [0]]);

    unsubscribe();
    store.holdAppLoader();
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

describe("API requests", () => {
  it("counts requests from the very first load", () => {
    expect(store.requestStarted()).toBe(true);
    expect(store.getRequestState()).toMatchObject({ started: 1, finished: 0, inFlight: 1 });
    store.requestFinished();
    expect(store.getRequestState()).toMatchObject({ started: 1, finished: 1, inFlight: 0 });
  });

  it("stops counting once the loader has closed", () => {
    store.endRequestSession();
    expect(store.requestStarted()).toBe(false);
    expect(store.getRequestState()).toMatchObject({ started: 0, inFlight: 0 });
  });

  it("a new session starts from the requests still in flight", () => {
    store.requestStarted();
    store.requestStarted();
    store.requestFinished();
    store.endRequestSession();

    store.beginRequestSession();
    expect(store.getRequestState()).toMatchObject({ started: 1, finished: 0, inFlight: 1 });
    expect(store.requestStarted()).toBe(true);
    expect(store.getRequestState()).toMatchObject({ started: 2, inFlight: 2 });
  });

  it("never goes below zero or past the number started", () => {
    store.requestFinished();
    store.requestFinished();
    expect(store.getRequestState()).toMatchObject({ started: 0, finished: 0, inFlight: 0 });
  });

  it("records when the last request started or finished", () => {
    const before = store.getRequestState().lastActivity;
    vi.spyOn(performance, "now").mockReturnValue(before + 500);
    store.requestStarted();
    expect(store.getRequestState().lastActivity).toBe(before + 500);
  });
});
