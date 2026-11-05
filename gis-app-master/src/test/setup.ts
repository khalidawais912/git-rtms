/* Runs before every test file. */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import axios from "axios";
import { afterEach, vi } from "vitest";

// Tests never reach a real server: any request that is not mocked fails straight away.
const blocked = () => Promise.reject(new Error("Network is disabled in unit tests; mock the request."));
axios.defaults.adapter = blocked;
vi.stubGlobal("fetch", vi.fn(blocked));

afterEach(() => {
  cleanup();
});
