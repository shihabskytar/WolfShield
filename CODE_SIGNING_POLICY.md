# Code Signing Policy

WolfShield releases are intended to be signed and verifiable.

## Current status (M0)

No signing keys, certificates, or signed artifacts exist yet. This policy
is a statement of intent for M5, not a claim that signing is in place.

## Intended policy (M5)

- Releases are built in CI from tagged commits only.
- The installer and update manifest are signed with a key held only in CI
  secrets, never committed to the repository.
- Checksums and an SBOM are published alongside every release.
- The project intends to apply to the SignPath Foundation open-source
  program once the repository is public, OSI-licensed (Apache-2.0), and
  has a clear maintainer list and privacy statement. That application has
  not been made yet.
- If a key is compromised, releases signed with it are revoked and the
  incident is disclosed in SECURITY.md and the CHANGELOG.

## What contributors must never do

- Never commit a private key, certificate, or signing secret.
- Never sign a build outside CI for distribution.
