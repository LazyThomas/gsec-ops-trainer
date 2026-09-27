# v0.3 validation record

Validated September 26, 2026 against the recovered v0.2 package and repository baseline `d70a06a`. The repository's five baseline files matched the uploaded package.

## Passed

- JavaScript syntax checks for the application and service worker.
- Data validation: 576 standard items, 120 lab steps, 20 missions; unique IDs and prompt text; valid four-option answers; required index/book metadata; all six sections represented; runtime assets present.
- Automated app tests using Node.js and jsdom: all modes; distinct question sampling; six-section exam balance; specific recall filters; v0.2 migration without deleting the old key; confidence-before-answer enforcement; no double scoring; mistake/confident-wrong insertion and removal; complete lab scoring; delayed exam feedback; saved exam answers, deadline and flags surviving reload; forced expiry and unanswered scoring; malformed import rejection; library search; corrupt saved-state preservation.
- Actual in-app browser: dashboard loaded, 576 count displayed, section drill loaded, correct answer accepted, explanation and book/index cues displayed, progress persisted.
- Actual offline check: after successful service-worker installation, stopped the HTTP server and reloaded the app. The dashboard, full bank count, and saved answer/XP/session remained available from the cache.

## Corrections to inherited content

- Replaced duplicate Kerberos port prompt at ID 103 with a clock-skew troubleshooting item while keeping its stable ID.
- Expanded the two-option signature question at ID 54 into four unambiguous choices.
- Made four generic lab-step prompts identify their specific mission.

## Limits

- No iPhone/iPad installation or airplane-mode test was possible on physical devices.
- Exam expiry was tested by advancing the stored deadline, not by waiting four hours.
- A headless Chrome launch was blocked by the local environment; automated logic tests used jsdom, and actual browser/offline smoke checks used the app browser.
- Content has structural validation and author review, not independent certification by a subject-matter expert. This bank is not exhaustive and does not replicate CyberLive virtual-machine labs.
- GitHub push dry-run reached GitHub but failed because no authenticated credential was available (`could not read Username ... terminal prompts disabled`). No remote files were modified and no deployment is claimed.

## Reproduce

From the extracted directory:

```sh
python3 tools/validate.py
node --check app.js
node --check service-worker.js
```

For app logic tests, provide Node.js and install `jsdom`, then run `node tests/app.test.cjs`. Runtime users do not need Node.js or jsdom.
