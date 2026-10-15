// Public API of the departments feature. Code outside features/departments
// imports from "@/features/departments" only. Components are not exported
// here, so server-component pages can import them by path.
export * from "./api";
export * from "./hooks";
export * from "./schema";
export * from "./types";
