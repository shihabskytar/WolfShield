import type { UILanguage } from "./types.js";

export const STRINGS = {
  bn: {
    appTitle: "WolfShield",
    appTagline: "বার্তা, লিংক বা ফাইল স্ক্যাম কি না, অফলাইনে যাচাই করুন।",
    quickCheck: "দ্রুত যাচাই",
    pastePlaceholder: "এখানে বার্তা বা লিংক পেস্ট করুন…",
    check: "যাচাই করুন",
    verdictSafe: "নিরাপদ মনে হচ্ছে",
    verdictSuspicious: "সন্দেহজনক",
    verdictDangerous: "বিপজ্জনক মনে হচ্ছে",
    disclaimer: "এটি একটি স্বয়ংক্রিয় অনুমান, নিশ্চিত সিদ্ধান্ত নয়।",
    doNotShareOtp: "আপনার OTP বা PIN কারো সাথে শেয়ার করবেন না।",
    settings: "সেটিংস",
    history: "ইতিহাস",
    language: "ভাষা",
  },
  en: {
    appTitle: "WolfShield",
    appTagline: "Check whether a message, link, or file looks like a scam — fully offline.",
    quickCheck: "Quick check",
    pastePlaceholder: "Paste a message or link here…",
    check: "Check",
    verdictSafe: "Looks safe",
    verdictSuspicious: "Suspicious",
    verdictDangerous: "Looks dangerous",
    disclaimer: "This is an automated estimate, not a certainty.",
    doNotShareOtp: "Do not share your OTP or PIN with anyone.",
    settings: "Settings",
    history: "History",
    language: "Language",
  },
} as const satisfies Record<UILanguage, Record<string, string>>;

export type StringKey = keyof typeof STRINGS.en;
export function t(lang: UILanguage, key: StringKey): string {
  return STRINGS[lang][key] ?? STRINGS.en[key];
}
