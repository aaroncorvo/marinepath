# Army Career Path Data
## Version 1.0 — May 2026

Structured JSON data for an Army 11X / 18X career planning application.
Covers both primary entry contracts, full SOF pipelines (Ranger, Green Beret, Delta),
alternate paths, life/financial layer, and 20-year retirement modeling.

---

## Files

### `decision_tree.json` (~40 KB)
Core game-engine data. Every node in the 11X/18X career graph with:
- `id` — node key
- `type` — stage, decision_gate, recovery_node, terminal, adversity_node
- `elapsed_months_start/end` from Day 0 enlistment
- `rank_typical` and 2026 base pay
- `decisions[]` with options and `next` pointers
- Root `life_layer` covering marriage, college, financial rules
- Root `18X_vs_11X_frank_comparison` — honest risk/reward breakdown of both contracts

**Critical node:** `18X_FAIL_SFAS` — documents the involuntary reclass risk (92G food,
88M truck, 42A HR, 92R rigger) that is the core danger of the 18X contract.

### `career_stages.json` (~11 KB)
School-by-school detail for every stage:
- OSUT (22 weeks, Fort Moore)
- Airborne School (3 weeks)
- SFPC — Special Forces Preparation Course (6 weeks, 18X only)
- SFAS (extended to 35 days in 2026, Fort Liberty)
- SFQC full pipeline with all 5 MOS tracks including 18D (50 weeks)
- RASP 1 (8 weeks)
- Ranger School (61 days, 3 phases)
- Army Sniper School (29 days / 5 weeks)
- Delta Force Selection + OTC (3-4 wks + 6 months)

### `timeline.json` (~7 KB)
Three parallel paths as `{stage, months_start, months_end, rank, pay}` arrays:
- Primary: 18X path to Green Beret
- Primary: 11X + Option 40 → Ranger Bn → SF/Delta
- Alternate: 11X infantry-only to 20-year retirement
Plus rank promotion milestones with typical TIS and 2026 pay.

### `pay_2026.json` (~4 KB)
- E-1 through E-9 base pay by years of service (2026, 3.8% increase)
- BAH examples by duty station (Fort Moore, Fort Liberty, Fort Campbell, JBLM)
- All special pays: jump ($150), HALO ($225), hostile fire ($225), FSA ($250), SF SDAP, language
- Total compensation examples (married soldier, various grades, deployed)
- Army TA details: $4,500/yr, 18 semester hrs, ArmyIgnitED portal
- BRS retirement formula, TSP match rules, GI Bill strategy
- 7 financial rules for wealth-building on enlisted pay

### `mos_complete.json` (~4 KB)
- All 11-series infantry MOS codes
- All 18-series Special Forces MOS codes
- Option 40 and Ranger Regiment explained
- Key lateral move targets: 68W, 35F, 89D, 25B, 160th SOAR, PSYOP, Civil Affairs

---

## Critical Difference: 11X vs 18X

| Factor | 11X + Option 40 | 18X |
|--------|-----------------|-----|
| Floor if SOF fails | 11B infantry (combat arms, respected) | Needs-of-Army (could be cook, driver, HR) |
| Path to Green Beret | 2-4 years longer | Fastest civilian route |
| Ranger path | Option 40 → RASP → 75th Bn | Must complete SF pipeline first |
| Involuntary reclass risk | None | REAL and common |
| Recommendation | Best overall foundation for SOF career | Only if SF is the sole goal and the risk is accepted |

---

## Key Sources

| Source | URL |
|--------|-----|
| goarmy.com 11X | https://www.goarmy.com/careers-and-jobs/ground-forces/firearms-ammunition/11x-infantryman-jobs |
| goarmy.com 18X | https://www.goarmy.com/careers-and-jobs/ground-forces/firearms-ammunition/18x-special-forces-candidate |
| SFAS 2026 changes | https://www.reddit.com/r/greenberets/comments/1mw0a9e/clarification_on_sfas_changes_for_2026/ |
| RASP Wikipedia | https://en.wikipedia.org/wiki/Ranger_Assessment_and_Selection_Program |
| 18X fail reclass | https://shadowspear.com/threads/reclassing-18x-non-selects.26013/ |
| Option 40 vs 18X | https://tfvoodoo.com/articles/18x-vs-option-40 |
| SFQC phases | https://www.baseops.net/militarybooks/specialforces-qualification.html |
| Army Sniper prerequisites | https://www.benning.army.mil/armor/316thcav/Sniper/prerequisites.html |
| Delta Force selection | https://www.americanspecialops.com/delta-force/selection/ |
| Army TA 2026 | https://www.military.com/education/money-for-school/army-tuition-assistance.html |
| DFAS 2026 pay tables | https://www.dfas.mil/MilitaryMembers/payentitlements/Pay-Tables/ |

---

## Suggested App Architecture

```
decision_tree.json  → game state graph (node id = state key, next = transition)
timeline.json       → visual Gantt / path map (3 parallel tracks)
career_stages.json  → detail drawer for any active node
pay_2026.json       → real-time pay calculator on each stage
mos_complete.json   → MOS research module + lat-move tool
life_layer          → persistent state overlays (marriage, kids, college, finance)
18X_vs_11X_frank_comparison → opening branch choice screen
```

All plain JSON. Zero dependencies.
