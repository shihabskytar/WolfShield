// WolfShield M1 rules data.
// Source of truth for keyword packs: data/keywords_*.json (generic lure
// phrasing written for this project, no personal data, no real messages).
// Brand domains: data/brands.json. Seed blocklist: data/blocklist_seed.json
// (.example domains only — never treat them as confirmed malicious).
// Shortener list: widely known public URL-shortening services.
// Impersonation names beyond data/brands.json are public Bangladeshi
// telco brand names (Grameenphone, Robi, Banglalink, Teletalk), used
// only to detect a message claiming to be from them.
import brandsData from "../../../data/brands.json";
import blocklistData from "../../../data/blocklist_seed.json";
import keywordsBn from "../../../data/keywords_bn.json";
import keywordsEn from "../../../data/keywords_en.json";
import keywordsBanglish from "../../../data/keywords_banglish.json";

export interface BrandEntry {
  name: string;
  domains: string[];
}

export const BRANDS: BrandEntry[] = (brandsData as { brands: BrandEntry[] }).brands;
export const BLOCKLIST_DOMAINS: string[] = (blocklistData as { domains: string[] }).domains;

export interface KeywordPack {
  id: string;
  phrases: string[];
}

export const KEYWORD_PACKS: KeywordPack[] = [
  ...((keywordsBn as { packs: KeywordPack[] }).packs.map((p) => ({ ...p, phrases: p.phrases.map(normalizeText) }))),
  ...((keywordsEn as { packs: KeywordPack[] }).packs.map((p) => ({ ...p, phrases: p.phrases.map(normalizeText) }))),
  ...((keywordsBanglish as { packs: KeywordPack[] }).packs.map((p) => ({ ...p, phrases: p.phrases.map(normalizeText) }))),
];

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u200c\u200d]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Padded substring match: avoids "pin" matching inside "shipping".
 *  Punctuation is stripped first, so a phrase still matches when the
 *  message puts a comma or full stop after it. */
export function phraseMatches(text: string, phrase: string): boolean {
  const strip = (s: string): string => normalizeText(s).replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
  const hay = ` ${strip(text)} `;
  const needle = ` ${strip(phrase)} `;
  return hay.includes(needle);
}

export const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly",
  "shorturl.at", "rb.gy", "s.id", "tiny.cc", "ow.ly", "buff.ly",
]);

export const EXECUTABLE_EXTENSIONS = new Set([
  ".apk", ".exe", ".msi", ".scr", ".bat", ".js", ".com", ".pif", ".vbs", ".jar",
]);

export const DOCUMENT_IMAGE_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".gif", ".zip",
]);

export const CRACKED_PATTERNS = [
  /crack/i, /keygen/i, /activator/i, /patch(ed)?\s*(full|pro)/i,
  /free\s+premium/i, /preactivated/i,
];

// Public telco / government-adjacent names used only for impersonation
// detection (a message claiming to be from them). No official domains
// are claimed for these names here.
export const IMPERSONATION_NAMES = [
  "bkash", "nagad", "rocket", "bangladesh bank", "dutch-bangla",
  "grameenphone", "robi", "banglalink", "teletalk",
];

/** SHA-256 blocklist hook. Empty in M1 by design: a real list must come
 *  from a verified, signed source (see docs/DETECTION.md). The hook is
 *  wired so a future list needs no engine change. */
export const KNOWN_BAD_SHA256: ReadonlySet<string> = new Set<string>();

/** Levenshtein distance, small inputs only (domain labels). */
export function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

const SUFFIXES = [".com.bd", ".org.bd", ".net.bd", ".edu.bd", ".gov.bd", ".com", ".org", ".net", ".bd"];

export function domainCore(host: string): string {
  let h = host.toLowerCase().replace(/^www\./, "");
  for (const suffix of SUFFIXES) {
    if (h.endsWith(suffix) && h.length > suffix.length) {
      h = h.slice(0, -suffix.length);
      break;
    }
  }
  return h;
}

/** Registrable domain: last two labels, or last three for *.bd names. */
export function registrableDomain(host: string): string {
  const h = host.toLowerCase().replace(/^www\./, "");
  const parts = h.split(".");
  if (parts.length <= 2) return h;
  if (h.endsWith(".bd")) return parts.slice(-3).join(".");
  return parts.slice(-2).join(".");
}

export function isOfficialDomain(host: string): boolean {
  const reg = registrableDomain(host);
  return BRANDS.some((b) => b.domains.some((d) => d.toLowerCase() === reg));
}

/** News/reporting framing: a message reporting on a scam, not running one.
 *  Requires a reporting verb + third-person framing, so a scammer cannot
 *  dodge detection by merely adding the word "news". */
export function isNewsQuote(text: string): boolean {
  const t = normalizeText(text);
  const reporting =
    /news|report|প্রতিবেদন|সংবাদ|সতর্ক|warn|alert|awareness|সচেতন/.test(t) &&
    /(scam|scammer|fraud|প্রতার|প্রতারণা|fake|ভুয়া|ভুয়া)/.test(t) &&
    /(people|users|victim|public|জনগণ|মানুষ|গ্রাহক|reported|বলা|জানানো)/.test(t);
  return reporting;
}
