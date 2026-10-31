# Detection

## M0 status

No detection rules are implemented yet. The engine returns neutral
results (see `packages/engine/src/index.ts`, marked `// STUB:`).
This document lists the signals planned for M1 so contributors can
review the design before code lands.

## Planned signals (M1)

### URL and domain

- Lookalike domains of the brand list in `data/brands.json`: edit
  distance, homoglyph / Unicode confusables, punycode (`xn--`), brand
  name inside a subdomain or path of an unrelated domain.
- URL shorteners, raw IP addresses, unusual ports, excessive subdomains,
  suspicious TLD patterns, credentials in URL (`user@host`).
- Links ending in `.apk`, `.exe`, `.msi`, `.scr`, `.bat`, `.js`, and
  archive-then-executable patterns.
- Local blocklist match (versioned data file).

### Text (Bangla, English, Banglish)

- Requests for OTP, PIN, password, card or account numbers, or
  "verify/unlock your account".
- Urgency/threat language, prize/lottery/cashback/bonus lures, job-fee
  scams, loan-approval lures, "send money to receive money".
- Impersonation of mobile-money, bank, telco, or government senders.
- Phone numbers and short links embedded in lure patterns.

### File metadata (M1/M3)

- Double extensions (`invoice.pdf.exe`), executables disguised as
  documents/images, cracked/keygen/"activator" naming.
- Origin from Windows `Zone.Identifier` (ReferrerUrl / HostUrl) fed
  into URL checking.
- SHA-256 match against a local known-bad hash list.

## Scoring and verdicts (M1)

Rules and the optional classifier combine into a 0-100 score with
configurable thresholds. Every verdict shows top signals with exact
evidence and a plain-language reason. Use "suspicious" or "dangerous"
with reasons; never state certainty. The UI includes "This is an
automated estimate".

## Known failure cases (to be updated in M1)

- New scam wording not in keyword packs will be missed.
- Legitimate messages that quote a scam (e.g. a news report) may
  trigger lure keywords; context rules are needed.
- Lookalike detection can flag legitimate resellers or fan pages;
  brand-list review is required.
