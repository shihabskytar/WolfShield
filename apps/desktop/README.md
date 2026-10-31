# WolfShield desktop app (M0)

Tauri 2 app shell with a React + TypeScript + Vite + Tailwind UI.

## Run (Windows, with Rust + pnpm installed)

```bash
pnpm install
pnpm --filter @wolfshield/desktop tauri dev
```

## Run the web UI only (no Tauri, works on Linux for UI checks)

```bash
pnpm --filter @wolfshield/desktop dev
```

## What is not here yet

No tray icon, global hotkey, clipboard listener, download watcher,
shell integration, or updater. Those are M1-M4 and their Tauri plugin
names must be verified against current Tauri 2 docs before adding them
(see docs/DECISIONS.md, TODO(verify) list).
