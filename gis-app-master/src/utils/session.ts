import Cookies from "js-cookie";

/** Every cookie the login session uses. Add a new one here so logout clears it too. */
export const SESSION_KEYS = [
  "token",
  "userName",
  "userId",
  "email",
  "departmentId",
  "deptUserFirstName",
  "deptUserLastName",
  "role",
  "rights",
] as const;

export type SessionKey = (typeof SESSION_KEYS)[number];

export const getSession = (key: SessionKey) => Cookies.get(key);

/** The logged-in user's right names (stored as a JSON array). */
export const getRights = (): string[] =>
  JSON.parse(Cookies.get("rights") || "[]");

/** Saves the given values as cookies; undefined values are skipped. */
export const saveSession = (
  values: Partial<Record<SessionKey, string>>,
  expires: Date,
) => {
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) Cookies.set(key, value, { expires });
  });
};

export const clearSession = () =>
  SESSION_KEYS.forEach((key) => Cookies.remove(key));
