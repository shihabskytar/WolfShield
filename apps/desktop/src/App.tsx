import { useState } from "react";
import { checkText, checkUrl } from "@wolfshield/engine";
import { t, type CheckResult, type UILanguage } from "@wolfshield/shared";

function isUrlLike(input: string): boolean {
  const text = input.trim();
  if (/^https?:\/\/\S+$/i.test(text)) return true;
  if (/^www\.[^\s]+\.[^\s]+$/i.test(text)) return true;
  return false;
}

const VERDICT_CLASS: Record<CheckResult["verdict"], string> = {
  safe: "bg-emerald-900 text-emerald-100",
  suspicious: "bg-amber-900 text-amber-100",
  dangerous: "bg-red-900 text-red-100",
};

export default function App() {
  const [lang, setLang] = useState<UILanguage>("bn");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checkedAsUrl, setCheckedAsUrl] = useState(false);
  async function onCheck() {
    const asUrl = isUrlLike(input);
    setCheckedAsUrl(asUrl);
    setResult(asUrl ? await checkUrl(input) : await checkText(input));
  }
  const verdictKey =
    result?.verdict === "dangerous"
      ? "verdictDangerous"
      : result?.verdict === "suspicious"
        ? "verdictSuspicious"
        : "verdictSafe";
  const reasonKey =
    result?.verdict === "dangerous"
      ? "reasonDangerous"
      : result?.verdict === "suspicious"
        ? "reasonSuspicious"
        : "reasonSafe";
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">{t(lang, "appTitle")}</h1>
        <p className="text-slate-400">{t(lang, "appTagline")}</p>
        <label className="block mt-4 text-sm">
          {t(lang, "language")}:{" "}
          <select value={lang} onChange={(e) => setLang(e.target.value as UILanguage)} className="bg-slate-800 rounded px-2 py-1">
            <option value="bn">বাংলা</option>
            <option value="en">English</option>
          </select>
        </label>
      </header>
      <section className="max-w-2xl mx-auto mt-6">
        <h2 className="text-xl font-semibold">{t(lang, "quickCheck")}</h2>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t(lang, "pastePlaceholder")} rows={5} className="w-full mt-2 bg-slate-800 rounded p-3" />
        <button onClick={onCheck} className="mt-3 bg-emerald-500 text-slate-950 font-semibold rounded px-4 py-2">{t(lang, "check")}</button>
        {result && (
          <div className={`mt-4 rounded p-4 ${VERDICT_CLASS[result.verdict]}`} role="status">
            <h3 className="text-lg font-semibold">{t(lang, "resultHeading")}</h3>
            <p className="mt-1 font-semibold">
              {t(lang, verdictKey)} · {t(lang, "scoreLabel")}: {result.score}/100
            </p>
            <p className="mt-1 text-sm opacity-90">{checkedAsUrl ? t(lang, "detectedUrl") : t(lang, "detectedText")}</p>
            <p className="mt-2">{t(lang, reasonKey)}</p>
            <h4 className="mt-3 font-semibold">{t(lang, "signalsLabel")}</h4>
            {result.signals.length === 0 ? (
              <p className="text-sm">{t(lang, "noSignals")}</p>
            ) : (
              <ul className="mt-1 space-y-2">
                {result.signals.slice(0, 5).map((signal) => (
                  <li key={signal.id} className="text-sm">
                    <span className="font-semibold">{t(lang, signal.explainKey as Parameters<typeof t>[1])}</span>
                    <br />
                    <span className="opacity-80">
                      {t(lang, "evidenceLabel")}: {signal.evidence}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <p className="mt-4 text-sm text-slate-400">{t(lang, "disclaimer")}</p>
        <p className="text-sm text-slate-400">{t(lang, "doNotShareOtp")}</p>
      </section>
    </main>
  );
}
