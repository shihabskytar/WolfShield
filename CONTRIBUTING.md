# Contributing to WolfShield

Thank you for helping build an offline-first, Bangla-first scam checker.

## Setup (under 10 minutes, once pnpm and Rust are installed)

```bash
git clone https://github.com/shihabskytar/WolfShield
cd WolfShield
pnpm install
pnpm --filter @wolfshield/engine test
pnpm --filter @wolfshield/desktop dev
```

On Windows, install Rust via rustup and WebView2 (see apps/desktop/README.md).
On this Linux VM, `pnpm tauri build` and Rust tests cannot run locally;
they run in CI on windows-latest. See the M0 milestone report in README.md.

## How to add a signal (M1 onwards)

1. Add the rule to `packages/engine/src/`, with no UI or Tauri imports.
2. Add at least one unit test and one fixture in `packages/engine/tests/`.
3. Add the explanation strings to `packages/shared/src/i18n.ts` in both
   `bn` and `en`. No hard-coded user-facing strings.
4. Document the signal in `docs/DETECTION.md`: rationale, example, failure cases.

## How to add a keyword pack or a brand

- Edit the JSON in `data/` (one file per language), bump `dataVersion`,
  and note provenance in `data/PROVENANCE.md`.
- Never commit personal data. An automated check must reject phone numbers
  and emails in fixture files before merge (see CI).

## PR checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Typecheck passes (`pnpm typecheck`)
- [ ] No personal data in fixtures or examples
- [ ] Docs updated if you changed a public engine function or a signal
- [ ] One logical change per commit, conventional commit messages

## Good first issues

Add a brand to `data/brands.json`, add Banglish keyword variants,
add labelled fixture examples, or translate strings in `packages/shared`.
