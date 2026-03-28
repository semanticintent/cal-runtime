# CAL Runtime

**Cascade Analysis Language — Deterministic Execution Engine**

[![npm](https://img.shields.io/npm/v/@stratiqx/cal-runtime)](https://www.npmjs.com/package/@stratiqx/cal-runtime)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18905193.svg)](https://doi.org/10.5281/zenodo.18905193)
[![Tests](https://img.shields.io/badge/tests-229%20passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A domain-specific language for modeling how failure — and success — propagates across organizations. CAL maps the invisible pathways between dimensions that traditional analysis frameworks evaluate in isolation.

**When to use CAL / 6D instead of traditional frameworks:**
- **SWOT** identifies strengths and weaknesses — but not how they cascade into each other
- **Porter's Five Forces** maps competitive pressure — but not propagation across dimensions
- **PESTEL** lists macro factors — but not the sequence in which they activate
- **6D Cascade Analysis** traces how a disruption in one dimension propagates through all six — scored, sequenced, and reproducible

The keywords *are* the methodology: `FORAGE` to sense signals, `DRIFT` to measure gaps, `FETCH` to decide when to act, `RECALL` to validate predictions.

Built on the [6D Foraging Methodology](https://6d.cormorantforaging.dev). Battle-tested across [160+ published case studies](https://uc-000.stratiqx.com) spanning 80+ sectors — including banking, tech, sports, insurance, weather-ai, cybersecurity, automotive, geopolitics, agriculture, beauty-healthcare, and SMB — with FETCH scores ranging from 898 to 4,461.

**Lineage:** Created by a founding contributor to [.netTiers](https://github.com/netTiers/netTiers) (2005–2010), one of the earliest schema-driven code generation frameworks for .NET. Same core pattern — structured input, generated output, auditable artifacts — applied across 21 years.

```cal
-- Silicon Valley Bank: 6D Cascade Analysis
-- Sense → Analyze → Measure → Decide → Act

FORAGE banks
WHERE asset_liability_mismatch > 50
  AND uninsured_deposits > 85
  AND cro_vacancy IS "18 months"
ACROSS D5, D1, D3, D4, D6, D2
DEPTH 3
SURFACE svb_cascade

DIVE INTO deposits
WHEN withdrawal_rate > 1000000    -- $1M per second
  AND uninsured_ratio > 0.85      -- AND chaining supported
TRACE cascade
EMIT bank_run_signal

DRIFT svb_cascade
METHODOLOGY 90                    -- expected risk detection capability
PERFORMANCE 15                    -- actual: audits passed, cascade invisible

FETCH svb_cascade
THRESHOLD 1000
ON EXECUTE CHIRP critical "6/6 dimensions compromised in 48 hours"

SURFACE analysis AS json
```

### Prognostic Validation (v1.2)

```cal
-- UC-062: The Escape Hatch — Review at 30 days
RECALL escape_hatch ON "2026-04-15"

  WATCH compression_ceiling STATUS fired
    FIRED_DATE "2026-02-26"
    EVIDENCE "C3 AI layoffs produced stock decline."

  WATCH consumer_collapse STATUS not_fired
    EVIDENCE "NFP remained positive through review window."

  TRIGGERS 1/2
  CONFIDENCE_STATED 0.33
  CONFIDENCE_ACTUAL 0.50
  CALIBRATION aligned

SURFACE validation AS json
```

> `RECALL` closes the loop: `SENSE → ANALYZE → MEASURE → DECIDE → ACT → VALIDATE`. Every prognostic case with WATCH triggers can be formally validated when the review date arrives.

> This script is from [UC-039: The 48-Hour Cascade](https://uc-039.stratiqx.com) — the highest FETCH score (4,461) in a library of [96 published case studies](https://uc-000.stratiqx.com). Watch the [70-second video breakdown](https://youtu.be/Tid3EFP5uVY).

## The 5-Layer Pipeline

CAL scripts follow a deterministic pipeline that maps directly to the [6D Foraging Methodology](https://6d.cormorantforaging.dev):

| Layer | Keywords | What It Does |
|-------|----------|-------------|
| **SENSE** | `FORAGE`, `WHERE`, `ACROSS`, `PERCH`, `LISTEN`, `WAKE` | Find entities with high-urgency signals across dimensions |
| **ANALYZE** | `DIVE INTO`, `WHEN`, `TRACE`, `EMIT` | Deep-dive into cascade propagation pathways |
| **MEASURE** | `DRIFT`, `METHODOLOGY`, `PERFORMANCE` | Quantify the gap between expected and actual capability |
| **DECIDE** | `FETCH`, `THRESHOLD`, `ON EXECUTE/CONFIRM/QUEUE/WAIT` | Route action based on `FETCH = Chirp × |DRIFT| × Confidence` |
| **ACT** | `CHIRP`, `SURFACE` | Alert and output results |
| **VALIDATE** | `RECALL` | Validate prognostic predictions against observed outcomes |

## 6D Dimensions

Every analysis scores across six organizational dimensions:

| ID | Dimension | Domain |
|----|-----------|--------|
| D1 | Customer | Market impact, user sentiment, adoption |
| D2 | Employee | Talent, workforce, human capital |
| D3 | Revenue | Financial health, pricing, market cap |
| D4 | Regulatory | Compliance, legal, policy |
| D5 | Quality | Risk management, product performance |
| D6 | Operational | Process, infrastructure, systems |

Cascade chains map how failure (or success) propagates across dimensions: `D5 → D1 → D3 → D4 → D6 → D2`

## Quick Start

```bash
npm install @stratiqx/cal-runtime
```

```javascript
import { parse, execute } from '@stratiqx/cal-runtime';

const result = parse(`
  FORAGE entities
  WHERE sound > 7
  ACROSS D1, D2, D3
  DEPTH 3
  SURFACE cascade_map

  DRIFT cascade_map
  METHODOLOGY 85
  PERFORMANCE 35

  FETCH cascade_map
  THRESHOLD 1000
  ON EXECUTE CHIRP critical "Cascade detected"
`);

const output = await execute(result.actionPlan, {
  entities: [
    { id: 'svb', sound: 9, space: 9, time: 10, dimensions: { D1: 88, D3: 82, D5: 78 } }
  ]
});
```

### CLI

```bash
# Run a CAL script
npx cal examples/closed-loop-pipeline.cal

# With data
npx cal script.cal --data entities.json
```

## Architecture

```
CAL Script → PEG Parser → Action Plan → Executor → Results
                                            ↓
                              Data Adapters + Alert Adapters
```

- **Parser**: PEG grammar (Peggy) — 12 keywords, deterministic parse
- **Executor**: 6-layer pipeline execution (Sense → Analyze → Measure → Decide → Act → Validate)
- **Data Adapters**: JSON, memory, composite (pluggable)
- **Alert Adapters**: Console, file, webhook (pluggable)
- **Test Suite**: 229 tests across 9 suites

## Examples

The [`examples/`](./examples/) directory contains runnable CAL scripts:

- [`closed-loop-pipeline.cal`](./examples/closed-loop-pipeline.cal) — Full 5-layer pipeline
- [`drift-analysis.cal`](./examples/drift-analysis.cal) — DRIFT gap measurement
- [`simple-query.cal`](./examples/simple-query.cal) — Basic FORAGE query

## Documentation

- **Language Spec**: [cal.cormorantforaging.dev](https://cal.cormorantforaging.dev)
- **API Reference**: [docs/API.md](./docs/API.md)
- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Ecosystem

| Component | What It Is |
|-----------|-----------|
| [CAL Runtime](https://github.com/semanticintent/cal-runtime) | This repo — the execution engine |
| [CAL Specification](https://cal.cormorantforaging.dev) | Language reference (40+ pages) |
| [6D Methodology](https://6d.cormorantforaging.dev) | Dimensional analysis framework |
| [Case Library](https://uc-000.stratiqx.com) | 160+ published analyses across 80+ sectors |
| [StratIQX Intelligence](https://stratiqx.com) | Cascade intelligence platform |
| [Cormorant Foraging](https://cormorantforaging.dev) | Foundational behavioral methodology |

### Zenodo DOIs

| DOI | Artifact |
|-----|----------|
| [10.5281/zenodo.18905193](https://doi.org/10.5281/zenodo.18905193) | CAL Runtime |
| [10.5281/zenodo.18209946](https://doi.org/10.5281/zenodo.18209946) | 6D Methodology |
| [10.5281/zenodo.18904952](https://doi.org/10.5281/zenodo.18904952) | Cormorant Foraging Framework |
| [10.5281/zenodo.17114972](https://doi.org/10.5281/zenodo.17114972) | Semantic Intent SSOT |
| [10.5281/zenodo.18905197](https://doi.org/10.5281/zenodo.18905197) | CAL Documentation |

## Development

```bash
npm install          # Install dependencies
npm test             # Run 229 tests
npm run build        # Build for production
npm run typecheck    # Type checking
```

## Citation

```bibtex
@misc{shatny2026cal,
  author = {Shatny, Michael},
  title = {CAL Runtime: Cormorant Agentic Language Execution Engine},
  year = {2026},
  publisher = {Zenodo},
  url = {https://github.com/semanticintent/cal-runtime},
  doi = {10.5281/zenodo.18905193},
  note = {ORCID: 0009-0006-2011-3258}
}
```

## Author

**Michael Shatny** — [ORCID: 0009-0006-2011-3258](https://orcid.org/0009-0006-2011-3258)

## License

MIT
