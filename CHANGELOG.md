# Changelog

All notable changes to `@stratiqx/cal-runtime`. Versions 1.2.0 to 1.4.0 were published to npm but not as GitHub releases; they are summarised here from the git history.

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
