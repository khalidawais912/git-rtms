/* Lets any page-level loading state keep the full-screen RTMES loader on screen.
   holdAppLoader() returns a release function; the loader stays up while any hold is active. */
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
