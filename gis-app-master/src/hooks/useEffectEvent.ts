import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a function that never changes but always calls the latest `fn`.
 *
 * Use it for logic an effect runs but should not re-run for: the effect lists
 * only the values it reacts to, and reads everything else through this function.
 * (Same idea as React's experimental `useEffectEvent`.)
 *
 *   const loadReports = useEffectEvent(() => fetchReports(userId, filters));
 *   useEffect(() => loadReports(), [refresh, loadReports]); // runs on refresh only
 *
 * Call it from effects or event handlers, not while rendering. Call this hook
 * before the effects that use it, so they see the latest `fn`.
 */
export const useEffectEvent = <A extends unknown[], R>(fn: (...args: A) => R) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: A) => ref.current(...args), []);
};

export default useEffectEvent;
