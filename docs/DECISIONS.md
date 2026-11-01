# Decisions

## M0 decisions

- **Monorepo with pnpm workspaces.** Chosen for a shared engine package
  reused by the desktop app (and later a browser extension or bot).
- **Tauri 2 + React + Vite + Tailwind.** Per the master prompt; the
  desktop shell is kept thin so most logic stays in testable TypeScript.
- **Bangla as default UI language.** The target users are in Bangladesh;
  English is one click away. Banglish is an input language, not a UI
  language in M0.
- **No plugins in M0.** Tray, hotkey, clipboard, notification,
  single-instance, autostart, and updater plugins are M1-M5 work.
- **Node + Vitest for engine tests locally.** Rust tests cannot run on
  this Linux VM (no Rust toolchain); they run in CI on windows-latest.

## M1 decisions

- **Scoring thresholds: safe < 40, suspicious 40–69, dangerous ≥ 70.**
  Justification: a single weak trait must not condemn a message or
  link, and "dangerous" should require combined, independent signals.
  The only single signal reaching suspicious is an OTP/PIN/password
  request (40); a lookalike domain (35), a shortener (20), or an
  executable link (30) alone stays safe. See docs/DETECTION.md.
- **Engine embeds keyword packs via JSON import from `data/`.**
  `data/keywords_*.json` remain the human-editable source of truth;
  the engine imports them directly (with `resolveJsonModule`), so
  there is no second copy to drift. No new dependency was added.
- **News-quote guard is a heuristic, documented as fallible.**
  It requires a reporting verb + a scam word + a third-person
  audience word, so merely adding the word "news" does not suppress
  signals. A scammer imitating reporting framing remains a known
  failure case in docs/DETECTION.md.
- **URL punycode/brand signals are parser-independent (CI fix, run #31).**
  Node 20 (CI) and Node 24 (local) disagree on whether an invalid
  punycode label such as `xn--bkash` parses via `new URL()` — CI
  treated it as malformed (15, safe) instead of punycode + brand
  (45, suspicious). `urlSignals` now extracts the raw host before
  parsing, so those two signals fire on either Node version.
- **SHA-256 blocklist is an empty hook in M1.** Shipping a real
  hash list without a verified, signed source would be worse than
  shipping none; the hook is wired and documented.
- **Tray, hotkey, and clipboard-manager Rust plugins: DEFERRED.**
  These are M1 roadmap items, but they are NOT added in this slice.
  Reason: they require Tauri 2 plugin verification against official
  docs (package names, compatibility, capability permissions), and
  they cannot be runtime-tested on this Linux VM (no Rust toolchain),
  so adding them untested would risk breaking the green CI run.
  They move to a follow-up slice with plugin verification first;
  they are not marked done anywhere (README, CHANGELOG, or code).
  The TODO(verify) items below still apply to that slice.

## TODO(verify) — must be checked against current official docs before use

- TODO(verify): exact Tauri 2 plugin package names and Tauri 2
  compatibility for global-shortcut, clipboard-manager, notification,
  single-instance, autostart, and updater.
- TODO(verify): Tauri 2 capability file format and permission names
  beyond `core:default` (the M0 `capabilities/default.json` uses only
  `core:default` and must be re-checked when a plugin is added).
- TODO(verify): `tauri.conf.json` schema keys for the NSIS bundler
  options used in M5 (the M0 config uses a minimal bundle section).
- TODO(verify): scikit-learn / ONNX versions and dataset licenses
  before any M2 training run.
- TODO(verify): Noto Sans Bengali font license and file before bundling
  it locally (not bundled in M0; no web fonts are used).

## Added dependencies (M0)

React, React DOM, Vite, Tailwind CSS, TypeScript, Vitest — all standard,
actively maintained, and compatible with Apache-2.0 distribution.
No new dependency was added without a purpose in this file.

## Added dependencies (M1)

None. The rules engine uses only the existing TypeScript/Vitest
toolchain and JSON data files already in the repo.
