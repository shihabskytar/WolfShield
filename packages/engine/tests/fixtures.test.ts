import { describe, expect, it } from "vitest";
import { checkFileMeta, checkText, checkUrl } from "../src/index.js";
import { FIXTURES } from "./fixtures.js";

describe("M1 fixtures", () => {
  it("has 150+ labelled cases", () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(150);
  });

  it("matches every labelled verdict", async () => {
    for (const fixture of FIXTURES) {
      const result =
        fixture.kind === "file"
          ? await checkFileMeta(fixture.meta)
          : fixture.kind === "url"
            ? await checkUrl(fixture.input)
            : await checkText(fixture.input);
      expect(
        result.verdict,
        `${fixture.kind} fixture "${fixture.note}": expected ${fixture.verdict}, got ${result.verdict} (score ${result.score}, signals ${result.signals.map((s) => s.id).join(",")})`,
      ).toBe(fixture.verdict);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("never throws on malformed or extreme input", async () => {
    await expect(checkUrl("::::")).resolves.toBeDefined();
    await expect(checkUrl("")).resolves.toBeDefined();
    await expect(checkText("x".repeat(100000))).resolves.toBeDefined();
    await expect(checkFileMeta({ fileName: "" })).resolves.toBeDefined();
    await expect(checkFileMeta({ fileName: "a".repeat(5000) })).resolves.toBeDefined();
  });

  it("is deterministic", async () => {
    const a = await checkText("লটারি জিতেছেন, OTP দিন");
    const b = await checkText("লটারি জিতেছেন, OTP দিন");
    expect(a).toEqual(b);
  });

  it("returns exact evidence and explain keys on a known lure", async () => {
    const r = await checkText("Share your OTP");
    expect(r.signals[0].evidence).toBe("share your otp");
    expect(r.signals[0].explainKey).toBe("explainOtpRequest");
  });

  it("truncates very long input instead of scoring it all", async () => {
    const r = await checkText("hello ".repeat(5000));
    expect(r.verdict).toBe("safe");
  });
});
