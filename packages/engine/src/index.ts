// WolfShield detection engine.
// Pure functions only: zero UI imports, zero Tauri imports.
// This module is reusable by a future browser extension or bot.
import { ENGINE_VERSION, DATA_VERSION, MAX_INPUT_LENGTH } from "@wolfshield/shared";
import type { CheckResult, FileMeta, Language } from "@wolfshield/shared";

export type { CheckResult, FileMeta, Language };

const BENGALI_RANGE = /[\u0980-\u09FF]/;

/** Detect the script/language family of an input string. Pure and deterministic. */
export function detectLanguage(input: string): Language {
  const text = input.trim();
  if (!text) return "unknown";
  const hasBengali = BENGALI_RANGE.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  if (hasBengali && hasLatin) return "mixed";
  if (hasBengali) return "bn";
  if (hasLatin) return "en";
  return "unknown";
}

/**
 * STUB: M0 placeholder verdict.
 * The full rules engine (URL, brand, text signals) is M1.
 * Until then, checkText/checkUrl/checkFileMeta return a neutral result
 * with no signals, so the UI never overclaims. Do not present this
 * as a detection result in production UI copy.
 */
function neutralResult(language: Language): CheckResult {
  return {
    verdict: "safe",
    score: 0,
    language,
    signals: [],
    engineVersion: ENGINE_VERSION,
    dataVersion: DATA_VERSION,
  };
}

export async function checkText(input: string): Promise<CheckResult> {
  const text = input.slice(0, MAX_INPUT_LENGTH);
  // STUB: rules engine is M1. Language detection is real.
  return neutralResult(detectLanguage(text));
}

export async function checkUrl(url: string): Promise<CheckResult> {
  const text = url.slice(0, MAX_INPUT_LENGTH).trim();
  // STUB: URL signals (lookalike domains, shorteners, IP hosts) are M1.
  // Validate only that the string parses as a URL; unparsable input
  // is still returned neutrally, never thrown, so callers can explain it.
  try {
    new URL(text);
  } catch {
    // Intentionally neutral in M0; M1 adds a malformed-url signal.
  }
  return neutralResult(detectLanguage(text));
}

export async function checkFileMeta(meta: FileMeta): Promise<CheckResult> {
  // STUB: file heuristics (double extensions, Zone.Identifier origin,
  // hash blocklist) are M1/M3. M0 returns a neutral result.
  return neutralResult(detectLanguage(meta.fileName));
}
