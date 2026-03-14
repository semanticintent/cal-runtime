# CAL Runtime

**Cascade Analysis Language — Deterministic Execution Engine**

[![npm](https://img.shields.io/npm/v/@stratiqx/cal-runtime)](https://www.npmjs.com/package/@stratiqx/cal-runtime)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18905193.svg)](https://doi.org/10.5281/zenodo.18905193)
[![Tests](https://img.shields.io/badge/tests-192%20passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A domain-specific language for modeling how failure — and success — propagates across organizations. CAL maps the invisible pathways between dimensions that traditional risk tools evaluate in isolation. The keywords *are* the methodology: `FORAGE` to sense signals, `DRIFT` to measure gaps, `FETCH` to decide when to act.

Built on the [6D Foraging Methodology](https://6d.cormorantforaging.dev). Battle-tested across [49 published case studies](https://uc-000.stratiqx.com) spanning banking, tech, sports, fashion, healthcare, energy, and entertainment — with FETCH scores ranging from 1,040 to 4,461.

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

> This script is from [UC-039: The 48-Hour Cascade](https://uc-039.stratiqx.com) — the highest FETCH score (4,461) in a library of [49 published case studies](https://uc-000.stratiqx.com). Watch the [70-second video breakdown](https://youtu.be/Tid3EFP5uVY).

## The 5-Layer Pipeline

CAL scripts follow a deterministic pipeline that maps directly to the [6D Foraging Methodology](https://6d.cormorantforaging.dev):

| Layer | Keywords | What It Does |
|-------|----------|-------------|
| **SENSE** | `FORAGE`, `WHERE`, `ACROSS`, `PERCH`, `LISTEN`, `WAKE` | Find entities with high-urgency signals across dimensions |
| **ANALYZE** | `DIVE INTO`, `WHEN`, `TRACE`, `EMIT` | Deep-dive into cascade propagation pathways |
| **MEASURE** | `DRIFT`, `METHODOLOGY`, `PERFORMANCE` | Quantify the gap between expected and actual capability |
| **DECIDE** | `FETCH`, `THRESHOLD`, `ON EXECUTE/CONFIRM/QUEUE/WAIT` | Route action based on `FETCH = Chirp × |DRIFT| × Confidence` |
| **ACT** | `CHIRP`, `SURFACE` | Alert and output results |

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

- **Parser**: PEG grammar (Peggy) — 10 keywords, deterministic parse
- **Executor**: Layer-by-layer pipeline execution
- **Data Adapters**: JSON, memory, composite (pluggable)
- **Alert Adapters**: Console, file, webhook (pluggable)
- **Test Suite**: 192 tests across 8 suites

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
| [Case Library](https://uc-000.stratiqx.com) | 49 published analyses with FETCH scores |
| [StratIQX Intelligence](https://intelligence.stratiqx.com) | Consulting and analysis services |
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
npm test             # Run 192 tests
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
