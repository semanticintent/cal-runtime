# CAL Runtime - Project Status

**Created:** January 14, 2026
**Project:** @stratiqx/cal-runtime
**Phase:** 1 - Validation & Stabilization

---

## Overview

This project validates and productizes the Cormorant Agentic Language (CAL) runtime engine. The language and core implementation were built during a Claude Web session on January 9, 2026. This phase focuses on local validation, testing, and preparation for browser deployment.

---

## Current Status: SETUP COMPLETE ✅

### ✅ Completed
- [x] Project structure created (`c:/workplace/cal-runtime`)
- [x] Package.json configured with TypeScript + Vitest
- [x] Directory structure established
- [x] Grammar file copied (`src/parser/grammar.pegjs`)
- [x] Test fixtures copied (tailwind-cascade.cal, sample-data.json)
- [x] Analysis document created in cal/docs

### 🔄 In Progress
- [ ] Install dependencies
- [ ] Compile PEG grammar
- [ ] Create TypeScript parser wrapper
- [ ] Port executor to TypeScript
- [ ] Write initial tests

### ⏳ Pending
- [ ] Financial calculator implementation
- [ ] Browser build configuration
- [ ] Documentation generation
- [ ] Publishing setup

---

## What We Have

### From Original Implementation (cal/docs/)

| File | Purpose | Status |
|------|---------|--------|
| `cormorant.pegjs` | PEG grammar (~390 lines) | ✅ Copied |
| `cal.js` | Parser wrapper (~280 lines) | Need to port to TS |
| `executor.js` | Execution engine (~14KB) | Need to port to TS |
| `analysis-engine.js` | 6D scoring (~11KB) | Need to port to TS |
| `data-adapters.js` | Data sources (~8KB) | Need to port to TS |
| `alert-adapters.js` | Notifications (~6KB) | Need to port to TS |
| `agent.js` | AI integration (~18KB) | Defer to Phase 4 |
| `run.js` | CLI runner (~10KB) | Will rewrite |
| `repl.js` | Interactive mode (~5KB) | Will rewrite |

### Test Data

| File | Purpose |
|------|---------|
| `sample-data.json` | 4 test entities (Tailwind, StackOverflow, Copilot, Stable) |
| `tailwind-cascade.cal` | Example CAL script (UC-002 case study) |
| `closed-loop-pipeline.cal` | Full DRIFT + FETCH example |

---

## Grammar Analysis

### ✅ Currently Supported Keywords

- `FORAGE` - Query/search with WHERE, ACROSS, DEPTH, SURFACE
- `DIVE` - Deep analysis with INTO, WHEN, TRACE, EMIT
- `PERCH` - Observe position with ON
- `LISTEN` - Monitor signals with FOR
- `WAKE` - Time triggers with AFTER
- `CHIRP` - Alerts
- `TRACE` - Cascade pathways with FROM
- `SURFACE` - Output with AS

### ❌ Missing from Grammar (Need to Add)

- `DRIFT` - Gap measurement (METHODOLOGY, PERFORMANCE, GAP)
- `FETCH` - Action decisions (THRESHOLD, ON EXECUTE/CONFIRM/QUEUE/WAIT)

**Note:** DRIFT and FETCH are mentioned in all specs but not in current grammar. Need to add these before testing.

---

## Test Coverage Goals

### Phase 1 Target: 80%+ Coverage

#### Parser Tests (20+ cases)
- [ ] Basic FORAGE parsing
- [ ] FORAGE with WHERE conditions
- [ ] FORAGE with dimensions (ACROSS)
- [ ] FORAGE with depth
- [ ] Complete FORAGE statement
- [ ] DIVE parsing
- [ ] PERCH/LISTEN/WAKE combinations
- [ ] CHIRP alerts
- [ ] Comment handling
- [ ] Case insensitivity
- [ ] Error cases (invalid syntax)

#### Executor Tests (15+ cases)
- [ ] FORAGE execution with WHERE filtering
- [ ] 6D dimension scoring (Sound × Space × Time)
- [ ] Cascade depth traversal
- [ ] DRIFT calculation
- [ ] FETCH decision thresholds
- [ ] Financial impact calculation
- [ ] Empty result handling
- [ ] Invalid dimension handling

#### Integration Tests
- [ ] Tailwind cascade example (UC-002)
- [ ] Full pipeline (SENSE → ANALYZE → MEASURE → DECIDE → ACT)
- [ ] End-to-end with sample-data.json

---

## Critical Unknowns

### 1. Financial Model Formula

**Question:** How is cascade multiplier calculated?

**Current Understanding:**
```
Multiplier based on (dimensions × depth):
- 15+: 10-15×
- 10-14: 6-10×
- 6-9: 4-6×
- 3-5: 2-4×
- <3: 1.5-2×
```

**Action:** Document exact formula from analysis-engine.js

### 2. DRIFT/FETCH Grammar

**Question:** Are DRIFT and FETCH implemented in grammar?

**Current Status:** NOT in grammar.pegjs
**Action:** Add to grammar before testing

### 3. Dimension Score Aggregation

**Question:** How are multiple dimension scores combined?

**Options:**
- Average all dimension scores?
- Max score?
- Weighted by dimension type?

**Action:** Check analysis-engine.js implementation

---

## Next Immediate Steps

### Step 1: Install Dependencies ⏭️

```bash
cd c:/workplace/cal-runtime
npm install
```

### Step 2: Add DRIFT/FETCH to Grammar

Update `src/parser/grammar.pegjs`:
```pegjs
DriftStatement
  = DRIFT _ target:Identifier _ METHODOLOGY _ m:Integer _ PERFORMANCE _ p:Integer _ gap:GapClause? _ {
      return { type: "Drift", target, methodology: m, performance: p, gap };
    }

FetchStatement
  = FETCH _ target:Identifier _ THRESHOLD _ t:Integer _ actions:FetchActions* _ {
      return { type: "Fetch", target, threshold: t, actions };
    }

// ... add supporting rules
```

### Step 3: Compile Grammar

```bash
npm run build:grammar
```

### Step 4: Create Parser Wrapper

Create `src/parser/index.ts` with TypeScript types and error handling.

### Step 5: First Test

```typescript
// tests/parser/basic.test.ts
import { parse } from '../src/parser';

test('parse basic FORAGE', () => {
  const result = parse('FORAGE entities');
  expect(result.success).toBe(true);
});
```

### Step 6: Run Tests

```bash
npm test
```

---

## Success Criteria

### Phase 1 Complete When:

- [ ] All dependencies installed
- [ ] Grammar compiles without errors
- [ ] Parser test suite passes (20+ tests)
- [ ] Executor test suite passes (15+ tests)
- [ ] Tailwind example runs locally
- [ ] Output matches expected UC-002 results
- [ ] Documentation updated with findings

---

## Files to Create

### Source Files
- [ ] `src/parser/index.ts` - Parser wrapper
- [ ] `src/parser/ast.ts` - AST type definitions
- [ ] `src/executor/index.ts` - Main executor
- [ ] `src/executor/handlers/forage.ts` - FORAGE handler
- [ ] `src/executor/handlers/drift.ts` - DRIFT handler
- [ ] `src/executor/handlers/fetch.ts` - FETCH handler
- [ ] `src/analyzer/dimension-scorer.ts` - 6D scoring
- [ ] `src/analyzer/cascade-mapper.ts` - Cascade pathways
- [ ] `src/analyzer/financial-calculator.ts` - Impact calculation
- [ ] `src/types/index.ts` - Shared types

### Test Files
- [ ] `tests/parser/forage.test.ts`
- [ ] `tests/parser/drift.test.ts`
- [ ] `tests/parser/fetch.test.ts`
- [ ] `tests/executor/forage-execution.test.ts`
- [ ] `tests/executor/drift-execution.test.ts`
- [ ] `tests/analyzer/scoring.test.ts`
- [ ] `tests/integration/tailwind-case.test.ts`

### Documentation
- [ ] `docs/API.md`
- [ ] `docs/TESTING.md`
- [ ] `docs/ARCHITECTURE.md`

---

## Decisions Made

1. **TypeScript over JavaScript** - Type safety is critical for execution engine
2. **Vitest over Jest** - Faster, modern, better ESM support
3. **Monorepo structure** - Keep browser/node builds in same package
4. **Defer AI integration** - Focus on core runtime first (Phase 4)

---

## Dependencies

```json
{
  "dependencies": {
    "peggy": "^4.0.2"  // PEG parser generator
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.2.0",
    "@vitest/coverage-v8": "^1.2.0",
    "@types/node": "^20.11.0"
  }
}
```

---

## Resources

- Original implementation: `c:/workplace/cal/docs/`
- Analysis document: `c:/workplace/cal/docs/CAL-IMPLEMENTATION-ANALYSIS.md`
- Complete reference: `c:/workplace/cal/docs/CAL-COMPLETE-REFERENCE.md`
- Specs folder: `c:/workplace/cal/docs/`

---

*Last Updated: January 14, 2026*
*Next Update: After dependencies installed and grammar updated*
