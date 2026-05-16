# Navy / Air Force / Coast Guard Special Operations Path Data
**Version: 2026 | First-person format | Repo-ready JSON**

---

## Files in This Package

| File | Size | Description |
|------|------|-------------|
| `navy_decision_tree.json` | ~20KB | Full Navy SEAL pipeline from contract to DEVGRU. Includes SWCC standalone path, all reclass options, attrition rates at every gate, sniper school, pay, life layer (marriage/college/money). |
| `airforce_decision_tree.json` | ~16KB | All 4 AFSWC paths: CCT, PJ, SR, TACP. Includes 2026 Zulu Course update, post-Zulu specialty pipelines, career progression, AFSOC assignments, reclass options. |
| `coastguard_decision_tree.json` | ~18KB | CG entry → operational tour → MSRT/TACLET/MSST/Dive Locker/AST paths. Includes new Special Missions Command (Oct 2026). Honest assessment of CG vs other branches for SOF goals. |
| `all_branch_career_stages.json` | ~7KB | School-by-school pipeline stages for: SEAL, SWCC, CCT, PJ, SR, TACP, MSRT. Duration, location, rank, pay at each stage. |
| `cross_branch_comparison.json` | ~6KB | Side-by-side Tier 1 / Tier 2 comparison, pipeline length comparison, sniper school comparison, special pays comparison 2026. |

---

## Companion Files (from Prior Packages)

| File | Source Package |
|------|---------------|
| `marine_decision_tree.json` | marine-path-data.zip |
| `army_decision_tree.json` | army-path-data.zip |

---

## Suggested App Architecture

```
decision_tree.json (all branches)
    → node.id = game state key
    → node.next / decision_gate.options[].next = transitions
    → node.life_layer = persistent overlay (marriage, college, money)

career_stages.json
    → expanded detail drawer for any active node
    → duration + location + pay displayed alongside each stage

cross_branch_comparison.json
    → branch-picker screen (let the user choose branch first)
    → side-by-side comparisons for "which branch" decisions

pay_2026 (in each decision_tree)
    → real-time pay calculator: rank × YOS = base pay + special pays

life_layer_persistent (in each decision_tree)
    → always-visible sidebar or overlay
    → tracks: college credits, savings, debt, relationship status
    → triggers advisory prompts at key life forks
```

---

## Key 2026 Data Points

### Navy
- BUD/S overall pipeline success rate: **9.5%** from signed enlistment to Trident
- Hell Week: Week 4 of Phase 1 — 5.5 days, ~4 hrs total sleep, 200+ miles movement
- SQT: 26 weeks — Trident awarded at graduation
- Total pipeline Boot → Trident: **~30 months**
- DEVGRU Green Team: 6 months, **~50% attrition**, requires 5 yrs SEAL Team + 2 deployments
- SWCC total pipeline: **~8 months**

### Air Force
- New **Zulu Course (16 weeks)** added November 2025 as Phase 2 for ALL AFSWC paths (CCT, PJ, SR, TACP)
- CCT pipeline Boot → operational: **~24 months**
- PJ pipeline Boot → operational: **~30 months** (includes 39-week MP3 paramedic program)
- SR pipeline Boot → operational: **~18 months**
- TACP pipeline Boot → JTAC certified: **~18 months**
- All AFSWC operators: dive qualified + jump qualified + SERE trained

### Coast Guard
- New **Special Missions Command (CG SMC)** commissioning **October 1, 2026**
- MSRT: ~300 operators total, East (Virginia Beach/Chesapeake) and West (San Diego)
- BTOC (Basic Tactical Operations Course): **8 weeks / 40 days** at Camp Lejeune
- Full MSRT pipeline from selection to operational: **~18 months**
- CG is NOT a first-assignment special operations path — requires 3-4 years operational experience first

---

## Sources

| Source | URL |
|--------|-----|
| Navy BUD/S pipeline attrition | https://en.wikipedia.org/wiki/BUD/S |
| NSW career paths | https://navyseals.com/nsw/career-paths-0/ |
| SQT detail | https://navyseals.com/nsw/sqt-seal-qualification-training/ |
| DEVGRU eligibility (official) | https://www.mynavyhr.navy.mil/Portals/55/Career/Detailing/Enlisted/Apply%20for%20DEVGRU.pdf |
| DEVGRU requirements | https://usmilitary.com/the-path-to-tier-one-your-guide-to-devgru-requirements/ |
| SWCC overview | https://www.sandboxx.us/news/swcc-are-the-naval-special-warfares-elite-boat-operators/ |
| AF CCT pipeline | https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/combat-control |
| AF PJ pipeline | https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/pararescue |
| AF SR pipeline | https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/special-reconnaissance |
| AF TACP pipeline | https://www.airforce.com/careers/special-warfare-and-combat-support/special-warfare/tactical-air-control-party-specialist-tacp |
| AF Zulu Course 2026 | https://taskandpurpose.com/news/air-force-special-warfare/ |
| AF Pipeline Optimization 2026 | https://www.dvidshub.net/news/550109/air-force-special-warfare-training-wing-launches-pipeline-optimization-initiative |
| AFSOC Special Tactics | https://www.afsoc.af.mil/Units/Air-Force-Special-Tactics/ |
| CG Special Missions Command | https://www.news.uscg.mil/Press-Releases/Article/4478711/ |
| CG SMC Military Times | https://www.militarytimes.com/news/your-military/2026/05/06/coast-guard-to-stand-up-special-forces-command/ |
| MSRT analysis | https://blog.roninsgrips.com/analysis-of-the-u-s-coast-guard-maritime-security-response-team-msrt/ |
| BTOC official | https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/SMTC/Training/Basic-Tactical-Operations-Course-BTOC/ |
| 2026 military pay | https://vaclaimsinsider.com/2026-military-pay-chart/ |

---

## Notes on First-Person Format
All decision_tree.json files use `"first_person": true` flag. Node descriptions use "I" and "my" throughout. Decision gate options use "I will..." framing. Life layer prompts are written as direct advisory questions ("If I were injured at 24, what would I regret not having done?"). This format is designed for an interactive guide aimed at a high school-age user planning his military and life path.
