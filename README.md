# Semper Fidelis — Career Sim

An interactive, decision-by-decision life simulator that walks a future or current Marine through every step from the recruiter's office to a 20-year retirement (or an honorable early exit). Every fork shows the real financial, family, and career consequence — gross pay, taxes, BAH/BAS, bills, savings, debt, TSP, deployments, qualifications, and the projected pension at year 20.

Built as a planning tool for one specific Marine recruit — but generalizable to anyone weighing the path.

**Live demo (after Netlify deploy):** `https://<your-site>.netlify.app/`

![scarlet · gold · black](https://img.shields.io/badge/USMC-scarlet%20%C2%B7%20gold%20%C2%B7%20black-be0f34?style=flat-square)
![pure HTML](https://img.shields.io/badge/stack-pure%20HTML%20%2B%20JS-22?style=flat-square)
![no build step](https://img.shields.io/badge/build-none-success?style=flat-square)

---

## What it is

`index.html` is a single self-contained HTML file with no build step. Open it in any browser and the simulator runs. It contains:

- **🎮 Play My Path** — chronological 48-scene story sim. Every scene = one decision point. Tree view (left), narrative + choices (center), live stats dashboard (right), full monthly budget breakdown (bottom). State auto-saves to `localStorage`.
- **📍 Overview** — pinned 20-year roadmap and life-fork scenarios
- **🔖 MOS Deep Dive** — every 03XX combat-arms MOS + cross-branch SOF tracks
- **🌊 Path to Recon** — 2026 USMC Recon pipeline (IRC → GRC → ARC → Dive → Airborne → MFF → SERE)
- **⚡ Path to Raiders** — MARSOC A&S, ITC, B-billet fallbacks
- **🏠 Life Forks** — marriage, kids, housing, VA loan, overseas
- **💰 Rank & Pay** — full 2026 enlisted pay tables E-1 through E-9
- **🎓 School While In** — TA, GI Bill, MGIB, CLEP, DSST, MCU, SNCO Degree Completion, MyCAA
- **🧭 Decision Toolkit** — 4-lens test + standing financial rules

### Theme

Black multicam aesthetic with USMC scarlet (`#be0f34`) and gold (`#bf9522`) accents. Light theme uses sand/khaki with the same scarlet/gold accent system. Toggle from the top-right.

---

## Accounts, Saved Paths, and Email Results

The app supports a layered persistence model so it works immediately with zero backend setup, with a clear upgrade path when you're ready to add cloud sync.

### Layer 1 — Works right now (local-first)

- **👤 Account button** in the top-right opens a modal that captures the player's name + email. Stored in `localStorage` alongside the game state. No password, no backend needed.
- **📁 My Paths tab** lets the player save multiple named playthroughs ("Recon Track", "Married Early", etc.), see a stats summary card for each, and load any one back into the simulator with one click.
- **📧 Email My Results** generates a full plain-text career report — current rank, financial snapshot, investment plan, age-60 projection, decisions made, paths visited — and opens a pre-filled `mailto:` link in the default email client. If the report is too long for `mailto:` (common on Outlook), it falls back to copying to clipboard.
- **⬇️ Export All as JSON / ⬆️ Import** lets the player move their saves between devices manually.

### Layer 2 — Real multi-user cloud sync (Netlify Identity + Blobs + Functions)

The cloud-sync stack is **built and committed**. The only manual step left is enabling Identity in your Netlify dashboard.

**Backend (already in this repo):**
- `netlify/functions/save-path.js` — accepts a signed-in user's JWT + a path object, stores it in Netlify Blobs keyed by `<userEmail>/<id>`
- `netlify/functions/list-paths.js` — returns every path under the user's email prefix
- `netlify/functions/delete-path.js` — deletes a specific path
- `netlify/functions/_auth.js` — shared helper that extracts the verified Identity user from `clientContext`
- `package.json` — declares `@netlify/blobs` dep so Netlify auto-installs on deploy
- `netlify.toml` — declares `functions = "netlify/functions"` and esbuild bundler

**Frontend (already wired in `index.html`):**
- `isCloudSignedIn()`, `getAuthHeaders()`, `cloudSavePath()`, `cloudListPaths()`, `cloudDeletePath()`, `syncCloudPaths()` helpers
- `savePath()` now writes to localStorage first (instant) AND POSTs to `/.netlify/functions/save-path` if signed in
- `renderPathsList()` pulls from cloud + merges into local on every render when signed in
- `deletePath()` removes from cloud too when signed in
- The "👤 Sign In" button now calls `openSignIn()` which opens the Identity magic-link modal when Identity is loaded, falling back to the local-only name/email modal otherwise
- `netlifyIdentity.on('login', …)` fires `syncCloudPaths()` to pull existing paths down on first sign-in

**One-time setup in the Netlify dashboard (~3 minutes):**

1. **Site dashboard → Integrations → Netlify Identity → Enable Identity**
2. Under **Registration**, choose:
   - *Open* (anyone with an email can sign up — fine for personal/family use), or
   - *Invite-only* (you manually invite people via email)
3. (Optional) Under **External providers**, enable Google / GitHub / Apple OAuth so users can sign in with one click
4. **Site dashboard → Integrations → Netlify Blobs → Enable** (free tier covers thousands of saves)
5. **Trigger a new deploy** so the Functions and Blobs binding go live (`git push` does this automatically)

That's it. After step 5:
- The 👤 Sign In button opens the Identity magic-link modal
- Signing in pulls any cloud-saved paths down to the current device
- New saves write to cloud automatically
- Saves follow the user across phone, laptop, tablet
- Multiple users can use the same URL — each has their own email-keyed namespace

**Free tier limits:**
- Netlify Identity: 1,000 active monthly users
- Netlify Blobs: 1 GB storage, 100k operations/month
- Netlify Functions: 125k invocations/month + 100 hr runtime

For a family-of-five planning tool this is effectively free forever.

### Layer 3 — Server-side email (future)

`mailto:` works today but caps at ~1800-char body length on some clients. To send real emails via Resend or SendGrid, add a fourth function `netlify/functions/email-report.js` that takes the user's JWT + the report body and calls the email provider. ~30 lines of code; not built yet.

---

## Run locally

```bash
# Anywhere — no install needed
open index.html
```

Or with a local dev server (useful for some browsers that block `localStorage` on `file://`):

```bash
# Python (any system)
python3 -m http.server 8000
# then open http://localhost:8000/

# Or with npx
npx serve .
```

---

## Deploy to Netlify

### Option 1 — Drag and drop (fastest)

1. Zip the repo (or just drag the folder).
2. Drop on https://app.netlify.com/drop
3. Done — a public URL is live in ~5 seconds.

### Option 2 — Git-connected (recommended)

1. Push this repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial: Semper Fidelis Career Sim"
   git remote add origin git@github.com:<you>/marine-career-path.git
   git push -u origin main
   ```
2. In Netlify → "Add new site" → "Import from Git" → pick this repo.
3. **Build command:** *(leave blank)*
4. **Publish directory:** `.`
5. Deploy. Every `git push` to `main` auto-rebuilds.

`netlify.toml` is already configured with `publish = "."`, security headers, and friendly redirects for `/play` and `/sim`.

### Option 3 — Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

---

## Project structure

```
.
├── index.html          # The full simulator (single-file, no build step)
├── README.md           # You are here
├── netlify.toml        # Netlify deploy config (publish=., security headers)
├── .gitignore
├── data/               # Source-of-truth JSON files (see data/README.md)
│   ├── mos_complete.json       ✅ v1
│   ├── career_stages.json      ✅ v1
│   ├── pay_2026.json           ✅ v1
│   ├── decision_tree.json      ✅ v1
│   └── timeline.json           ✅ v1
└── archive/            # Earlier prototype versions, kept for reference
    ├── v1-starter.html
    └── v2-reference.html
```

---

## Roadmap

### Near-term

- [ ] Wire the simulator to load `data/pay_2026.json` instead of hardcoding pay tables
- [ ] Wire `data/mos_complete.json` into the MOS Deep Dive tab
- [ ] Wire `data/career_stages.json` into the Path to Recon + Path to Raiders tabs
- [ ] Add a Print/Export PDF for a saved character (so he can show family/recruiter his plan)
- [ ] Investment growth chart (TSP + Roth IRA compounded to age 60)
- [ ] Side-by-side path comparison ("if I do A vs B")

### Medium-term

- [ ] Multi-character save slots (LCpl me, Married me, Recon me, MARSOC me, etc.)
- [ ] Army path parity (currently Marines-deep, Army-light) — RASP, SFAS, full 75th Ranger Regiment storyline
- [ ] Officer path (OCS / ROTC / Naval Academy → Recon Officer → MARSOC SOO)
- [ ] Spouse-side budget (BAH math, MyCAA, dual-income scenarios, deployment communication)
- [ ] Veteran-after-20 phase (second career, VA disability rating, location, equity)

### Long-term

- [ ] Mobile-first responsive pass (tree → bottom drawer on small screens)
- [ ] Branch-specific themes (Army OCP, Navy NWU, Air Force ABU)
- [ ] Real-time BAH lookup by zip code (DoD calculator API or scraped table)
- [ ] Class-of-2026 retirement modeling (BRS vs legacy High-3 comparison built in)

---

## Data architecture

The `/data` directory is the source-of-truth for everything the simulator displays. All files are plain JSON — no dependencies, no schemas-as-code, just structured facts with source citations.

### Files

#### `mos_complete.json`
Complete USMC enlisted MOS list organized by occupational field. Each entry: MOS code, title, ASVAB line-score requirement, enlistable-from-boot-camp flag, full duty description, civilian-bridge value.

**Source:** mosdb.com, operationmilitarykids.org (MOS Guide 2026), marines.mil

#### `career_stages.json`
Full training-pipeline data for every stage on the primary path:
- Boot Camp (13 weeks)
- School of Infantry / Infantry Rifleman Course (14 weeks)
- Recon Screening / RSAT
- Ground Reconnaissance Course — GRC (9 weeks)
- Amphibious Reconnaissance Course — ARC (9 weeks)
- Combatant Diver Course — CDC (8 weeks)
- Basic Airborne Course — BAC (3 weeks)
- Military Free Fall / HALO — MFF (3 weeks)
- SERE Level C (3 weeks)
- Scout Sniper Basic Course — SSBC (10–13 weeks)
- MARSOC A&S Phase I (3 weeks) + Phase II (3 weeks)
- Marine Raider Course — MRC (39 weeks / 9 months)
- Marine Security Guard School (8 weeks)
- Drill Instructor School (11 weeks)
- 20-year retirement calculation

Each stage includes: duration, location, rank at entry/exit, 2026 base pay, prerequisites, attrition rates where documented, housing options, TA/college notes, financial planning notes.

**Sources:** marines.mil, marsoc.marines.mil (A&S and MRC pages), mcesg.marines.mil (MSG prerequisites), mcrdpi.marines.mil (DI School), MARADMIN FY2026, operationmilitarykids.org (0317, 0321 MOS guides)

#### `pay_2026.json`
Complete 2026 military pay data: E-1 through E-9 base pay by years of service, BAS ($460.25/mo), sample BAH by station + grade + dependency status, all special pays (jump, dive, SDAP, hostile fire, FSA, COLA), total-comp examples (married Marine, various grades), BRS TSP match rules, GI Bill Chapter 33 details, Tuition Assistance ($4,500/yr max, $250/credit hr).

**Sources:** DFAS dfas.mil 2026 pay tables, vaclaimsinsider.com, military.com/benefits, DoD BAH calculator

#### `decision_tree.json`
Complete decision tree with every node, fork, and recovery path. Drives the interactive game UI.

Node types: `stage` · `decision_gate` · `recovery_node` · `terminal` · `adversity_node`

Each node: elapsed months from enlistment, rank, 2026 base pay, decision options with `next` pointers to next node IDs, requirements, attrition rates, descriptions.

Includes a `life_layer` overlay covering: marriage timing + financial impact, children (TRICARE, CDCs, SGLI), college strategy (TA vs GI Bill, CLEP), financial rules (TSP, VA loan, SRB, combat-zone tax), geopolitical risk factors.

#### `timeline.json`
Linear timeline for Gantt / visual path rendering: primary path (Infantry → Recon → Sniper → MARSOC → Retirement), alternate paths (no-Recon 03XX, MSG path, DI path), rank promotion milestones with typical months TIS and 2026 pay.

### Data notes

- All pay = **2026** rates (3.8% increase effective Jan 1, 2026)
- BAH varies significantly by duty station — always reference the official DoD BAH calculator: https://www.defensetravel.dod.mil/site/bah.cfm
- Attrition rates are public-source estimates — actual rates vary by cycle, class size, and year
- MOS requirements are current as of May 2026 — verify with an official recruiter or MCTFS
- Lateral-move rules are governed by annual MARADMIN — always check the current fiscal year MARADMIN

### Key sources

| Source | URL |
|--------|-----|
| DFAS 2026 Pay Tables | https://www.dfas.mil/MilitaryMembers/payentitlements/Pay-Tables/ |
| MARSOC A&S | https://www.marsoc.marines.mil/Units/Marine-Raider-Training-Center/Assessment-Screening/ |
| MARSOC MRC | https://www.marsoc.marines.mil/Units/Marine-Raider-Training-Center/MRC/ |
| MSG Prerequisites | https://www.mcesg.marines.mil/Become-a-MSG/Prerequisites/ |
| DI School East | https://www.mcrdpi.marines.mil/Recruit-Training/Recruit-Training-Regiment/Drill-Instructor-School/ |
| MOS Guide 2026 | https://www.operationmilitarykids.org/marine-corps-mos-list-asvab-scores/ |
| MOS Database | https://mosdb.com/marine-corps |
| Scout Sniper 0317 | https://www.operationmilitarykids.org/marine-corps-scout-sniper-mos-0317/ |
| Recon MOS 0321 | https://militaryyearbookproject.org/references/military-occupation-codes/usmc/field-03-infantry/mos-0317-scout-sniper |
| SSBC CSC | https://www.trngcmd.marines.mil/Portals/207/Docs/SOI-E/AITB/ |
| MARSOC MARADMIN FY2026 | https://www.marines.mil/News/Messages/Messages-Display/Article/4316262/ |
| Military Pay Chart 2026 | https://vaclaimsinsider.com/2026-military-pay-chart/ |
| DoD BAH Calculator | https://www.defensetravel.dod.mil/site/bah.cfm |

---

## Contributing

This is a personal planning tool, but PRs are welcome — especially:

- **Data corrections** with sources (open a PR against any `data/*.json`)
- **New scenes** in the simulator (`SCENES` object in `index.html`)
- **Branch parity** — Army, Navy, Air Force, Space Force, Coast Guard paths
- **Officer track** — commissioning paths and officer-side career model

---

## Disclaimer

This tool is for **personal planning and education** only. It does not reflect official US Marine Corps guidance and is not endorsed by the Department of Defense. Always verify policy, pay, and requirements with an official recruiter, command career planner, or the current MARADMIN. The Eagle, Globe, and Anchor and all USMC marks are trademarks of the United States Marine Corps; this tool does not use the official emblem.

Semper Fidelis.
