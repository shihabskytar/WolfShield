# @wolfshield/engine

Standalone, pure-function detection engine for WolfShield.

- Zero UI imports, zero Tauri imports.
- Deterministic for the same input and data version.
- Reusable later by a browser extension or bot.

## M0 status

Only language detection is real. `checkText`, `checkUrl`, and
`checkFileMeta` return neutral results and are marked `// STUB:` in code.
The full rules engine is Milestone M1. Do not ship M0 verdicts as
detection results.

## Run tests

```bash
pnpm --filter @wolfshield/engine test
```
