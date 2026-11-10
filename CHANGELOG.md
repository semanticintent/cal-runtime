# Changelog

All notable changes to `@stratiqx/cal-runtime`. Versions 1.2.0 to 1.4.0 were published to npm but not as GitHub releases; they are summarised here from the git history.

## 1.7.0 — 2026-11-10

New, optional. Matches CAL specification v1.3.0 (Benchmarks). No change to FETCH, DRIFT or any existing result.

- **Benchmarks** replace the retired cascade multiplier with cited ratios that the runtime computes; a case supplies inputs only.
  - `sectorReach(code, year?)`: the U.S. Bureau of Economic Analysis output multiplier for an industry (Industry-by-Industry Total Requirements, row *Total industry output requirement*), 1997–2023, 15 sectors and 71 summary industries. Uses the latest BEA year at or before the case year.
  - `eventRatio(id, directCost?)`: a published hidden-cost ratio for one kind of event, from registry 1.0.0 (OSHA *$afety Pays*; Armour, Mayer & Polo 2017; Karpoff, Lee & Martin 2008; Jarrell & Peltzman 1985; Hallegatte 2008; IBM/Ponemon 2025; Boushey & Glynn 2012). Every entry checked at its primary source on 2026-11-10. Tiered entries need the case's direct cost.
  - `measuredMultiplier(first, final)`: final cost ÷ first reported cost.
  - `BenchmarkError` for an unknown code or entry, a missing direct cost, or a size outside every tier.
  - `BENCHMARK_RULES`, `EXCLUDED_FOLKLORE` (Heinrich 4:1, Bird's iceberg, SHRM 6–9 months, the 5–25× customer rule, 1:10:100, Gartner $5,600/min), `BENCHMARKS_VERSION`.
- Data lives in `data/benchmarks/`; `node scripts/build-benchmarks.mjs` regenerates `src/benchmarks/data.ts`.
- Tests: 276 (11 new for benchmarks).

## 1.6.1 — 2026-11-09

Bug fixes. Matches CAL specification v1.2.2.

- **`OR` now works in `WHERE` and `WHEN`.** The parser dropped the logical operator and the data adapter required every condition, so `WHERE a OR b` behaved like `WHERE a AND b` (for example, `type = "x" OR type = "y"` returned nothing). Conditions now record how they join (`logic: "AND" | "OR"`), and `AND` binds tighter than `OR`: `a AND b OR c` means `(a AND b) OR c`. Conditions without a `logic` field are still joined with `AND`, so existing plans behave as before.
- **`DIVE … WHEN` no longer throws.** The executor wrapped the condition list in another array, so any `DIVE` with `WHEN` failed with "Cannot read properties of undefined (reading 'split')".
- New exports from the data adapter module: `matchesConditions` and `toFilterConditions`.
- Published StratIQX cases are unaffected: none use `OR` in `FORAGE` or `DIVE`; four use it in `WATCH` triggers (UC-096, UC-106, UC-112, UC-137), which are stored, not evaluated, and now record the `OR` their authors wrote.
- Tests: 265 (9 new for conditions).

## 1.6.0 — 2026-11-09

No change in behaviour.

- **Deprecated the cascade probabilities:** `cascadeProbability()`'s `probability`, the `probability` field on dimension analyses and on `CascadeLink` (the assumed 20% decay per level). The percentages were fixed assumptions described as empirical; the 6D methodology (v2) reports counted cascade patterns from the published case library instead. The severity level labels of the 3D Lens score remain. Removal in 2.0.0.
- `FetchLevel` documentation now states the threshold-relative bands (the 1.5.0 behaviour).

## 1.5.0 — 2026-11-09

Matches CAL specification v1.2.0.

- **FETCH levels are fractions of the threshold T** (`THRESHOLD`, default 1,000): EXECUTE at T or more (high priority at 2T or more), CONFIRM at 0.75T or more, QUEUE at 0.5T or more, WAIT below. Earlier versions used fixed bands of 2,000 / 1,000 / 750 / 500 and ignored the threshold. At T = 1,000 the results are identical; all 305 published StratIQX cases with FETCH inputs keep the same level.
- **New `highPriority` field** on `FetchResult` (true when the score is at least 2T).
- **A threshold of 0 or less is rejected** with a `SemanticContractViolation`.
- **Documented the inputs:** Chirp is the average of the scored D1–D6 dimensions; Confidence is the analyst's 0–1 rating of evidence quality.
- **Deprecated `estimateMultiplier` and `calculateFinancialImpact`.** The multiplier ranges are a heuristic with no published evidence, and the 6D methodology no longer uses a cascade multiplier. Both still work and will be removed in 2.0.0.
- Tests: 256 (5 new for the threshold bands).

## 1.4.0 — 2026-08-09

- `calculateDrift` and `calculateFetch` exported from the package root; documented, Quick Start fixed.

## 1.3.0 — 2026-04-01

- `WATCH ... FOR <duration>` temporal clause.

## 1.2.1 — 2026-03-24

- FETCH aligned with the case-writing practice: Chirp from the D1–D6 scores, fixed bands, Confidence normalised to 0–1.

## 1.2.0 — 2026-03-21 to 2026-03-27

- `WHEN` clauses can be chained with `AND` (#3).
- `RECALL` keyword for prognostic validation.

## 1.1.0 — 2026-03-16

- `WATCH` keyword and `SURFACE ... ON <date>`.

## 1.0.0 — 2026-03-07

- First release.
