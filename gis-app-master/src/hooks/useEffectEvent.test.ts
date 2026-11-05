import { renderHook } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { useEffectEvent } from "./useEffectEvent";

describe("useEffectEvent", () => {
  it("keeps the same function between renders", () => {
    const { result, rerender } = renderHook(({ n }) => useEffectEvent(() => n), { initialProps: { n: 1 } });
    const first = result.current;
    rerender({ n: 2 });
    expect(result.current).toBe(first);
  });

  it("always calls the latest version", () => {
    const { result, rerender } = renderHook(({ n }) => useEffectEvent((x: number) => n + x), {
      initialProps: { n: 1 },
    });
    rerender({ n: 10 });
    expect(result.current(5)).toBe(15);
  });

  it("lets an effect read new values without re-running for them", () => {
    const seen = vi.fn();
    const { rerender } = renderHook(
      ({ trigger, value }) => {
        const report = useEffectEvent(() => seen(trigger, value));
        useEffect(() => report(), [trigger, report]);
      },
      { initialProps: { trigger: 1, value: "a" } },
    );
    rerender({ trigger: 1, value: "b" }); // value only: effect does not run
    expect(seen.mock.calls).toEqual([[1, "a"]]);
    rerender({ trigger: 2, value: "c" }); // trigger changes: runs with the latest value
    expect(seen.mock.calls).toEqual([[1, "a"], [2, "c"]]);
  });

  it("returns what the function returns, e.g. an effect cleanup", () => {
    const cleanup = vi.fn();
    const { unmount } = renderHook(() => {
      const setup = useEffectEvent(() => cleanup);
      useEffect(() => setup(), [setup]);
    });
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
