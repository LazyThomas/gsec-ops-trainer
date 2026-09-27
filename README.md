# GSEC Ops Trainer v0.3

Independent, offline-capable study PWA for the existing `LazyThomas/gsec-ops-trainer` GitHub Pages site.

## What is included

- **576 standard questions and drills**: 320 retained baseline questions plus **256 newly authored items** (120 applied scenarios, 40 port/protocol drills, 48 command drills, 48 acronym drills).
- **20 guided lab missions, 120 steps**: the original 80 steps plus 40 new synthetic-evidence/workflow questions.
- Section drills, rapid fire with type selection, unique weighted weak-area sampling, mistake review, confident-wrong review, mixed exam, scenario challenge, and lab missions.
- A **106-question, four-hour timed exam** with flags, skips, revisiting, persisted answers, and a deadline that continues across reloads and time away. Mixed and timed exams reveal answers only after submission. Unanswered items count as wrong at submission or expiry.
- Confidence selected before submitting; shuffled answers; retained v0.2 progress; export/import; searchable library; personal index notes; metadata on every question and lab step.

This is a substantial first expansion, **not the requested eventual 900–1,500-item bank and not exhaustive coverage**. `data/expansion-plan.json` plans growth toward 1,200 standard items (200 per section). Planned slots are separate from published content and never counted or shown as real questions.

## Coverage

| Section | Standard items | Study focus |
|---|---:|---|
| SEC401.1 | 112 | Networks, packets, segmentation, cloud, wireless, AI trust boundaries |
| SEC401.2 | 91 | Foundations, IAM, passwords, frameworks, DLP, mobile security |
| SEC401.3 | 92 | Vulnerabilities, malware, web, SIEM, logs, evidence, incident response |
| SEC401.4 | 88 | Cryptography, PKI, TLS, network and endpoint controls |
| SEC401.5 | 98 | Windows permissions, policies, auditing, PowerShell, Azure |
| SEC401.6 | 95 | Linux permissions/hardening, containers, macOS |

All six sections are represented in mixed and timed exams. Nearly equal section sampling is a **training design choice**, not an official exam blueprint. Lab missions are browser-based guided multiple-choice exercises, **not live virtual machines or replicas of SANS labs/CyberLive**. The new content is independently written; no private course books or real exam items were consulted. Baseline items retain their provenance as v0.2 content.

## Sources and alignment

Public outlines checked September 26, 2026:

- [GIAC GSEC objectives and exam details](https://www.giac.org/certifications/security-essentials-gsec): currently lists 106 questions and four hours. Confirm the specifications for your own attempt in your GIAC account. Practice scores here are not a pass prediction.
- [SANS SEC401 public outline](https://www.sans.org/cyber-security-courses/security-essentials): used for section/topic alignment, including cloud/AI, containers, and macOS.
- [IANA service-name and port registry](https://www.iana.org/assignments/service-names-port-numbers): conventional port assignments. Port numbers do not prove the actual protocol, encryption, or benign intent.
- [Wireshark display filter reference](https://www.wireshark.org/docs/man-pages/wireshark-filter.html): filter syntax reference.

The bank is a study aid, not vendor-endorsed or independently subject-matter-expert certified. Check commands and configuration choices against the platform/version you actually use. New commands are study text; the app never executes them.

## Run locally

No compilation or package installation is required to use the app:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. Do not double-click `index.html`: browsers generally block data loading and service workers from `file:` URLs. GitHub Pages HTTPS supports installation and offline caching.

## Publish to the existing repository (manual fallback)

1. Export progress from the existing site before updating.
2. Extract `GSEC_Ops_Trainer_v0.3_PWA.zip` on your computer.
3. Open https://github.com/LazyThomas/gsec-ops-trainer and select the branch currently serving Pages (the previous setup used `main`).
4. Choose **Add file → Upload files**. Drag the **contents of the extracted folder** into the uploader, including the `data` folder. Do not upload the ZIP itself or put the entire app under a new enclosing folder.
5. Commit the update to that branch. Replace the existing `index.html`, `service-worker.js`, manifest, and icons; include the new `app.js`, `styles.css`, `README.md`, and data files. The `tests`, `tools`, and `docs` folders are useful maintenance files but not needed at runtime.
6. Under **Settings → Pages**, retain **Deploy from a branch → main → / (root)** if that is the current publishing configuration. If the repository uses another branch, use that branch instead.
7. Wait for the Pages deployment to finish in Actions. Open https://lazythomas.github.io/gsec-ops-trainer/ and confirm the header reads **v0.3** and the bank count is **576**.
8. An installed v0.2 PWA may initially show cached v0.2. Open it online, allow the new worker to install, close all tabs/windows for the app, and reopen. Reload if necessary. Avoid clearing site data unless you have exported progress.
9. Wait until **Ready for offline use**, then test airplane mode. Confirm a question loads, an answer is saved, and a timed exam resumes after reopening.

GitHub guidance: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Data and expansion workflow

- `data/questions.json`: published standard items. Keep numeric IDs stable and assign new unique IDs above the existing maximum.
- `data/labs.json`: missions and stable `lab-X.Y-N` step IDs.
- `data/question.schema.json`: schema for one question, including metadata.
- `data/question-template.json`: nonpublished authoring template. Replace every placeholder, then validate before appending to the bank.
- `data/expansion-plan.json`: planned counts only. Do not manufacture near-duplicate prompts to meet targets.
- `tools/validate.py`: validates the bank, metadata, ID/prompt uniqueness, section counts, and runtime file presence.

Each question contains `id`, `section`, `domain`, `kind`, `difficulty`, `q`, four `choices`, zero-based `answer`, `why`, `cue`, `indexCues`, `bookCue`, `tags`, `origin`, and `status`. Book metadata deliberately leaves `edition` and `page` null. The public-outline mapping is a topic cue, not a verified book location. Add personal edition/page notes through the app or populate verified values when maintaining the bank.

For each expansion batch: identify a real objective gap; write an original scenario and unambiguous options; explain the reasoning and limitations; check technical claims with primary platform documentation; verify topic mapping and metadata; run validation and browser tests; increment the service-worker cache version for every published runtime/data change. Do not alter existing IDs when correcting text.

## Persistence and limitations

Progress remains in this browser/origin under `gsec_ops_trainer_v03`. On first use the app copies v0.2 (or v0.1) progress, preserving the old key. A reset affects v0.3 only. Notes and active sessions are included in exports. Imports validate their shape before replacement. Storage failure is reported and permits in-memory use. Corrupt existing progress is not silently overwritten.

The exam clock is based on the device wall clock, continues away from the app, and checks on resume and foregrounding. This is not an anti-cheat timer and cannot prevent device-clock manipulation. Use one active tab per device; there is no cross-device synchronization or concurrent-tab merge. Offline use requires one complete successful online cache install. Browser storage eviction can remove progress/caches; export backups periodically.
