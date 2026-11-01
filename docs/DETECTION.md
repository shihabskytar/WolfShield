# Detection

## M1 status

The M1 rules engine is implemented in `packages/engine/src/index.ts`
(pure TypeScript, zero UI/Tauri imports) and wired to the desktop
quick-check result card in `apps/desktop/src/App.tsx`. The M0 neutral
stub is gone; no `// STUB:` remains in the engine's check functions.

## Implemented signals (M1)

### URL and domain

- Lookalike domains of the brand list in `data/brands.json`:
  Levenshtein edit distance ≤ 2 on the domain core, punycode
  (`xn--`) hosts, and a brand name inside a subdomain or path of an
  unrelated domain. Exact official domains are never flagged.
- URL shorteners (well-known public services, see
  `packages/engine/src/rules.ts`), raw IP hosts, unusual ports
  (anything other than 80/443), 5+ domain labels, credentials in URL
  (`user@host`), and links ending in an executable extension
  (`.apk`, `.exe`, `.msi`, `.scr`, `.bat`, `.js`, and similar).
- Local blocklist match against `data/blocklist_seed.json`. The seed
  contains `.example` domains only and is NOT a confirmed-malicious
  list; a real list must come from a verified, signed source.
- Malformed URLs get a low-weight signal instead of throwing.

### Text (Bangla, English, Banglish)

Keyword packs in `data/keywords_*.json` (generic lure phrasing written
for this project, no personal data):

- OTP/PIN/password requests, urgency/threat language, prize/lottery/
  cashback lures, job-fee scams, loan-approval lures, and
  "send money to receive money".
- Impersonation: a message naming bKash, Nagad, Rocket, Bangladesh
  Bank, Dutch-Bangla, or a major Bangladeshi telco. A brand mention
  alone scores only 15 (safe); it pushes a message over the
  threshold only together with a lure signal.
- News-quote guard: a message framed as reporting on a scam
  (reporting verb + scam word + third-person audience word) has its
  lure signals suppressed, so a news report quoting a scam does not
  flag. This is a heuristic, not a guarantee — see Known failure cases.
- URLs embedded in a message are judged by the URL rules as well
  (at most 3 embedded links, to keep scoring bounded).

### File metadata

- Double extensions (`invoice.pdf.exe`), executables disguised as
  documents/images (document/image first extension + executable final
  extension), cracked/keygen/"activator" naming.
- Origin from Windows `Zone.Identifier` (ReferrerUrl / HostUrl) fed
  into the same URL rules, plus a small zone-origin signal.
- SHA-256 blocklist hook: the list is empty in M1 by design
  (`KNOWN_BAD_SHA256` in `packages/engine/src/rules.ts`). A real list
  must come from a verified, signed source; the hook means adding one
  needs no engine change.

## Scoring and verdicts (M1)

Weighted signals are summed and capped at 100:

- **safe: score < 40**
- **suspicious: 40–69**
- **dangerous: ≥ 70**

Thresholds were chosen so a single lure phrase alone (OTP 40 is the
only single signal that reaches suspicious) or a single weak URL
trait (lookalike 35, shortener 20, executable extension 30) never
reaches "dangerous" by itself; "dangerous" requires combined,
independent signals (for example OTP + urgency + brand, or blocklist
+ brand-in-domain + executable link). Every verdict shows the top
signals with exact evidence and a plain-language reason in the UI
language. Use "suspicious" or "dangerous" with reasons; never state
certainty. The UI always says: "This is an automated estimate".

Fixtures: 154 labelled cases in `packages/engine/tests/fixtures.ts`
(Bangla, English, and Banglish text; URLs; file metadata), including
legitimate messages that must NOT flag (genuine brand notices,
news quotes, ordinary links) and edge cases (empty input, malformed
URL, very long input). All fixtures are asserted in
`packages/engine/tests/fixtures.test.ts`.

## Known failure cases

- New scam wording not in keyword packs will be missed.
- A scammer can imitate news-report framing to try to pass the
  news-quote guard; the guard requires three framing elements, but
  it is not proof of legitimacy.
- Lookalike detection can flag legitimate resellers or fan pages;
  brand-list review is required before any list is treated as
  confirmed.
- The seed blocklist is `.example` only; it demonstrates the
  mechanism and must not be presented as real threat intelligence.
- No classifier yet (M2): scoring is rules-only, so novel phrasing
  with no keyword overlap scores low.
