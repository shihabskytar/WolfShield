// WolfShield detection engine (M1 rules engine).
// Pure functions only: zero UI imports, zero Tauri imports.
// This module is reusable by a future browser extension or bot.
// Scoring: weighted signals summed and capped at 100.
//   safe < 40 · suspicious 40–69 · dangerous >= 70 (see docs/DETECTION.md).
// Every verdict is an automated estimate: signals carry exact evidence
// and an explainKey into packages/shared/src/i18n.ts. Nothing here
// claims certainty, and malformed input never throws.
import { ENGINE_VERSION, DATA_VERSION, MAX_INPUT_LENGTH } from "@wolfshield/shared";
import type { CheckResult, FileMeta, Language, Signal } from "@wolfshield/shared";
import {
  BLOCKLIST_DOMAINS,
  BRANDS,
  CRACKED_PATTERNS,
  DOCUMENT_IMAGE_EXTENSIONS,
  EXECUTABLE_EXTENSIONS,
  IMPERSONATION_NAMES,
  KEYWORD_PACKS,
  KNOWN_BAD_SHA256,
  SHORTENERS,
  domainCore,
  isNewsQuote,
  isOfficialDomain,
  levenshtein,
  normalizeText,
  phraseMatches,
  registrableDomain,
} from "./rules.js";

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

const PACK_SIGNALS: Record<string, { weight: number; explainKey: string }> = {
  otp_request: { weight: 40, explainKey: "explainOtpRequest" },
  prize_lure: { weight: 30, explainKey: "explainPrizeLure" },
  urgency_threat: { weight: 20, explainKey: "explainUrgencyThreat" },
  job_fee: { weight: 30, explainKey: "explainJobFee" },
  loan_lure: { weight: 25, explainKey: "explainLoanLure" },
  send_to_receive: { weight: 35, explainKey: "explainSendToReceive" },
};

function buildResult(language: Language, signals: Signal[]): CheckResult {
  const sorted = [...signals].sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id));
  const score = Math.min(100, sorted.reduce((sum, s) => sum + s.weight, 0));
  return {
    verdict: score >= 70 ? "dangerous" : score >= 40 ? "suspicious" : "safe",
    score,
    language,
    signals: sorted,
    engineVersion: ENGINE_VERSION,
    dataVersion: DATA_VERSION,
  };
}

function add(signals: Signal[], id: string, weight: number, evidence: string, explainKey: string): void {
  if (!signals.some((s) => s.id === id)) signals.push({ id, weight, evidence, explainKey });
}

/** URL rules shared by checkUrl and by file Zone.Identifier origins. */
export function urlSignals(raw: string): Signal[] {
  const signals: Signal[] = [];
  // Parser-independent raw-host checks: Node 20 and Node 24 disagree on
  // whether an invalid punycode label (e.g. xn--bkash) parses at all, so
  // punycode and brand-in-label signals must not depend on URL parsing.
  const rawHost = raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .split(/[\/?#]/)[0]
    .replace(/^[^@]*@/, "")
    .split(":")[0]
    .toLowerCase();
  if (rawHost.includes("xn--")) {
    add(signals, "url_punycode", 20, rawHost, "explainPunycode");
  }
  for (const brand of BRANDS) {
    const token = brand.name.toLowerCase().replace(/[^a-z]/g, "");
    if (token.length >= 4 && rawHost.split(".").some((label) => label.includes(token) && label !== token)) {
      add(signals, "url_brand_in_domain", 25, `${rawHost} (mentions ${brand.name})`, "explainBrandInDomain");
    }
  }
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    add(signals, "url_malformed", 15, raw.slice(0, 80), "explainMalformedUrl");
    return signals;
  }
  const host = url.hostname.toLowerCase();
  const reg = registrableDomain(host);
  if (BLOCKLIST_DOMAINS.some((d) => d.toLowerCase() === reg || host.endsWith(`.${d.toLowerCase()}`))) {
    add(signals, "url_blocklist", 40, host, "explainBlocklist");
  }
  if (!isOfficialDomain(host)) {
    const core = domainCore(host);
    for (const brand of BRANDS) {
      for (const domain of brand.domains) {
        const brandCore = domainCore(domain);
        const distance = levenshtein(core, brandCore);
        if (core !== brandCore && distance <= 2 && Math.abs(core.length - brandCore.length) <= 2) {
          add(signals, "url_lookalike", 35, `${host} ~ ${domain} (${brand.name})`, "explainLookalike");
        }
        const token = brand.name.toLowerCase().replace(/[^a-z]/g, "");
        if (token.length >= 4 && host.split(".").some((label) => label.includes(token) && label !== token)) {
          add(signals, "url_brand_in_domain", 25, `${host} (mentions ${brand.name})`, "explainBrandInDomain");
        }
      }
    }
    // Brand name in a subdomain or path of an unrelated domain.
    const pathText = `${host} ${url.pathname}`.toLowerCase();
    for (const brand of BRANDS) {
      const token = brand.name.toLowerCase().replace(/[^a-z]/g, "");
      if (token.length >= 4 && pathText.includes(token) && !pathText.includes(brand.domains[0].toLowerCase())) {
        add(signals, "url_brand_in_domain", 25, `${host}${url.pathname} (mentions ${brand.name})`, "explainBrandInDomain");
      }
    }
  }
  if (host.includes("xn--")) {
    add(signals, "url_punycode", 20, host, "explainPunycode");
  }
  if (SHORTENERS.has(reg)) {
    add(signals, "url_shortener", 20, host, "explainShortener");
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /^\[[0-9a-f:]+\]$/.test(host)) {
    add(signals, "url_ip_host", 30, host, "explainIpHost");
  }
  if (url.username || url.password) {
    add(signals, "url_credentials", 30, `${url.username ? "user@" : ""}${host}`, "explainCredentials");
  }
  if (url.port && !["80", "443"].includes(url.port)) {
    add(signals, "url_unusual_port", 15, `${host}:${url.port}`, "explainUnusualPort");
  }
  const labels = host.split(".").length;
  if (labels >= 5) {
    add(signals, "url_excessive_subdomains", 15, host, "explainExcessiveSubdomains");
  }
  const pathLower = url.pathname.toLowerCase();
  for (const ext of EXECUTABLE_EXTENSIONS) {
    if (pathLower.endsWith(ext)) {
      add(signals, "url_executable_extension", 30, url.pathname, "explainExecutableExtension");
      break;
    }
  }
  return signals;
}

function textSignals(text: string): Signal[] {
  const signals: Signal[] = [];
  if (isNewsQuote(text)) return signals;
  const normalized = normalizeText(text);
  // One signal per pack (strongest phrase evidence), even if several
  // phrases from the same pack match.
  for (const pack of KEYWORD_PACKS) {
    const meta = PACK_SIGNALS[pack.id];
    if (!meta) continue;
    const hit = pack.phrases.find((phrase) => phraseMatches(normalized, phrase));
    if (hit) add(signals, `text_${pack.id}`, meta.weight, hit, meta.explainKey);
  }
  const lower = normalized;
  const impersonator = IMPERSONATION_NAMES.find((name) => lower.includes(name));
  if (impersonator) {
    add(signals, "text_impersonation", 15, impersonator, "explainImpersonation");
  }
  return signals;
}

export async function checkText(input: string): Promise<CheckResult> {
  const text = input.slice(0, MAX_INPUT_LENGTH);
  if (!text.trim()) return buildResult("unknown", []);
  const signals = textSignals(text);
  // A bare URL pasted into the text box is also judged by URL rules.
  const trimmed = text.trim();
  if (/^https?:\/\/\S+$/i.test(trimmed) || /^www\.\S+\.\S+$/i.test(trimmed)) {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    for (const s of urlSignals(withScheme)) add(signals, s.id, s.weight, s.evidence, s.explainKey);
  } else {
    // URLs embedded in a message are judged too, but only their host
    // evidence is surfaced, so a lure message with a link scores both.
    const embedded = text.match(/https?:\/\/[^\s)>\]]+/gi) ?? [];
    for (const raw of embedded.slice(0, 3)) {
      for (const s of urlSignals(raw)) add(signals, s.id, s.weight, s.evidence, s.explainKey);
    }
  }
  return buildResult(detectLanguage(text), signals);
}

export async function checkUrl(url: string): Promise<CheckResult> {
  const text = url.slice(0, MAX_INPUT_LENGTH).trim();
  if (!text) return buildResult("unknown", []);
  const withScheme = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  return buildResult(detectLanguage(text), urlSignals(withScheme));
}

export async function checkFileMeta(meta: FileMeta): Promise<CheckResult> {
  const signals: Signal[] = [];
  const name = (meta.fileName ?? "").slice(0, 500);
  const lower = name.toLowerCase();
  const parts = lower.split(".");
  const finalExt = parts.length > 1 ? `.${parts[parts.length - 1]}` : "";
  if (parts.length > 2) {
    const prevExt = `.${parts[parts.length - 2]}`;
    if (EXECUTABLE_EXTENSIONS.has(finalExt)) {
      add(signals, "file_double_extension", 35, name, "explainDoubleExtension");
      if (DOCUMENT_IMAGE_EXTENSIONS.has(prevExt)) {
        add(signals, "file_disguised_executable", 30, name, "explainDisguisedExecutable");
      }
    }
  }
  if (CRACKED_PATTERNS.some((re) => re.test(name))) {
    add(signals, "file_cracked", 40, name, "explainCracked");
  }
  // Zone.Identifier origin URLs are judged by the same URL rules.
  const origin = meta.referrerUrl ?? meta.hostUrl;
  if (origin) {
    for (const s of urlSignals(origin)) add(signals, s.id, s.weight, s.evidence, s.explainKey);
    add(signals, "file_zone_origin", 10, origin.slice(0, 120), "explainZoneOrigin");
  }
  if (meta.sha256 && KNOWN_BAD_SHA256.has(meta.sha256.toLowerCase())) {
    add(signals, "file_sha_blocklist", 50, meta.sha256.slice(0, 16), "explainShaBlocklist");
  }
  return buildResult(detectLanguage(name), signals);
}
