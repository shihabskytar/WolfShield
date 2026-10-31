# Architecture

```
Tauri app (Windows)
  UI (React/TS) ──► packages/engine (rules + classifier + scoring)
  Rust backend (thin) ──► tray, hotkey, clipboard, watcher, hashing
ml/ ──► trains + exports model ──► packages/engine/assets/
data/ ──► blocklists, brand lists, keyword packs (versioned, signed in M5)
```

## Principles

- Engine is pure TypeScript: no UI, no Tauri imports, fully unit-testable.
- Rust is thin: only what the webview cannot do (tray, hotkey, file
  watching, hashing, Zone.Identifier reading).
- Offline by default: no network requests unless the user enables data
  updates. See docs/THREAT_MODEL.md.
- Every verdict must be explainable: top signals with exact evidence
  and a plain-language reason in the UI language.

## Repo layout

See README.md. `apps/desktop` is the Tauri app, `packages/engine` is
the detector, `packages/shared` holds types and i18n strings.
