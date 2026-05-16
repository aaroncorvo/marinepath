# `/data` — Source-of-Truth JSON for the Career Sim

This directory holds the structured data files that drive the interactive simulator in `/index.html`. Each file is plain JSON — no build step required.

## Structure

```
data/
├── README.md             ← you are here
├── *.json                ← Marines (default branch; loaded by the sim today)
└── army/                 ← Army research data (parallel structure)
    ├── README.md
    ├── pay_2026.json
    ├── mos_complete.json
    ├── career_stages.json
    ├── timeline.json
    └── decision_tree.json
```

The Marines files at the root of `/data/` are the live data the simulator currently consumes. The `army/` subfolder holds parallel research files for when the simulator adds Army-track parity. To wire Army support, swap the fetch path based on `G.branch`:

```js
const branch = G.branch === 'army' ? 'army/' : '';
fetch(`data/${branch}pay_2026.json`)
```

## Marines files (target structure)

| File | Purpose | Status |
|------|---------|--------|
| `mos_complete.json` | Every USMC enlisted MOS — code, title, ASVAB line score, enlistable flag, civilian-bridge notes | ✅ v1 landed |
| `career_stages.json` | Every training pipeline stage (Boot, IRC, GRC, ARC, Dive, Airborne, MFF, SERE, SSBC, A&S I/II, MRC, MSG, DI School) — duration, location, prerequisites, attrition | ✅ v1 landed |
| `pay_2026.json` | E-1 through E-9 base pay by years of service, BAS, sample BAH, all special pays (jump, dive, SDAP, hostile fire, FSA, COLA), BRS TSP match rules, GI Bill, TA | ✅ v1 landed |
| `decision_tree.json` | Every node + fork + recovery path for the simulator. Game graph. | ✅ v1 landed |
| `timeline.json` | Linear Gantt-style data for the visual tree | ✅ v1 landed |

The full spec — fields, sources, and intended use — is in the project [README](../README.md#data-architecture).

## Editing rules

- All pay = **2026** rates (3.8% raise effective Jan 1, 2026).
- BAH always cite duty station + dependency status, since it varies hugely.
- MOS requirements current as of the most recent MARADMIN; note the MARADMIN number in a `source` field on each entry.
- Attrition rates are public estimates — cite the source and the year.
- Every entry must include a `source` field with the URL or document name.

## Loading into the app

Once a JSON file lands here, wire it into `index.html` by adding a fetch in the init block:

```js
const PAY_DATA = await fetch('/data/pay_2026.json').then(r => r.json());
```

…then replace the hardcoded `PAY` constant in the script. Same pattern for the other files.
