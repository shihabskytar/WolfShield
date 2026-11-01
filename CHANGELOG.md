# Changelog

All notable changes to WolfShield will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to
Semantic Versioning.

## [Unreleased]

### Added

- M0 scaffold: monorepo, Tauri 2 desktop app shell, engine package with
  language detection and a first test, shared i18n strings (bn, en),
  data packs, docs, and CI.
- M1 rules engine: URL/brand lookalike, shortener, IP host, port,
  subdomain, credentials, executable-extension, and blocklist signals;
  Bangla/English/Banglish keyword signals (OTP, urgency, prize, job
  fee, loan, send-to-receive, impersonation) with a news-quote guard;
  file signals (double extension, disguised executable, cracked
  naming, Zone.Identifier origin, SHA-256 blocklist hook, empty by
  design). Scoring safe < 40, suspicious 40–69, dangerous ≥ 70.
- M1 quick-check result card: verdict, score, top signals with exact
  evidence, and plain-language reasons in Bangla and English, with
  the automated-estimate disclaimer and do-not-share-OTP line.
- 154 labelled fixtures (text, URL, file) with legitimate and edge
  cases; all engine tests pass.
- No classifier, download watcher, or shell integration yet.
  Those are M2-M4; see the Roadmap in README.md.

### Deferred (not built)

- Tray, hotkey, and clipboard-manager Tauri plugins: deferred from
  M1 to a follow-up slice pending plugin verification against
  official docs (see docs/DECISIONS.md). Not marked done anywhere.
