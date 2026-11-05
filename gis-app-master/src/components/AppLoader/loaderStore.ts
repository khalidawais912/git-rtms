/* Shared state for the full-screen RTMES loader.
   - Page holds: <Loader variant="page" /> keeps the loader up while it is mounted.
   - API requests: while the loader is up (page open / page change), every apiClient request is
     counted, so the loader moves with the responses and closes only when they have all come back. */
type Listener = (pending: number) => void;

let pending = 0;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((l) => l(pending));

export const holdAppLoader = () => {
  pending += 1;
  emit();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    pending = Math.max(0, pending - 1);
    emit();
  };
};

export const getPendingLoads = () => pending;

export const subscribeAppLoader = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/* ---------- API requests ---------- */
// The loader is on screen and counting requests. True from the start: the page's first requests
// can go out before the loader component has run its own effects.
let session = true;
let started = 0;
let finished = 0;
let inFlight = 0;
let lastActivity = 0;

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/** The loader opened: count requests from here */
export const beginRequestSession = () => {
  session = true;
  started = inFlight;
  finished = 0;
  lastActivity = now();
};

/** The loader closed: later requests (button clicks, polling) do not bring it back */
export const endRequestSession = () => {
  session = false;
};

/** Returns true when this request is counted, so its response must call requestFinished() */
export const requestStarted = () => {
  if (!session) return false;
  started += 1;
  inFlight += 1;
  lastActivity = now();
  return true;
};

export const requestFinished = () => {
  inFlight = Math.max(0, inFlight - 1);
  finished = Math.min(started, finished + 1);
  lastActivity = now();
};

export const getRequestState = () => ({ started, finished, inFlight, lastActivity });
