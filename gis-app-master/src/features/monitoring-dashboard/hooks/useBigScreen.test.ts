import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBigScreen } from "./useBigScreen";

// jsdom has no Fullscreen API, so it is faked here
let fullscreenElement: Element | null = null;
const requestFullscreen = vi.fn(async () => {
  fullscreenElement = document.documentElement;
});
const exitFullscreen = vi.fn(async () => {
  fullscreenElement = null;
});

beforeEach(() => {
  fullscreenElement = null;
  Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => fullscreenElement });
  Object.defineProperty(document, "exitFullscreen", { configurable: true, value: exitFullscreen });
  Object.defineProperty(document.documentElement, "requestFullscreen", {
    configurable: true,
    value: requestFullscreen,
  });
});

afterEach(() => {
  requestFullscreen.mockClear();
  exitFullscreen.mockClear();
});

describe("useBigScreen", () => {
  it("starts in normal mode", () => {
    const { result } = renderHook(() => useBigScreen());
    expect(result.current.bigScreen).toBe(false);
  });

  it("turns on and asks the browser for full screen", async () => {
    const { result } = renderHook(() => useBigScreen());
    await act(() => result.current.toggleBigScreen());
    expect(result.current.bigScreen).toBe(true);
    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("turns off and leaves full screen", async () => {
    const { result } = renderHook(() => useBigScreen());
    await act(() => result.current.toggleBigScreen());
    await act(() => result.current.toggleBigScreen());
    expect(result.current.bigScreen).toBe(false);
    expect(exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it("turns off when the user leaves full screen with Esc", async () => {
    const { result } = renderHook(() => useBigScreen());
    await act(() => result.current.toggleBigScreen());
    act(() => {
      fullscreenElement = null;
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    expect(result.current.bigScreen).toBe(false);
  });

  it("still turns on when the browser blocks full screen", async () => {
    requestFullscreen.mockRejectedValueOnce(new Error("blocked"));
    const { result } = renderHook(() => useBigScreen());
    await act(() => result.current.toggleBigScreen());
    expect(result.current.bigScreen).toBe(true);
  });
});
