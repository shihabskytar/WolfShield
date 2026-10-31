import { useState } from "react";
import { checkText } from "@wolfshield/engine";
import { t, type UILanguage } from "@wolfshield/shared";

export default function App() {
  const [lang, setLang] = useState<UILanguage>("bn");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string>("");
  async function onCheck() {
    const r = await checkText(input);
    setResult(`${t(lang, "verdictSafe")} · score ${r.score} · ${r.language}`);
  }
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
        {result && <p className="mt-4 rounded bg-slate-800 p-3" role="status">{result}</p>}
        <p className="mt-4 text-sm text-slate-400">{t(lang, "disclaimer")}</p>
        <p className="text-sm text-slate-400">{t(lang, "doNotShareOtp")}</p>
        <p className="mt-6 text-sm text-slate-500">M0 shell only: the detection rules engine is Milestone M1. This window does not claim a scam verdict yet.</p>
      </section>
    </main>
  );
}
