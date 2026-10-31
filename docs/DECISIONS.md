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
