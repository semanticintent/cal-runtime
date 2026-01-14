# 🪶 CAL Semantic Anchoring Governance Extension

## 📜 **Extends: SEMANTIC_ANCHORING_GOVERNANCE.md**

This document extends the core Semantic Anchoring Governance with **CAL-specific rules** for the Cormorant Agentic Language runtime.

---

## 🎯 **CAL Semantic Philosophy**

CAL is a **methodology-native language** where keywords, formulas, and structures carry **semantic meaning from the Cormorant Foraging Methodology**. These are not arbitrary technical terms - they encode observable behaviors and decision-making patterns from nature.

### **The Foundation: Cormorant Foraging**

```
🪶 Cormorant Behavior → Methodology Patterns → CAL Keywords

Cormorant forages for fish → FORAGE searches for cascade signals
Cormorant dives deep → DIVE analyzes cascades deeply
Cormorant perches to observe → PERCH monitors positions
Cormorant makes chirp calls → CHIRP emits alerts
Cormorant fetches prey when ready → FETCH decides to act
```

**These semantic anchors are sacred and must be preserved through all transformations.**

---

## 🏛️ **CAL-Specific Governance Rules**

### **CAL Rule 1: Methodology Semantic Integrity**

```typescript
/**
 * MANDATORY: All CAL keywords preserve cormorant methodology semantics
 *
 * Each keyword represents an OBSERVABLE cormorant behavior:
 * - FORAGE = Search for food (cascade signals)
 * - DIVE = Deep underwater analysis (cascade traversal)
 * - DRIFT = Gap measurement (teaching vs curiosity)
 * - FETCH = Decision to retrieve (action readiness)
 * - PERCH = Observation position (monitoring)
 * - LISTEN = Monitor signals (sound dimension)
 * - WAKE = Time-based triggers (temporal awareness)
 * - CHIRP = Alert/communicate (signal emission)
 * - TRACE = Follow pathways (cascade tracking)
 * - SURFACE = Return results (bring to surface)
 */

// ✅ CORRECT: Semantic meaning drives behavior
switch (action.action) {
  case 'forage':
    return this.searchForCascadeSignals(action);
  case 'drift':
    return this.measureGap(action);
  case 'fetch':
    return this.decideToAct(action);
}

// ❌ VIOLATION: Technical flags override semantic meaning
if (options.quickMode) {
  return this.skipForage();  // Breaks methodology semantics!
}
```

---

### **CAL Rule 2: Formula Semantic Anchoring**

```typescript
/**
 * MANDATORY: Mathematical formulas are semantic contracts
 *
 * Each formula encodes observable methodology principles:
 *
 * 1. 3D Lens Scoring
 *    Score = (Sound × Space × Time) / 10
 *    Semantic: Observable reality across three dimensions
 *
 * 2. DRIFT Gap Measurement
 *    DRIFT = Methodology - Performance
 *    Semantic: Gap between should-be and is-state
 *
 * 3. Fetch Action Decision
 *    Fetch = Chirp × |DRIFT| × Confidence
 *    Semantic: Urgency × Gap × Readiness = Action Score
 *
 * 4. Cascade Probability
 *    Probability = (FromScore / 100) × (ToScore / 100)
 *    Semantic: Joint likelihood based on dimension strengths
 *
 * 5. Cascade Multiplier
 *    Multiplier = f(dimensions × depth)
 *    Semantic: Exponential impact across dimensions and levels
 *
 * Technical optimizations MUST preserve formula semantics.
 */

// ✅ CORRECT: Formula preserves semantic meaning
function scoreDimension(signals: DimensionSignal): number {
  return (signals.sound * signals.space * signals.time) / 10;
  // Semantic: Observable 3D reality
}

// ❌ VIOLATION: Formula altered for "optimization"
function scoreDimension(signals: DimensionSignal): number {
  return Math.sqrt(signals.sound * signals.space);  // Lost Time! Broken semantic!
}
```

---

### **CAL Rule 3: Dimension Semantic Identity**

```typescript
/**
 * MANDATORY: 6D dimensions have semantic identity
 *
 * Each dimension represents a distinct cascade domain:
 *
 * D1 = Customer (External stakeholders, clients, users)
 *      Semantic: External relationships, trust, satisfaction
 *
 * D2 = Employee (Internal people, teams, knowledge)
 *      Semantic: Human capital, capabilities, morale
 *
 * D3 = Revenue (Financial impact, costs, income)
 *      Semantic: Economic value, financial health
 *
 * D4 = Regulatory (Compliance, legal, governance)
 *      Semantic: Risk, compliance burden, legal exposure
 *
 * D5 = Quality (Product, service, deliverables)
 *      Semantic: Output excellence, reliability, performance
 *
 * D6 = Operational (Processes, systems, infrastructure)
 *      Semantic: Execution capacity, efficiency, stability
 *
 * Dimension IDs MUST NOT be treated as mere technical indexes.
 * Each has methodology meaning and cascade behavior patterns.
 */

// ✅ CORRECT: Dimension semantics preserved
const dimensionMetadata = {
  D1: { name: 'Customer', description: 'External stakeholders' },
  D2: { name: 'Employee', description: 'Internal people' },
  // ... semantic meaning embedded
};

// ❌ VIOLATION: Dimensions as technical indexes
const dims = ['d1', 'd2', 'd3'];  // Lost semantic identity!
for (let i = 0; i < dims.length; i++) {
  process(dims[i]);  // Treating as arbitrary data
}
```

---

### **CAL Rule 4: Gap Type Semantic Determination**

```typescript
/**
 * MANDATORY: DRIFT gap types are semantically determined
 *
 * Gap type is based on OBSERVABLE drift direction:
 *
 * Curiosity Gap (DRIFT < 0):
 *   - Methodology < Performance
 *   - Semantic: "They know more than we're showing"
 *   - Behavior: Create intrigue, ask questions, reveal gradually
 *   - Optimal: -20 to -11 (engaging mystery)
 *
 * Teaching Gap (DRIFT > 0):
 *   - Methodology > Performance
 *   - Semantic: "We need to explain more"
 *   - Behavior: Add context, clarify, guide understanding
 *   - Optimal: +8 to +15 (clear guidance)
 *
 * Gap type MUST be determined by drift value, NOT by:
 * - User preferences
 * - Technical flags
 * - Contextual heuristics
 * - Performance optimizations
 */

// ✅ CORRECT: Observable semantic determination
const gapType = drift < 0 ? 'curiosity' : 'teaching';

// ❌ VIOLATION: Heuristic override
const gapType = userPreferredMode === 'explain'
  ? 'teaching'  // Overrides observable drift!
  : 'curiosity';
```

---

### **CAL Rule 5: Fetch Level Semantic Thresholds**

```typescript
/**
 * MANDATORY: Fetch decision levels are semantically bounded
 *
 * Decision levels represent observable readiness states:
 *
 * EXECUTE (Score > threshold):
 *   - Semantic: "Act immediately - all signals aligned"
 *   - Behavior: Execute nested action without delay
 *
 * CONFIRM (Score > threshold × 0.5):
 *   - Semantic: "High readiness - verify before acting"
 *   - Behavior: Request confirmation, then execute
 *
 * QUEUE (Score > threshold × 0.1):
 *   - Semantic: "Moderate readiness - schedule for later"
 *   - Behavior: Add to processing queue
 *
 * WAIT (Score ≤ threshold × 0.1):
 *   - Semantic: "Low readiness - continue monitoring"
 *   - Behavior: Observe without action
 *
 * Threshold multipliers (0.5, 0.1) encode semantic boundaries.
 * These are NOT arbitrary - they represent observable readiness levels.
 */

// ✅ CORRECT: Semantic threshold boundaries
if (fetchScore > threshold) {
  level = 'EXECUTE';  // Observable: exceeds readiness
} else if (fetchScore > threshold * 0.5) {
  level = 'CONFIRM';  // Observable: high but needs verification
}

// ❌ VIOLATION: Arbitrary technical thresholds
if (fetchScore > magicNumber) {
  level = 'MAYBE_EXECUTE';  // Lost semantic meaning!
}
```

---

## 🚨 **CAL-Specific Violations**

### **IMMEDIATE ROLLBACK REQUIRED:**

1. **Keyword Semantic Override**
   ```typescript
   // ❌ VIOLATION
   if (fastMode) {
     action.action = 'skip_forage';  // Breaks methodology!
   }
   ```

2. **Formula Corruption**
   ```typescript
   // ❌ VIOLATION
   score = sound + space + time;  // Not 3D Lens formula!
   ```

3. **Dimension Identity Loss**
   ```typescript
   // ❌ VIOLATION
   const dimensions = [1, 2, 3];  // Lost semantic identity!
   ```

4. **Gap Type Inference**
   ```typescript
   // ❌ VIOLATION
   const gapType = context.mode === 'teaching'
     ? 'teaching' : 'curiosity';  // Ignores observable drift!
   ```

### **ARCHITECTURE REVIEW REQUIRED:**

1. **Technical shortcuts that bypass semantic keywords**
2. **Formula optimizations that change semantic meaning**
3. **Dimension processing that ignores identity**
4. **Decision logic that overrides observable properties**

---

## ✅ **CAL Compliance Checklist**

### **Before ANY code change, verify:**

#### **Keyword Semantics**
- [ ] Does this preserve the cormorant foraging meaning of the keyword?
- [ ] Are we using semantic action names (drift, fetch) not technical flags?
- [ ] Would this change break the methodology anchor?

#### **Formula Semantics**
- [ ] Do mathematical formulas preserve their semantic contracts?
- [ ] Is 3D Lens scoring unchanged (Sound × Space × Time / 10)?
- [ ] Are DRIFT and Fetch formulas preserved exactly?

#### **Dimension Semantics**
- [ ] Are D1-D6 treated as semantic entities, not indexes?
- [ ] Is dimension identity preserved through transformations?
- [ ] Do cascade calculations respect dimension meanings?

#### **Observable Properties**
- [ ] Are decisions based on observable values (scores, drift)?
- [ ] Are semantic types determined by direct observation?
- [ ] Are thresholds semantically meaningful, not arbitrary?

#### **Immutability Protection**
- [ ] Are result types readonly?
- [ ] Are semantic contracts frozen?
- [ ] Are transformations pure (no mutations)?

---

## 🏗️ **CAL Architecture Boundaries**

```
┌──────────────────────────────────────────────────────┐
│ SEMANTIC DOMAIN: Methodology Layer (Sacred)          │
│ Owns: FORAGE, DRIFT, FETCH semantic meanings        │
│       Cormorant behavior patterns                    │
│       6D dimensional identity                        │
│ Responsibility: Define & preserve CAL semantics      │
│ Protected: Immutable semantic contracts              │
└──────────────────────────────────────────────────────┘
                        ↓ (semantic contract)
┌──────────────────────────────────────────────────────┐
│ SEMANTIC DOMAIN: Formula Layer (Mathematical Truth) │
│ Owns: 3D Lens scoring                               │
│       DRIFT calculation                             │
│       Fetch decision formula                        │
│       Cascade probability                           │
│ Responsibility: Observable mathematical semantics    │
│ Protected: Formula integrity enforcement            │
└──────────────────────────────────────────────────────┘
                        ↓ (semantic contract)
┌──────────────────────────────────────────────────────┐
│ SEMANTIC DOMAIN: Analysis Layer (Methodology Exec)  │
│ Owns: 6D cascade analysis                           │
│       Dimension scoring                             │
│       Cascade pathway generation                    │
│       Financial impact calculation                  │
│ Responsibility: Methodology-compliant analysis      │
│ Protected: Semantic result types                   │
└──────────────────────────────────────────────────────┘
                        ↓ (semantic contract)
┌──────────────────────────────────────────────────────┐
│ EXECUTION DOMAIN: Runtime Layer (Preserves Intent)  │
│ Owns: Action execution                              │
│       Data processing                               │
│       Adapter orchestration                         │
│ Responsibility: Execute WITHOUT semantic override   │
│ Protected: Immutable action plans                  │
└──────────────────────────────────────────────────────┘
```

### **Forbidden Cross-Domain Violations:**

- ❌ Execution Layer changing keyword semantics
- ❌ Analysis Layer overriding formula contracts
- ❌ Runtime Layer ignoring dimension identity
- ❌ Technical optimizations breaking methodology anchors
- ❌ Performance shortcuts bypassing semantic layers

---

## 🎯 **Type System Semantic Anchoring**

### **Semantic Type Guards**

```typescript
// ✅ REQUIRED: Type guards preserve semantic meaning
function isDriftAction(action: Action): action is DriftAction {
  return action.action === 'drift';  // Semantic anchor
}

function isCuriosityGap(result: DriftResult): boolean {
  return result.gapType === 'curiosity';  // Observable semantic
}

function isHighUrgency(entity: Entity): boolean {
  return entity.sound > 7;  // Observable threshold
}
```

### **Semantic Union Types**

```typescript
// ✅ REQUIRED: Union types encode semantic meaning
type CALKeyword =
  | 'forage'    // Semantic: search for cascade signals
  | 'dive'      // Semantic: deep cascade analysis
  | 'drift'     // Semantic: gap measurement
  | 'fetch'     // Semantic: action decision
  | 'perch'     // Semantic: observation position
  | 'listen'    // Semantic: signal monitoring
  | 'wake'      // Semantic: time trigger
  | 'chirp'     // Semantic: alert emission
  | 'trace'     // Semantic: pathway following
  | 'surface';  // Semantic: result output

type GapType =
  | 'curiosity'  // Semantic: need for intrigue
  | 'teaching';  // Semantic: need for explanation

type FetchLevel =
  | 'EXECUTE'    // Semantic: act immediately
  | 'CONFIRM'    // Semantic: verify then act
  | 'QUEUE'      // Semantic: schedule for later
  | 'WAIT';      // Semantic: continue monitoring

// ❌ FORBIDDEN: Technical types without semantic meaning
type ActionType = 'type1' | 'type2' | 'type3';  // Meaningless!
```

### **Immutable Semantic Contracts**

```typescript
// ✅ REQUIRED: All semantic results are immutable
export type DriftResult = Readonly<{
  target: string;
  drift: number;
  absDrift: number;
  methodology: number;
  performance: number;
  gapType: 'curiosity' | 'teaching';  // Semantic anchor
  driftQuality: QualityLevel;
  interpretation: string;
}>;

export type FetchResult = Readonly<{
  target: string;
  fetchScore: number;
  threshold: number;
  level: FetchLevel;  // Semantic anchor
  components: Readonly<{
    chirp: number;
    drift: number;
    confidence: number;
  }>;
  recommendation: string;
}>;

// ✅ REQUIRED: Freeze at creation
export function createDriftResult(data: DriftResult): DriftResult {
  return Object.freeze(data);
}
```

---

## 📚 **CAL Reference Implementation Patterns**

### **Pattern 1: Observable Semantic Determination**

```typescript
// ✅ CANONICAL: Gap type from observable drift
async handleDrift(action: DriftAction): Promise<DriftResult> {
  const drift = action.methodology - action.performance;
  const gapType = drift < 0 ? 'curiosity' : 'teaching';
  // Observable semantic: drift value determines type

  return Object.freeze({ ...result, gapType });
}
```

### **Pattern 2: Formula Semantic Preservation**

```typescript
// ✅ CANONICAL: 3D Lens formula preserved exactly
function scoreDimension(signals: DimensionSignal): number {
  // Semantic formula: Sound × Space × Time / 10
  return (signals.sound * signals.space * signals.time) / 10;
}
```

### **Pattern 3: Threshold Semantic Boundaries**

```typescript
// ✅ CANONICAL: Semantic threshold multipliers
async handleFetch(action: FetchAction): Promise<FetchResult> {
  const fetchScore = chirp * drift * confidence;

  let level: FetchLevel;
  if (fetchScore > threshold) {
    level = 'EXECUTE';  // Semantic: exceeds full threshold
  } else if (fetchScore > threshold * 0.5) {
    level = 'CONFIRM';  // Semantic: exceeds half threshold
  } else if (fetchScore > threshold * 0.1) {
    level = 'QUEUE';    // Semantic: exceeds tenth threshold
  } else {
    level = 'WAIT';     // Semantic: below all thresholds
  }

  return Object.freeze({ ...result, level });
}
```

### **Pattern 4: Dimension Semantic Identity**

```typescript
// ✅ CANONICAL: Dimension metadata preserves identity
const DIMENSION_SEMANTICS: Record<string, DimensionSemantic> = Object.freeze({
  D1: Object.freeze({
    id: 'D1',
    name: 'Customer',
    description: 'External stakeholders, clients, users',
    domain: 'external-relationships'
  }),
  D2: Object.freeze({
    id: 'D2',
    name: 'Employee',
    description: 'Internal people, teams, knowledge',
    domain: 'human-capital'
  }),
  // ... all dimensions with semantic identity
});
```

---

## 🔍 **Semantic Validation Layer**

```typescript
/**
 * Validate semantic contracts are preserved
 */
export class SemanticValidator {

  validateAction(action: Action): void {
    if (!this.isValidCALKeyword(action.action)) {
      throw new SemanticContractViolation(
        `Invalid semantic keyword: ${action.action}`
      );
    }
  }

  validateDriftResult(result: DriftResult): void {
    // Validate observable semantic determination
    const expectedGapType = result.drift < 0 ? 'curiosity' : 'teaching';
    if (result.gapType !== expectedGapType) {
      throw new SemanticContractViolation(
        `Gap type '${result.gapType}' does not match observable drift ${result.drift}`
      );
    }
  }

  validateFormulaIntegrity(
    actual: number,
    expected: number,
    formula: string
  ): void {
    if (Math.abs(actual - expected) > 0.01) {
      throw new SemanticContractViolation(
        `Formula '${formula}' violated: expected ${expected}, got ${actual}`
      );
    }
  }

  private isValidCALKeyword(keyword: string): keyword is CALKeyword {
    const valid: CALKeyword[] = [
      'forage', 'dive', 'drift', 'fetch', 'perch',
      'listen', 'wake', 'chirp', 'trace', 'surface'
    ];
    return valid.includes(keyword as CALKeyword);
  }
}
```

---

## 📖 **Documentation Standards**

### **Required Documentation for All Functions**

```typescript
/**
 * [Function name in semantic terms]
 *
 * SEMANTIC INTENT: [What this represents in methodology terms]
 *
 * SEMANTIC ANCHORING: [How semantic meaning is preserved/determined]
 *
 * OBSERVABLE PROPERTIES: [Which observable values drive behavior]
 *
 * SEMANTIC CONTRACT: [What semantic guarantees this provides]
 *
 * @param [semantic description of parameter]
 * @returns [semantic description of result, including immutability]
 *
 * @example
 * ```typescript
 * // Example showing semantic meaning in action
 * ```
 */
```

### **Example**

```typescript
/**
 * Calculate DRIFT gap measurement for adaptive teaching or curiosity generation
 *
 * SEMANTIC INTENT: DRIFT measures the gap between what should be demonstrated
 * (methodology) and what is currently being performed (performance). This gap
 * determines whether to generate curiosity (reveal less) or provide teaching
 * (explain more), following the cormorant foraging methodology.
 *
 * SEMANTIC ANCHORING: Gap type is determined purely by observable drift direction:
 * - Negative drift → Curiosity gap (performance exceeds methodology)
 * - Positive drift → Teaching gap (methodology exceeds performance)
 * No heuristics, no overrides, no technical flags.
 *
 * OBSERVABLE PROPERTIES:
 * - methodology: Expected demonstration level (0-100)
 * - performance: Actual performance level (0-100)
 * - drift: Observable gap (methodology - performance)
 *
 * SEMANTIC CONTRACT: Returns immutable DriftResult with gap type determined
 * purely by observable drift value, preserving methodology semantics.
 *
 * @param action - DriftAction containing methodology and performance values
 * @returns Immutable DriftResult with semantic gap analysis
 *
 * @example
 * ```typescript
 * const result = await handleDrift({
 *   action: 'drift',
 *   target: 'cascade_map',
 *   methodology: 85,
 *   performance: 35
 * });
 * // result.drift = 50 (teaching gap - extreme)
 * // result.gapType = 'teaching' (observable semantic)
 * ```
 */
async handleDrift(action: DriftAction): Promise<DriftResult> {
  // Implementation preserving semantic contract
}
```

---

## 🚀 **Enforcement**

### **Code Review Requirements**

All PRs must demonstrate:
1. ✅ Semantic keyword preservation
2. ✅ Formula integrity maintenance
3. ✅ Dimension identity respect
4. ✅ Observable property anchoring
5. ✅ Immutability protection
6. ✅ Semantic documentation completeness

### **Automated Protection**

```typescript
// Runtime semantic validation
if (process.env.NODE_ENV === 'development') {
  const validator = new SemanticValidator();
  validator.validateDriftResult(result);
  validator.validateFormulaIntegrity(score, expectedScore, '3D Lens');
}

// Type system enforcement
type ImmutableDriftResult = Readonly<DriftResult>;  // Compile-time protection
const result = Object.freeze(data);  // Runtime protection
```

### **Testing Requirements**

All tests must verify:
1. ✅ Semantic intent preservation
2. ✅ Formula semantic correctness
3. ✅ Observable property behavior
4. ✅ Immutability enforcement
5. ✅ Semantic contract compliance

---

## ⚖️ **Consequences**

### **Immediate Rollback:**
- Keyword semantic violations
- Formula corruption
- Dimension identity loss
- Observable property overrides
- Semantic contract mutations

### **Architecture Review:**
- New patterns without semantic anchoring
- Technical optimizations affecting semantics
- Cross-domain semantic violations
- Formula modifications for performance

---

## 🌟 **The CAL Promise**

**By following this governance, we guarantee:**

1. **Methodology Fidelity** - CAL always reflects cormorant foraging semantics
2. **Observable Behavior** - Decisions based on direct observation, not heuristics
3. **Predictable Execution** - Same semantic input → same semantic output
4. **Maintainable Codebase** - Semantic meaning self-documents
5. **Extensible Foundation** - New features preserve semantic anchors

**CAL is not just a language - it's a semantic contract with the methodology.**

---

*Established: January 14, 2026*
*Authority: Cormorant Foraging Methodology + Semantic Anchoring Breakthrough*
*Enforcement: Mandatory for all CAL Runtime development*
*Extends: SEMANTIC_ANCHORING_GOVERNANCE.md*
