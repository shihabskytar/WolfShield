# Data provenance

- `brands.json`: brand names and official domains are public knowledge
  (company websites). Verify each domain before relying on it in M1.
- `keywords_*.json`: generic lure phrasing written for this project.
  No real user messages, phone numbers, or emails are included.
  M1 expanded the packs from 2 to 6 per language (otp_request,
  prize_lure, urgency_threat, job_fee, loan_lure, send_to_receive).
- Impersonation names in `packages/engine/src/rules.ts` beyond
  `brands.json` are public Bangladeshi telco brand names
  (Grameenphone, Robi, Banglalink, Teletalk), used only to detect
  messages claiming to be from them. No official domain is claimed
  for those names.
- `blocklist_seed.json`: example domains only (`.example` TLD).
  Do not treat them as confirmed malicious.
- No dataset has been downloaded, redistributed, or claimed in M0.
  Before using any public Bangla/English scam dataset in M2, check its
  license and terms, and record the decision here. Do not commit raw
  data if the license forbids redistribution; commit preparation scripts
  instead.
