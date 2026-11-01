import { describe, expect, it } from "vitest";
import { checkText, detectLanguage } from "../src/index.js";

describe("detectLanguage", () => {
  it("detects Bangla script", () => {
    expect(detectLanguage("আপনার অ্যাকাউন্ট যাচাই করুন")).toBe("bn");
  });
  it("detects English", () => {
    expect(detectLanguage("Verify your account now")).toBe("en");
  });
  it("detects mixed Bangla + Latin", () => {
    expect(detectLanguage("আপনার bKash account")).toBe("mixed");
  });
  it("returns unknown for empty input", () => {
    expect(detectLanguage("   ")).toBe("unknown");
  });
});

describe("checkText (M1 rules engine)", () => {
  it("returns a neutral, deterministic result with versions", async () => {
    const a = await checkText("hello world");
    const b = await checkText("hello world");
    expect(a).toEqual(b);
    expect(a.engineVersion).toBe("0.1.0");
    expect(a.dataVersion).toBe("0.1.0");
    expect(a.signals).toEqual([]);
  });
});
