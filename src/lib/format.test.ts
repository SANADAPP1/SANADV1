import { describe, expect, it } from "vitest";
import { formatDZD } from "./format";

describe("formatDZD", () => {
  it("formats the yearly app subscription as 500 دج", () => {
    expect(formatDZD(500)).toBe("500 دج");
  });
  it("groups thousands with Latin digits", () => {
    expect(formatDZD(124500)).toBe("124,500 دج");
  });
});
