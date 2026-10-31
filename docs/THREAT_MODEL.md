# Threat Model

## What WolfShield reads (M0 shell; M1-M4 expand this only with consent)

- M0: text the user pastes into the quick-check box, and (in the Tauri
  shell) nothing else. No clipboard, file, SMS, email, or messaging-app
  data is read in M0.
- M1+: clipboard only when the user triggers the hotkey or enables
  monitoring (off by default). Downloads only when monitoring is enabled
  (off by default). History only when enabled (off by default).

## What WolfShield never does

- Never uploads messages, clipboard contents, or file contents.
- Never reads SMS, email, WhatsApp, Telegram, or any other app's data.
- Never executes or opens a file being checked.
- No telemetry by default, no accounts, no ads, no tracking.

## Network calls

- None in M0, and none by default in the MVP. The only future network
  calls are user-enabled data-pack updates and (later, opt-in) reports,
  each documented here before shipping.

## Threats and mitigations

- **Malicious input (ReDoS, parser crashes):** cap input length
  (`MAX_INPUT_LENGTH`), use safe regexes, time-box checks, never execute
  input. M1 rules must be reviewed for catastrophic backtracking.
- **Poisoned data packs:** data packs are versioned; signed packs and
  signature verification are M5. Until then, treat bundled data as
  trusted only because it ships in the signed release.
- **Spoofed updates:** signed update manifests are M5; no updater runs
  in M0.
- **False positives / false negatives:** never overclaim. The UI says
  "automated estimate", shows reasons, and M1 maintains a benign corpus
  with a zero-dangerous-verdict guard.
- **Privacy leaks in logs:** logs contain event types and error codes
  only — never clipboard text, message text, file contents, phone
  numbers, OTPs, or account numbers.

## Residual risks

- A heuristic checker cannot catch every scam, and a new scam pattern
  may score as safe. Users are told to verify through official apps.
- A signed data pack could still contain a wrong brand entry; brand
  changes are reviewed in pull requests with provenance.
