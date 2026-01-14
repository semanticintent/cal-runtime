# 🔧 CAL Runtime Implementation Refactoring Plan

**Date:** January 14, 2026
**Objective:** Port and refactor CAL from JavaScript to TypeScript with semantic anchoring governance
**Status:** Pre-Implementation Planning

---

## 🎯 **Strategic Objectives**

### **Primary Goals**
1. **Preserve Semantic Integrity** - All methodology meaning maintained
2. **Add Type Safety** - Compile-time correctness guarantees
3. **Improve Maintainability** - Clean, modular, documented code
4. **Enable Extensibility** - Plugin-friendly architecture
5. **Production Ready** - Comprehensive tests, error handling, documentation

### **Non-Goals (Explicitly Out of Scope)**
- ❌ Performance optimizations that compromise semantics
- ❌ Feature additions beyond existing functionality
- ❌ API breaking changes without explicit approval
- ❌ "Clever" abstractions that obscure semantic meaning

---

## 📊 **Current State Assessment**

### **Working JavaScript Implementation**
```
c:/workplace/cal/docs/
├── cal.js (282 lines)              ✅ Parser working
├── lib/executor.js (525 lines)     ✅ All handlers functional
├── lib/analysis-engine.js (~300)   ✅ Formulas validated
├── lib/data-adapters.js (~200)     ✅ Adapters working
├── lib/alert-adapters.js (~150)    ✅ Alerts working
└── run.js (~250 lines)             ✅ CLI functional

Total: ~1,800 lines of proven JavaScript
```

### **Empty TypeScript Project Structure**
```
c:/workplace/cal-runtime/
├── src/                            📁 Empty (needs code)
├── tests/                          📁 Empty (needs tests)
└── Grammar + Fixtures              ✅ Ready
```

---

## 🏗️ **Architecture Refactoring Strategy**

### **From Monolithic to Modular**

#### **Before (JavaScript)**
```
lib/executor.js (525 lines)
└── Contains everything:
    ├── Query handling
    ├── Analysis logic
    ├── DRIFT calculation
    ├── FETCH decision
    ├── Alert handling
    └── Output formatting
```

#### **After (TypeScript)**
```
src/executor/
├── index.ts (100 lines)           # Orchestrator
├── handlers/
│   ├── forage.ts (80 lines)       # Query execution
│   ├── drift.ts (60 lines)        # DRIFT calculation
│   ├── fetch.ts (80 lines)        # FETCH decision
│   ├── dive.ts (70 lines)         # Analysis
│   ├── perch.ts (50 lines)        # Observation
│   └── chirp.ts (40 lines)        # Alerts
└── context.ts (50 lines)          # Execution context

Total: ~530 lines (same logic, better organized)
```

### **Benefits of Modular Approach**
- ✅ Each handler independently testable
- ✅ Clear semantic boundaries
- ✅ Easier to maintain and extend
- ✅ Self-documenting file structure

---

## 📋 **Phase-by-Phase Refactoring Plan**

---

## **Phase 1: Type Foundation (2-3 hours)**

### **Objective:** Establish semantic type system

### **Deliverables:**
- `src/types/index.ts` (~500 lines)
- Complete type definitions for entire system
- Semantic documentation in JSDoc

### **Key Types to Define:**

#### **1. AST Types (What Parser Produces)**
```typescript
// Core program structure
export interface Program {
  type: 'Program';
  language: 'Cormorant Agentic Language';
  version: string;
  statements: Statement[];
}

// Semantic statement union
export type Statement =
  | ForageStatement
  | DiveStatement
  | DriftStatement
  | FetchStatement
  | PerchStatement
  | ListenStatement
  | WakeStatement
  | ChirpStatement
  | TraceStatement
  | SurfaceStatement;

// Each statement type with semantic properties
export interface DriftStatement {
  type: 'Drift';
  target: string;
  methodology: number;  // 0-100, semantic: "should be"
  performance: number;  // 0-100, semantic: "is"
  gap?: string;         // Optional semantic override
}

export interface FetchStatement {
  type: 'Fetch';
  target: string;
  threshold: number;
  confidence?: number;
  onExecute?: Statement;    // Nested semantic action
  onConfirm?: Statement;
  onQueue?: Statement;
  onWait?: Statement;
}
```

#### **2. Action Plan Types (What Executes)**
```typescript
export interface ActionPlan {
  type: 'ActionPlan';
  generated: string;
  methodology: '6D Foraging';  // Semantic anchor
  lens: ThreeDLens;
  dimensions: DimensionID[];
  actions: Action[];
}

export type Action =
  | QueryAction
  | AnalyzeAction
  | DriftAction
  | FetchAction
  | ObserveAction
  | MonitorAction
  | ScheduleAction
  | AlertAction
  | TraceCascadeAction
  | OutputAction;

// Semantic action types
export interface DriftAction {
  action: 'drift';  // Semantic keyword
  target: string;
  methodology: number;
  performance: number;
  gapType: 'curiosity' | 'teaching' | 'auto';
}

export interface FetchAction {
  action: 'fetch';  // Semantic keyword
  target: string;
  threshold: number;
  confidence: number | null;
  onExecute: Action | null;
  onConfirm: Action | null;
  onQueue: Action | null;
  onWait: Action | null;
}
```

#### **3. Execution Result Types**
```typescript
// Immutable semantic results
export type DriftResult = Readonly<{
  target: string;
  drift: number;
  absDrift: number;
  methodology: number;
  performance: number;
  gapType: 'curiosity' | 'teaching';  // Semantic anchor
  driftQuality: 'optimal' | 'extreme' | 'minimal' | 'moderate';
  interpretation: string;
}>;

export type FetchResult = Readonly<{
  target: string;
  fetchScore: number;
  threshold: number;
  level: 'EXECUTE' | 'CONFIRM' | 'QUEUE' | 'WAIT';  // Semantic levels
  components: Readonly<{
    chirp: number;
    drift: number;
    confidence: number;
  }>;
  recommendation: string;
}>;
```

#### **4. Domain Types**
```typescript
// 6D Dimension semantics
export type DimensionID = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'ALL';

export interface DimensionSemantic {
  id: DimensionID;
  name: string;  // Semantic: Customer, Employee, etc.
  description: string;
  domain: string;  // Semantic domain
}

export interface DimensionSignal {
  sound: number;  // 1-10, semantic: urgency
  space: number;  // 1-10, semantic: scope
  time: number;   // 1-10, semantic: velocity
  notes?: string;
}

// Entity with semantic properties
export interface Entity {
  id: string;
  name: string;
  type: string;
  sound: number;      // Observable: urgency
  space: number;      // Observable: scope
  time: number;       // Observable: velocity
  baseCost?: number;  // Observable: financial impact
  dimensions?: Record<DimensionID, DimensionSignal>;
  [key: string]: any;
}
```

### **Success Criteria:**
- ✅ All types documented with semantic meaning
- ✅ Immutability enforced with Readonly<T>
- ✅ Union types use semantic keywords
- ✅ No technical types without semantic anchoring
- ✅ Compiles without errors

### **Testing:**
```bash
npm run typecheck  # Should pass with 0 errors
```

---

## **Phase 2: Parser Module (1-2 hours)**

### **Objective:** Port parser with type safety

### **Deliverables:**
- `src/parser/index.ts` (~300 lines)
- Typed parser wrapper
- Action plan transformation
- Error handling

### **Implementation Steps:**

#### **Step 1: Grammar Compilation**
```bash
cd src/parser
npx peggy -o grammar.js --format es grammar.pegjs
```

#### **Step 2: Parser Wrapper**
```typescript
// src/parser/index.ts
import * as fs from 'fs';
import * as path from 'path';
import peggy from 'peggy';
import type { Program, ActionPlan } from '../types';

// Compile grammar once at module load
const grammarPath = path.join(__dirname, 'grammar.pegjs');
const grammar = fs.readFileSync(grammarPath, 'utf-8');
const parser = peggy.generate(grammar);

/**
 * Parse CAL source into AST
 *
 * SEMANTIC INTENT: Transform CAL source code into structured representation
 * preserving all semantic meaning from methodology keywords.
 */
export function parse(source: string): ParseResult {
  try {
    const ast = parser.parse(source) as Program;
    return { success: true, ast };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message,
        location: error.location,
        expected: error.expected,
        found: error.found
      }
    };
  }
}
```

#### **Step 3: Action Plan Transformation**
```typescript
/**
 * Transform AST into executable action plan
 *
 * SEMANTIC ANCHORING: Each statement type maps to semantic action,
 * preserving methodology meaning through transformation.
 */
export function toActionPlan(ast: Program): ActionPlan {
  const plan: ActionPlan = {
    type: 'ActionPlan',
    generated: new Date().toISOString(),
    methodology: '6D Foraging',  // Semantic anchor
    lens: { sound: [], space: [], time: [] },
    dimensions: [],
    actions: []
  };

  for (const stmt of ast.statements) {
    // Semantic switch on statement type
    switch (stmt.type) {
      case 'Drift':
        plan.actions.push({
          action: 'drift',  // Semantic keyword preserved
          target: stmt.target,
          methodology: stmt.methodology,
          performance: stmt.performance,
          gapType: stmt.gap || 'auto'
        });
        break;

      case 'Fetch':
        plan.actions.push({
          action: 'fetch',  // Semantic keyword preserved
          target: stmt.target,
          threshold: stmt.threshold,
          confidence: stmt.confidence || null,
          onExecute: stmt.onExecute || null,
          onConfirm: stmt.onConfirm || null,
          onQueue: stmt.onQueue || null,
          onWait: stmt.onWait || null
        });
        break;

      // ... other cases
    }
  }

  plan.dimensions = [...new Set(plan.dimensions)];
  return plan;
}
```

### **Semantic Validation:**
```typescript
/**
 * Validate semantic contracts in action plan
 */
function validateActionPlan(plan: ActionPlan): void {
  for (const action of plan.actions) {
    if (!isValidCALKeyword(action.action)) {
      throw new SemanticContractViolation(
        `Invalid semantic keyword: ${action.action}`
      );
    }
  }
}
```

### **Success Criteria:**
- ✅ All CAL keywords parse correctly
- ✅ DRIFT and FETCH statements work
- ✅ Action plan preserves semantic meaning
- ✅ Error messages are clear and helpful
- ✅ Types enforce correctness

### **Testing:**
```typescript
// tests/parser/drift.test.ts
import { parse } from '../../src/parser';

describe('DRIFT parsing', () => {
  it('preserves semantic keyword', () => {
    const result = parse('DRIFT cascade_map METHODOLOGY 85 PERFORMANCE 35');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ast.statements[0].type).toBe('Drift');  // Semantic type
    }
  });

  it('preserves observable properties', () => {
    const result = parse('DRIFT cascade_map METHODOLOGY 85 PERFORMANCE 35');
    if (result.success) {
      const stmt = result.ast.statements[0] as DriftStatement;
      expect(stmt.methodology).toBe(85);  // Observable: should-be
      expect(stmt.performance).toBe(35);  // Observable: is
    }
  });
});
```

---

## **Phase 3: Analyzer Module (1-2 hours)**

### **Objective:** Port 6D analysis with formula preservation

### **Deliverables:**
- `src/analyzer/dimension-scorer.ts` (~200 lines)
- `src/analyzer/cascade-mapper.ts` (~150 lines)
- `src/analyzer/financial-calculator.ts` (~100 lines)

### **Critical Semantic Formulas:**

#### **3D Lens Scoring (Sacred Formula)**
```typescript
/**
 * Score dimension using 3D Lens formula
 *
 * SEMANTIC FORMULA: (Sound × Space × Time) / 10
 * - Sound: Urgency/intensity (1-10)
 * - Space: Scope/reach (1-10)
 * - Time: Velocity/speed (1-10)
 *
 * SEMANTIC CONTRACT: This formula MUST NOT be modified.
 * It encodes observable reality across three dimensions.
 */
export function scoreDimension(signals: DimensionSignal): number {
  // Semantic formula - DO NOT MODIFY
  return (signals.sound * signals.space * signals.time) / 10;
}

// Add formula validation in development
if (process.env.NODE_ENV === 'development') {
  const testSignals = { sound: 8, space: 7, time: 9 };
  const expectedScore = (8 * 7 * 9) / 10; // 50.4
  const actualScore = scoreDimension(testSignals);

  if (Math.abs(actualScore - expectedScore) > 0.01) {
    throw new SemanticContractViolation(
      `3D Lens formula violated: expected ${expectedScore}, got ${actualScore}`
    );
  }
}
```

#### **Cascade Probability (Semantic Relationship)**
```typescript
/**
 * Calculate cascade probability between dimensions
 *
 * SEMANTIC FORMULA: (FromScore / 100) × (ToScore / 100)
 * Represents joint likelihood based on dimension strengths
 */
function calculateCascadeProbability(
  fromScore: number,
  toScore: number
): number {
  return (fromScore / 100) * (toScore / 100);
}
```

#### **Financial Multiplier (Observable Impact)**
```typescript
/**
 * Calculate cascade multiplier based on observable dimensions and depth
 *
 * SEMANTIC RANGES:
 * - 15+:   10-15× (Extreme)
 * - 10-14:  6-10× (Severe)
 * - 6-9:    4-6×  (Significant)
 * - 3-5:    2-4×  (Moderate)
 * - <3:     1.5-2× (Limited)
 */
function calculateMultiplier(
  dimensionsAffected: number,
  cascadeDepth: number
): { min: number; max: number; label: string } {
  const product = dimensionsAffected * cascadeDepth;

  // Semantic boundaries - DO NOT MODIFY
  if (product >= 15) return { min: 10, max: 15, label: 'Extreme' };
  if (product >= 10) return { min: 6, max: 10, label: 'Severe' };
  if (product >= 6) return { min: 4, max: 6, label: 'Significant' };
  if (product >= 3) return { min: 2, max: 4, label: 'Moderate' };
  return { min: 1.5, max: 2, label: 'Limited' };
}
```

### **Success Criteria:**
- ✅ All formulas preserved exactly
- ✅ Formula validation in development mode
- ✅ Semantic boundaries maintained
- ✅ Observable properties used for decisions

---

## **Phase 4: Executor Module (2-3 hours)**

### **Objective:** Port executor with semantic handler separation

### **Deliverables:**
- `src/executor/index.ts` (~150 lines)
- `src/executor/handlers/drift.ts` (~80 lines)
- `src/executor/handlers/fetch.ts` (~100 lines)
- `src/executor/handlers/forage.ts` (~100 lines)
- Other handlers (~300 lines total)

### **Semantic Handler: DRIFT**
```typescript
// src/executor/handlers/drift.ts

/**
 * Handle DRIFT action - Measure gap for adaptive teaching/curiosity
 *
 * SEMANTIC INTENT: DRIFT measures gap between methodology (should-be)
 * and performance (is), enabling adaptive behavior.
 *
 * SEMANTIC ANCHORING: Gap type determined by OBSERVABLE drift direction:
 * - drift < 0 → Curiosity gap (reveal less, intrigue more)
 * - drift > 0 → Teaching gap (explain more, clarify)
 *
 * OBSERVABLE PROPERTIES:
 * - methodology: Expected level (0-100)
 * - performance: Actual level (0-100)
 * - drift: Observable gap (methodology - performance)
 */
export async function handleDrift(
  action: DriftAction,
  context: ExecutionContext
): Promise<DriftResult> {
  const { target, methodology, performance, gapType } = action;

  // Semantic calculation - observable gap
  const drift = methodology - performance;
  const absDrift = Math.abs(drift);

  // Semantic determination - observable direction
  let detectedGapType: 'curiosity' | 'teaching';
  if (gapType === 'auto') {
    detectedGapType = drift < 0 ? 'curiosity' : 'teaching';
  } else {
    detectedGapType = gapType as 'curiosity' | 'teaching';
  }

  // Semantic quality assessment
  const quality = assessDriftQuality(absDrift, detectedGapType);

  // Immutable semantic result
  const result: DriftResult = Object.freeze({
    target,
    drift,
    absDrift,
    methodology,
    performance,
    gapType: detectedGapType,
    driftQuality: quality.level,
    interpretation: quality.interpretation
  });

  // Store for FETCH reference
  context.results[`${target}_drift`] = result;

  return result;
}

/**
 * Assess DRIFT quality based on semantic ranges
 *
 * SEMANTIC BOUNDARIES:
 * Curiosity: optimal -20 to -11, extreme >25, minimal <5
 * Teaching:  optimal +8 to +15, extreme >25, minimal <5
 */
function assessDriftQuality(
  absDrift: number,
  gapType: 'curiosity' | 'teaching'
): { level: DriftQuality; interpretation: string } {
  if (gapType === 'curiosity') {
    // Semantic boundaries for curiosity
    if (absDrift >= 11 && absDrift <= 20) {
      return {
        level: 'optimal',
        interpretation: 'Perfect curiosity gap - engaging and intriguing'
      };
    } else if (absDrift > 25) {
      return {
        level: 'extreme',
        interpretation: 'Gap too large - may cause confusion or disengagement'
      };
    } else if (absDrift < 5) {
      return {
        level: 'minimal',
        interpretation: 'Gap too small - insufficient curiosity generation'
      };
    } else {
      return {
        level: 'moderate',
        interpretation: 'Reasonable curiosity gap'
      };
    }
  } else {
    // Semantic boundaries for teaching
    if (absDrift >= 8 && absDrift <= 15) {
      return {
        level: 'optimal',
        interpretation: 'Perfect teaching gap - clear guidance without overwhelm'
      };
    } else if (absDrift > 25) {
      return {
        level: 'extreme',
        interpretation: 'Over-explanation - may cause cognitive overload'
      };
    } else if (absDrift < 5) {
      return {
        level: 'minimal',
        interpretation: 'Insufficient teaching - gap too small'
      };
    } else {
      return {
        level: 'moderate',
        interpretation: 'Reasonable teaching gap'
      };
    }
  }
}
```

### **Semantic Handler: FETCH**
```typescript
// src/executor/handlers/fetch.ts

/**
 * Handle FETCH action - Decide when to act based on readiness
 *
 * SEMANTIC INTENT: FETCH determines action level based on observable
 * readiness score (Chirp × |DRIFT| × Confidence).
 *
 * SEMANTIC FORMULA: Fetch = Chirp × |DRIFT| × Confidence
 * - Chirp: Urgency (from cascade average score)
 * - DRIFT: Gap size (from DRIFT measurement)
 * - Confidence: Readiness (0-1, default 0.8)
 *
 * SEMANTIC THRESHOLDS:
 * - > threshold       → EXECUTE (act immediately)
 * - > threshold × 0.5 → CONFIRM (verify first)
 * - > threshold × 0.1 → QUEUE (schedule)
 * - ≤ threshold × 0.1 → WAIT (monitor)
 */
export async function handleFetch(
  action: FetchAction,
  context: ExecutionContext
): Promise<FetchResult> {
  const { target, threshold, confidence, onExecute, onConfirm, onQueue, onWait } = action;

  // Get observable data
  const targetData = context.results[target] as CascadeMap;
  const driftData = context.results[`${target}_drift`] as DriftResult;

  if (!targetData) {
    throw new Error(`Target '${target}' not found in results`);
  }

  // Calculate Chirp (observable urgency)
  const chirp = calculateChirp(targetData);

  // Get DRIFT (observable gap)
  const drift = driftData ? driftData.absDrift : 0;

  // Get Confidence (observable readiness)
  const confidenceValue = confidence ? confidence / 100 : 0.8;

  // Semantic formula - DO NOT MODIFY
  const fetchScore = chirp * drift * confidenceValue;

  // Determine semantic level based on observable thresholds
  const level = determineFetchLevel(fetchScore, threshold);

  // Get recommended action for this level
  const recommendedAction = {
    EXECUTE: onExecute,
    CONFIRM: onConfirm,
    QUEUE: onQueue,
    WAIT: onWait
  }[level];

  // Immutable semantic result
  const result: FetchResult = Object.freeze({
    target,
    fetchScore,
    threshold,
    level,
    components: Object.freeze({ chirp, drift, confidence: confidenceValue }),
    recommendation: `Score: ${fetchScore.toFixed(2)} | Threshold: ${threshold} | Level: ${level}`
  });

  context.results[`${target}_fetch`] = result;

  // Execute recommended semantic action
  if (recommendedAction) {
    await context.executeAction(recommendedAction);
  }

  return result;
}

/**
 * Determine FETCH level based on semantic thresholds
 *
 * SEMANTIC BOUNDARIES: Thresholds encode observable readiness levels
 */
function determineFetchLevel(
  fetchScore: number,
  threshold: number
): FetchLevel {
  // Semantic thresholds - DO NOT MODIFY
  if (fetchScore > threshold) {
    return 'EXECUTE';  // Observable: exceeds full threshold
  } else if (fetchScore > threshold * 0.5) {
    return 'CONFIRM';  // Observable: exceeds half threshold
  } else if (fetchScore > threshold * 0.1) {
    return 'QUEUE';    // Observable: exceeds tenth threshold
  } else {
    return 'WAIT';     // Observable: below all thresholds
  }
}
```

### **Success Criteria:**
- ✅ All handlers preserve semantic meaning
- ✅ DRIFT and FETCH formulas exact
- ✅ Observable properties drive decisions
- ✅ Immutable results enforced
- ✅ Nested actions execute correctly

---

## **Phase 5: Adapters (1 hour)**

### **Objective:** Port data and alert adapters

### **Deliverables:**
- `src/adapters/data/index.ts`
- `src/adapters/alert/index.ts`

### **Minimal Changes:**
Just add types, keep logic same:

```typescript
// src/adapters/data/index.ts
export interface DataAdapter {
  query(filter: any): Promise<Entity[]>;
  get(id: string): Promise<Entity | null>;
}

export function createMemoryAdapter(data: any): DataAdapter {
  // Port existing logic with types
}

export function createJSONAdapter(filePath: string): DataAdapter {
  // Port existing logic with types
}
```

---

## **Phase 6: CLI & REPL (30 min - 1 hour)**

### **Objective:** Port command-line tools

### **Deliverables:**
- `src/cli.ts`
- `src/repl.ts` (optional)

### **Simple Port:**
```typescript
#!/usr/bin/env node
import { compile } from './parser';
import { createExecutor } from './executor';
// ... rest of CLI logic
```

---

## **Phase 7: Comprehensive Testing (2-3 hours)**

### **Objective:** Test semantic contracts

### **Test Structure:**
```
tests/
├── parser/
│   ├── drift.test.ts          # DRIFT parsing
│   ├── fetch.test.ts          # FETCH parsing
│   └── semantic.test.ts       # Semantic validation
├── executor/
│   ├── drift-handler.test.ts  # DRIFT execution
│   ├── fetch-handler.test.ts  # FETCH execution
│   └── semantic.test.ts       # Semantic contracts
├── analyzer/
│   ├── formulas.test.ts       # Formula preservation
│   └── semantic.test.ts       # Semantic boundaries
└── integration/
    ├── tailwind-case.test.ts  # UC-002 full test
    └── closed-loop.test.ts    # Complete pipeline
```

### **Semantic Test Examples:**
```typescript
// tests/executor/drift-handler.test.ts
describe('DRIFT handler semantic contract', () => {
  it('determines gap type from observable drift', () => {
    const result = await handleDrift({
      action: 'drift',
      target: 'test',
      methodology: 85,
      performance: 35,
      gapType: 'auto'
    });

    // Semantic assertion: drift > 0 → teaching
    expect(result.gapType).toBe('teaching');
    expect(result.drift).toBe(50);
  });

  it('preserves semantic immutability', () => {
    const result = await handleDrift(action);

    // Should throw - immutable contract
    expect(() => {
      (result as any).gapType = 'curiosity';
    }).toThrow();
  });
});

// tests/analyzer/formulas.test.ts
describe('3D Lens formula semantic contract', () => {
  it('preserves exact formula', () => {
    const signals = { sound: 8, space: 7, time: 9 };
    const score = scoreDimension(signals);

    // Semantic formula: (8 × 7 × 9) / 10 = 50.4
    expect(score).toBe(50.4);
  });
});
```

---

## 📊 **Timeline Summary**

| Phase | Task | Hours | Cumulative |
|-------|------|-------|------------|
| 1 | Type Definitions | 2-3h | 2-3h |
| 2 | Parser Module | 1-2h | 3-5h |
| 3 | Analyzer Module | 1-2h | 4-7h |
| 4 | Executor Module | 2-3h | 6-10h |
| 5 | Adapters | 1h | 7-11h |
| 6 | CLI & REPL | 0.5-1h | 7.5-12h |
| 7 | Testing | 2-3h | 9.5-15h |

**Total: 10-15 hours** for production-ready TypeScript implementation

---

## ✅ **Success Criteria (Overall)**

### **Semantic Integrity**
- ✅ All keywords preserve methodology meaning
- ✅ All formulas preserved exactly
- ✅ Observable properties drive decisions
- ✅ Dimension identity maintained
- ✅ Gap types determined semantically

### **Type Safety**
- ✅ No `any` types (except adapters)
- ✅ Immutability enforced with `Readonly<T>`
- ✅ Union types use semantic keywords
- ✅ Compiles with strict mode

### **Code Quality**
- ✅ Every function documented with semantic intent
- ✅ Modular structure (not monolithic)
- ✅ Clear separation of concerns
- ✅ No "clever" abstractions

### **Testing**
- ✅ 90%+ test coverage
- ✅ All semantic contracts tested
- ✅ Integration tests pass (Tailwind, closed-loop)
- ✅ Formula validation tests

### **Production Ready**
- ✅ Error handling comprehensive
- ✅ Semantic validation in development
- ✅ CLI functional
- ✅ npm package publishable

---

## 🚨 **Refactoring Red Flags**

### **STOP and Review If:**
1. Adding technical flags instead of semantic properties
2. Modifying formulas "for performance"
3. Using dimension IDs as indexes
4. Inferring semantic types from heuristics
5. Making results mutable
6. Skipping semantic documentation
7. Creating abstractions that obscure meaning

---

## 📝 **Development Workflow**

### **For Each Phase:**

1. **Read Governance**
   - Review CAL-SEMANTIC-GOVERNANCE.md
   - Check compliance checklist

2. **Read Original Code**
   - Understand semantic intent
   - Identify formulas and boundaries
   - Note observable properties

3. **Design Types**
   - Define semantic interfaces
   - Add immutability
   - Document intent

4. **Implement**
   - Preserve semantic meaning
   - Add type safety
   - Modularize

5. **Test**
   - Test semantic contracts
   - Validate formulas
   - Verify immutability

6. **Document**
   - Semantic intent in JSDoc
   - Observable properties
   - Semantic anchoring

7. **Review**
   - Check against governance
   - Validate semantic preservation
   - Test edge cases

8. **Commit**
   - Semantic commit message
   - One phase per commit
   - Include tests

---

## 🎯 **Post-Refactoring**

### **What We'll Have:**
- ✅ Type-safe CAL runtime
- ✅ Semantically anchored codebase
- ✅ Modular, maintainable architecture
- ✅ Comprehensive test coverage
- ✅ Production-ready npm package
- ✅ Foundation for products (Playground, PACE, Forage)

### **What We'll Maintain:**
- ✅ All working functionality
- ✅ Validated formulas
- ✅ Proven behavior
- ✅ Methodology fidelity

### **What We'll Gain:**
- ✅ Compile-time correctness
- ✅ Better IDE support
- ✅ Easier refactoring
- ✅ Self-documenting code
- ✅ Extensible architecture

---

## 🚀 **Ready to Begin?**

**Start Command:**
```bash
cd c:/workplace/cal-runtime
git checkout -b refactor/phase-1-types
npm install
mkdir -p src/types
code src/types/index.ts
```

**First Line to Write:**
```typescript
/**
 * CAL Runtime Type Definitions
 *
 * SEMANTIC ANCHORING: These types encode the Cormorant Foraging Methodology
 * into the TypeScript type system. Each type preserves semantic meaning.
 */
```

---

*Plan Status: Ready for Execution*
*Authority: CAL-SEMANTIC-GOVERNANCE.md*
*Compliance: Mandatory semantic anchoring throughout*
