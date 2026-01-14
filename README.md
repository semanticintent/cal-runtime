# 🪶 CAL Runtime

**Cormorant Agentic Language (CAL) - Runtime Execution Engine**

A deterministic execution engine for cascade analysis using the 6D Foraging Methodology.

## What is CAL?

CAL is a domain-specific language for finding hidden costs through cascade analysis. It turns methodology into executable code.

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

## Installation

```bash
npm install @stratiqx/cal-runtime
```

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

## Project Status

**Phase 1: Validation & Stabilization** (Current)

- [ ] Parser validation
- [ ] Executor validation
- [ ] End-to-end testing
- [ ] Financial model documentation

See [CAL-IMPLEMENTATION-ANALYSIS.md](../cal/docs/CAL-IMPLEMENTATION-ANALYSIS.md) for full roadmap.

## Features

- ✅ Methodology-native keywords (FORAGE, DRIFT, FETCH)
- ✅ 6D dimension analysis
- ✅ 3D Lens scoring (Sound × Space × Time)
- ✅ DRIFT gap measurement
- ✅ Fetch action decisions
- ✅ Cascade pathway mapping
- ✅ Financial impact calculation

## Documentation

- [Language Reference](https://cal.cormorantforaging.dev)
- [API Documentation](./docs/API.md)
- [Testing Guide](./docs/TESTING.md)
- [Architecture](./docs/ARCHITECTURE.md)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT © Michael Shatny

## Links

- [6D Methodology](https://6d.cormorantforaging.dev)
- [Cormorant Foraging](https://cormorantforaging.dev)
- [StratIQX](https://stratiqx.com)
