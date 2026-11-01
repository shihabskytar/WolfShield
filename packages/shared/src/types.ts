export type Verdict = "safe" | "suspicious" | "dangerous";
export type Language = "bn" | "en" | "banglish" | "mixed" | "unknown";
export type UILanguage = "bn" | "en";

export interface Signal {
  id: string;
  weight: number;
  evidence: string;
  explainKey: string;
}

export interface CheckResult {
  verdict: Verdict;
  score: number;
  language: Language;
  signals: Signal[];
  modelScore?: number;
  engineVersion: string;
  dataVersion: string;
}

export interface FileMeta {
  fileName: string;
  sizeBytes?: number;
  sha256?: string;
  zoneId?: number;
  referrerUrl?: string;
  hostUrl?: string;
}
