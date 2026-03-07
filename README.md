# CAL Runtime

**Cormorant Agentic Language (CAL) — Runtime Execution Engine**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18905193.svg)](https://doi.org/10.5281/zenodo.18905193)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A deterministic execution engine for cascade analysis using the Cormorant Foraging methodology and 6D dimensional framework.

## What is CAL?

CAL is a domain-specific language for finding hidden costs through cascade analysis. It turns methodology into executable code — keywords ARE the framework.

```cal
-- Find high-urgency situations
FORAGE entities
WHERE sound > 7
ACROSS D1, D2, D3
DEPTH 3
SURFACE cascade_map

-- Measure the gap
DRIFT cascade_map
METHODOLOGY 85
PERFORMANCE 35

-- Decide when to act
FETCH cascade_map
THRESHOLD 1000
ON EXECUTE CHIRP critical "Take action"
```

## Features

- Methodology-native keywords (FORAGE, DRIFT, FETCH, CHIRP, PERCH, WAKE)
- 6D dimension analysis (Customer, Employee, Revenue, Regulatory, Quality, Operational)
- 3D Lens scoring (Sound x Space x Time)
- DRIFT gap measurement (Methodology - Performance)
- Fetch action decisions with multiplicative gating
- Cascade pathway mapping with depth control
- Financial impact calculation with cascade multipliers
- Pluggable data adapters (JSON, memory, composite)
- Pluggable alert adapters (console, file, webhook)
- CLI tool for script execution
- 192 passing tests across 8 test suites

## Quick Start

```javascript
import { parse, execute } from '@stratiqx/cal-runtime';

// Parse CAL script
const result = parse(`
  FORAGE entities
  WHERE sound > 7
  SURFACE results
`);

// Execute with data
const output = await execute(result.actionPlan, {
  entities: [
    { id: 1, sound: 8, space: 7, time: 9 }
  ]
});

console.log(output.results);
```

## Architecture

```
CAL Script → Parser (Peggy) → ActionPlan → Executor → Results
                                              ↓
                                    Data Adapters + Alert Adapters
```

## Documentation

- [Language Specification](https://cal.cormorantforaging.dev)
- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Ecosystem

CAL Runtime is the execution engine for the Cormorant Foraging Framework:

- [Cormorant Foraging Framework](https://cormorantforaging.dev) — Foundational methodology
- [CAL Language Specification](https://cal.cormorantforaging.dev) — Language reference
- [6D Foraging Methodology](https://6d.cormorantforaging.dev) — Dimensional analysis
- [StratIQX](https://stratiqx.com) — Case studies and analysis platform

## Citation

If you use CAL Runtime in your work, please cite:

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

**Michael Shatny**
ORCID: [0009-0006-2011-3258](https://orcid.org/0009-0006-2011-3258)

## License

MIT
