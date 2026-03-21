/**
 * 🪶 CAL Runtime Type Definitions
 *
 * Cormorant Agentic Language - Semantic Type System
 *
 * SEMANTIC ANCHORING: These types encode the Cormorant Foraging Methodology
 * into the TypeScript type system. Each type preserves semantic meaning from
 * observable cormorant behaviors and methodology principles.
 *
 * KEY PRINCIPLES:
 * - Keywords are semantic (FORAGE, DRIFT, FETCH = cormorant behaviors)
 * - Formulas are contracts (Sound × Space × Time, DRIFT, Fetch)
 * - Dimensions have identity (D1-D6 = cascade domains)
 * - Observable properties drive behavior
 * - Immutability protects semantic intent
 *
 * @module types
 * @semantic-authority Cormorant Foraging Methodology
 */

// ============================================
// SEMANTIC KEYWORDS & IDENTIFIERS
// ============================================

/**
 * CAL Keywords - Semantic Cormorant Behaviors
 *
 * Each keyword represents an OBSERVABLE cormorant foraging behavior:
 * - FORAGE: Search for food (cascade signals)
 * - DIVE: Deep underwater analysis (cascade traversal)
 * - DRIFT: Gap measurement (teaching vs curiosity)
 * - FETCH: Decision to retrieve (action readiness)
 * - PERCH: Observation position (monitoring)
 * - LISTEN: Monitor signals (sound dimension)
 * - WAKE: Time-based triggers (temporal awareness)
 * - CHIRP: Alert/communicate (signal emission)
 * - TRACE: Follow pathways (cascade tracking)
 * - SURFACE: Return results (bring to surface)
 *
 * SEMANTIC CONTRACT: These are not arbitrary technical terms.
 * Each carries methodology meaning that must be preserved.
 */
export type CALKeyword =
  | 'forage'
  | 'dive'
  | 'drift'
  | 'fetch'
  | 'perch'
  | 'listen'
  | 'wake'
  | 'chirp'
  | 'trace'
  | 'watch'
  | 'surface';

/**
 * 6D Dimension Identifiers - Semantic Cascade Domains
 *
 * Each dimension represents a distinct cascade domain with semantic identity:
 * - D1: Customer (External stakeholders)
 * - D2: Employee (Internal people)
 * - D3: Revenue (Financial impact)
 * - D4: Regulatory (Compliance)
 * - D5: Quality (Product/service)
 * - D6: Operational (Processes)
 * - ALL: All dimensions collectively
 *
 * SEMANTIC CONTRACT: Dimensions are NOT mere indexes.
 * Each has methodology meaning and cascade behavior patterns.
 */
export type DimensionID = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'ALL';

/**
 * Gap Types - Semantic DRIFT Categories
 *
 * SEMANTIC MEANING:
 * - curiosity: Performance exceeds methodology (reveal less, intrigue)
 * - teaching: Methodology exceeds performance (explain more, clarify)
 *
 * DETERMINATION: Based on observable drift direction, not heuristics.
 */
export type GapType = 'curiosity' | 'teaching';

/**
 * DRIFT Quality Levels - Semantic Gap Assessment
 *
 * SEMANTIC RANGES:
 * - optimal: Gap is in ideal range for engagement
 * - moderate: Gap is reasonable but not perfect
 * - minimal: Gap too small for effective adaptation
 * - extreme: Gap too large, risks confusion/overload
 */
export type DriftQuality = 'optimal' | 'moderate' | 'minimal' | 'extreme';

/**
 * Fetch Decision Levels - Semantic Readiness States
 *
 * SEMANTIC MEANING:
 * - EXECUTE: Act immediately (score > threshold)
 * - CONFIRM: Verify before acting (score > threshold × 0.5)
 * - QUEUE: Schedule for later (score > threshold × 0.1)
 * - WAIT: Continue monitoring (score ≤ threshold × 0.1)
 *
 * DETERMINATION: Based on observable score vs semantic thresholds.
 */
export type FetchLevel = 'EXECUTE' | 'CONFIRM' | 'QUEUE' | 'WAIT';

/**
 * Cascade Levels - Semantic Probability Categories
 *
 * SEMANTIC RANGES (based on dimension score):
 * - minimal: < 15 (10% probability)
 * - low: 15-29 (30% probability)
 * - medium: 30-49 (50% probability)
 * - high: 50-69 (70% probability)
 * - critical: ≥ 70 (90% probability)
 */
export type CascadeLevel = 'minimal' | 'low' | 'medium' | 'high' | 'critical';

// ============================================
// AST TYPES (Parser Output)
// ============================================

/**
 * CAL Program - Root AST Node
 *
 * SEMANTIC MEANING: Complete CAL source file parsed into structured form,
 * preserving all semantic meaning from methodology keywords.
 */
export interface Program {
  type: 'Program';
  language: 'Cormorant Agentic Language';
  version: string;
  statements: Statement[];
}

/**
 * Statement - Union of All CAL Statements
 *
 * SEMANTIC CONTRACT: Each statement type represents a cormorant behavior.
 * Parser must preserve semantic keyword meaning in AST.
 */
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
  | WatchStatement
  | SurfaceStatement;

/**
 * FORAGE Statement - Search for Cascade Signals
 *
 * SEMANTIC INTENT: Cormorant searches for food (cascade signals).
 *
 * OBSERVABLE PROPERTIES:
 * - target: What to search (e.g., "entities")
 * - where: Observable filter conditions
 * - across: Which dimensions to analyze
 * - depth: How many cascade levels to traverse
 * - surface: Where to output results
 */
export interface ForageStatement {
  type: 'Forage';
  target: string;
  where?: Condition[];
  across?: Dimension[];
  depth?: number;
  surface?: string;
}

/**
 * DIVE Statement - Deep Cascade Analysis
 *
 * SEMANTIC INTENT: Cormorant dives deep underwater (deep cascade analysis).
 *
 * OBSERVABLE PROPERTIES:
 * - target: What to analyze
 * - when: Observable condition for analysis
 * - trace: What to track (e.g., "cascade")
 * - emit: Where to output analysis
 */
export interface DiveStatement {
  type: 'Dive';
  target: string;
  when?: Condition[];
  trace?: string;
  emit?: string;
}

/**
 * DRIFT Statement - Gap Measurement
 *
 * SEMANTIC INTENT: Measure gap between methodology (should-be) and
 * performance (is) for adaptive teaching or curiosity generation.
 *
 * OBSERVABLE PROPERTIES:
 * - target: What to measure gap for
 * - methodology: Expected demonstration level (0-100)
 * - performance: Actual performance level (0-100)
 * - gap: Optional semantic override (default: auto-detect)
 *
 * SEMANTIC FORMULA: DRIFT = Methodology - Performance
 */
export interface DriftStatement {
  type: 'Drift';
  target: string;
  methodology: number;
  performance: number;
  gap?: string;
}

/**
 * FETCH Statement - Action Decision
 *
 * SEMANTIC INTENT: Decide when to fetch (act) based on readiness score.
 *
 * OBSERVABLE PROPERTIES:
 * - target: What to fetch
 * - threshold: Observable readiness boundary
 * - confidence: Optional readiness modifier (0-100)
 * - onExecute: Action when score > threshold
 * - onConfirm: Action when score > threshold × 0.5
 * - onQueue: Action when score > threshold × 0.1
 * - onWait: Action when score ≤ threshold × 0.1
 *
 * SEMANTIC FORMULA: Fetch = Chirp × |DRIFT| × Confidence
 */
export interface FetchStatement {
  type: 'Fetch';
  target: string;
  threshold: number;
  confidence?: number;
  onExecute?: Statement;
  onConfirm?: Statement;
  onQueue?: Statement;
  onWait?: Statement;
}

/**
 * PERCH Statement - Observation Position
 *
 * SEMANTIC INTENT: Cormorant perches to observe (monitoring position).
 */
export interface PerchStatement {
  type: 'Perch';
  target: TargetSpec;
  listen?: Signal[];
  wake?: Duration;
  chirp?: string;
}

/**
 * LISTEN Statement - Monitor Signals
 *
 * SEMANTIC INTENT: Listen for signals (sound dimension monitoring).
 */
export interface ListenStatement {
  type: 'Listen';
  signals: Signal[];
}

/**
 * WAKE Statement - Time Trigger
 *
 * SEMANTIC INTENT: Wake after time (temporal trigger).
 */
export interface WakeStatement {
  type: 'Wake';
  after: Duration;
  action?: Statement;
}

/**
 * CHIRP Statement - Alert Emission
 *
 * SEMANTIC INTENT: Cormorant makes chirp call (signal emission).
 */
export interface ChirpStatement {
  type: 'Chirp';
  alert: string;
  message?: string;
}

/**
 * TRACE Statement - Follow Cascade Pathways
 *
 * SEMANTIC INTENT: Trace cascade pathways through dimensions.
 */
export interface TraceStatement {
  type: 'Trace';
  target: string;
  from?: string;
}

/**
 * WATCH Statement - Continuous Condition Monitoring
 *
 * SEMANTIC INTENT: Cormorant watches (sustained observation over time).
 * Extends FORAGE with temporal persistence: "keep sensing this condition."
 *
 * OBSERVABLE PROPERTIES:
 * - target: Named trigger to monitor
 * - when: Condition that fires the trigger
 */
export interface WatchStatement {
  type: 'Watch';
  target: string;
  when: Condition[];
}

/**
 * SURFACE Statement - Return Results
 *
 * SEMANTIC INTENT: Bring results to surface (output).
 * Optional scheduledDate: resurface for reassessment on this date.
 */
export interface SurfaceStatement {
  type: 'Surface';
  output: string;
  format?: string;
  scheduledDate?: string | null;
}

// ============================================
// AST SUPPORTING TYPES
// ============================================

/**
 * Condition - Observable Filter Condition
 *
 * SEMANTIC MEANING: Filter based on observable properties.
 */
export interface Condition {
  left: string;
  operator: ComparisonOperator;
  right: ConditionValue;
}

export type ComparisonOperator = '>' | '>=' | '<' | '<=' | '=' | '!=';

export type ConditionValue = string | number | Duration;

/**
 * Dimension - 6D Dimension Reference with Semantic Identity
 *
 * SEMANTIC CONTRACT: Preserves both ID and semantic name.
 */
export interface Dimension {
  id: DimensionID;
  name: string;
}

/**
 * Signal - Sound Dimension Signal
 */
export interface Signal {
  type: 'signal';
  name: string;
}

/**
 * Duration - Temporal Specification
 */
export interface Duration {
  value: number;
  unit: 'days' | 'hours' | 'minutes' | 'weeks' | 'months';
}

/**
 * Target Specification
 */
export type TargetSpec =
  | { type: 'simple'; name: string }
  | { type: 'keyed'; key: string; value: string };

// ============================================
// ACTION PLAN TYPES (Executor Input)
// ============================================

/**
 * Action Plan - Executable Semantic Contract
 *
 * SEMANTIC MEANING: Compiled plan preserving all methodology semantics
 * from parsed CAL source. Ready for execution without semantic loss.
 */
export interface ActionPlan {
  type: 'ActionPlan';
  generated: string;
  methodology: '6D Foraging';  // Semantic anchor
  lens: ThreeDLens;
  dimensions: DimensionID[];
  actions: Action[];
}

/**
 * 3D Lens - Observable Reality Dimensions
 *
 * SEMANTIC MEANING:
 * - Sound: Observable urgency/intensity signals
 * - Space: Observable scope/reach positions
 * - Time: Observable velocity/timing triggers
 */
export interface ThreeDLens {
  sound: any[];  // ChirpIQX signals
  space: any[];  // PerchIQX positions
  time: any[];   // WakeIQX triggers
}

/**
 * Action - Union of Executable Actions
 *
 * SEMANTIC CONTRACT: Each action preserves keyword meaning.
 * Executor must honor semantic intent without override.
 */
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
  | WatchAction
  | OutputAction;

/**
 * Query Action - FORAGE Execution
 *
 * SEMANTIC INTENT: Search for cascade signals with filters.
 */
export interface QueryAction {
  action: 'query';  // Semantic: FORAGE
  target: string;
  filters: any[];
  dimensions: Dimension[];
  cascadeDepth: number;
  output: string;
}

/**
 * Analyze Action - DIVE Execution
 *
 * SEMANTIC INTENT: Deep cascade analysis.
 */
export interface AnalyzeAction {
  action: 'analyze';  // Semantic: DIVE
  target: string;
  condition: any;
  trace: string;
  output: string;
}

/**
 * DRIFT Action - Gap Measurement Execution
 *
 * SEMANTIC INTENT: Measure gap for adaptive behavior.
 *
 * SEMANTIC FORMULA: DRIFT = Methodology - Performance
 */
export interface DriftAction {
  action: 'drift';  // Semantic: DRIFT
  target: string;
  methodology: number;
  performance: number;
  gapType: 'curiosity' | 'teaching' | 'auto';
}

/**
 * Fetch Action - Action Decision Execution
 *
 * SEMANTIC INTENT: Decide when to act based on readiness.
 *
 * SEMANTIC FORMULA: Fetch = Chirp × |DRIFT| × Confidence
 */
export interface FetchAction {
  action: 'fetch';  // Semantic: FETCH
  target: string;
  threshold: number;
  confidence: number | null;
  onExecute: Action | null;
  onConfirm: Action | null;
  onQueue: Action | null;
  onWait: Action | null;
}

/**
 * Observe Action - PERCH Execution
 */
export interface ObserveAction {
  action: 'observe';  // Semantic: PERCH
  target: TargetSpec;
  signals: Signal[];
  timeout: Duration | null;
  onSignal: string | null;
}

/**
 * Monitor Action - LISTEN Execution
 */
export interface MonitorAction {
  action: 'monitor';  // Semantic: LISTEN
  signals: Signal[];
}

/**
 * Schedule Action - WAKE Execution
 */
export interface ScheduleAction {
  action: 'schedule';  // Semantic: WAKE
  delay: Duration;
  then: Action | null;
}

/**
 * Alert Action - CHIRP Execution
 */
export interface AlertAction {
  action: 'alert';  // Semantic: CHIRP
  type: string;
  message: string | null;
}

/**
 * Trace Cascade Action - TRACE Execution
 */
export interface TraceCascadeAction {
  action: 'traceCascade';  // Semantic: TRACE
  target: string;
  from: string | null;
}

/**
 * Watch Action - WATCH Execution
 * Semantic: Cormorant watches (continuous condition monitoring)
 */
export interface WatchAction {
  action: 'watch';  // Semantic: WATCH
  target: string;
  condition: Condition[];
}

/**
 * Output Action - SURFACE Execution
 */
export interface OutputAction {
  action: 'output';  // Semantic: SURFACE
  data: string;
  format: string;
  scheduledDate?: string | null;
}

// ============================================
// EXECUTION RESULT TYPES (Immutable Outputs)
// ============================================

/**
 * Execution Result - Complete Pipeline Output
 *
 * SEMANTIC CONTRACT: Immutable result preserving all semantic outcomes.
 */
export interface ExecutionResult {
  type: 'ExecutionResult';
  started: string;
  completed: string;
  methodology: string;
  actions: ExecutionAction[];
  outputs: Record<string, any>;
  alerts: any[];
  watchers: any[];
  success: boolean;
  error?: string;
}

export interface ExecutionAction {
  action: string;
  target: any;
  result: 'success' | 'failed';
  data: any;
}

/**
 * DRIFT Result - Immutable Gap Measurement
 *
 * SEMANTIC INTENT: Gap analysis for adaptive teaching/curiosity.
 *
 * OBSERVABLE PROPERTIES:
 * - drift: Observable gap (methodology - performance)
 * - gapType: Semantic type determined by drift direction
 * - driftQuality: Semantic quality assessment
 *
 * SEMANTIC CONTRACT:
 * - gapType MUST match drift direction (drift < 0 → curiosity)
 * - driftQuality MUST match semantic ranges
 * - Result MUST be immutable (Object.freeze)
 */
export type DriftResult = Readonly<{
  target: string;
  drift: number;
  absDrift: number;
  methodology: number;
  performance: number;
  gapType: GapType;
  driftQuality: DriftQuality;
  interpretation: string;
}>;

/**
 * Fetch Result - Immutable Action Decision
 *
 * SEMANTIC INTENT: Action readiness decision based on observable score.
 *
 * OBSERVABLE PROPERTIES:
 * - fetchScore: Chirp × |DRIFT| × Confidence
 * - level: Semantic decision (EXECUTE/CONFIRM/QUEUE/WAIT)
 * - components: Observable parts of formula
 *
 * SEMANTIC CONTRACT:
 * - level MUST match threshold boundaries
 * - fetchScore MUST equal formula calculation
 * - Result MUST be immutable (Object.freeze)
 */
export type FetchResult = Readonly<{
  target: string;
  fetchScore: number;
  threshold: number;
  level: FetchLevel;
  components: Readonly<{
    chirp: number;
    drift: number;
    confidence: number;
  }>;
  recommendation: string;
}>;

// ============================================
// DOMAIN TYPES (6D Framework)
// ============================================

/**
 * Dimension Semantic Identity
 *
 * SEMANTIC CONTRACT: Each dimension has meaning beyond its ID.
 * Must not be treated as mere technical index.
 */
export interface DimensionSemantic {
  id: DimensionID;
  name: string;
  description: string;
  domain: string;
}

/**
 * Dimension Semantic Metadata (Immutable)
 *
 * SEMANTIC ANCHORING: Preserves 6D dimension identity.
 */
export const DIMENSION_SEMANTICS: Readonly<Record<DimensionID, Readonly<DimensionSemantic>>> = Object.freeze({
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
  D3: Object.freeze({
    id: 'D3',
    name: 'Revenue',
    description: 'Financial impact, costs, income',
    domain: 'financial-health'
  }),
  D4: Object.freeze({
    id: 'D4',
    name: 'Regulatory',
    description: 'Compliance, legal, governance',
    domain: 'risk-compliance'
  }),
  D5: Object.freeze({
    id: 'D5',
    name: 'Quality',
    description: 'Product, service, deliverables',
    domain: 'output-excellence'
  }),
  D6: Object.freeze({
    id: 'D6',
    name: 'Operational',
    description: 'Processes, systems, infrastructure',
    domain: 'execution-capacity'
  }),
  ALL: Object.freeze({
    id: 'ALL',
    name: 'All Dimensions',
    description: 'All cascade dimensions collectively',
    domain: 'holistic'
  })
});

/**
 * Dimension Signal - Observable 3D Properties
 *
 * SEMANTIC MEANING:
 * - sound: Urgency/intensity (1-10)
 * - space: Scope/reach (1-10)
 * - time: Velocity/speed (1-10)
 *
 * SEMANTIC FORMULA: Score = (Sound × Space × Time) / 10
 */
export interface DimensionSignal {
  sound: number;
  space: number;
  time: number;
  notes?: string;
}

/**
 * Entity - Observable Analysis Subject
 *
 * SEMANTIC PROPERTIES:
 * - 3D Lens: sound, space, time (observable urgency/scope/velocity)
 * - baseCost: Observable direct financial impact
 * - dimensions: 6D cascade signals
 */
export interface Entity {
  id: string;
  name: string;
  type: string;
  sound: number;      // Observable: urgency (1-10)
  space: number;      // Observable: scope (1-10)
  time: number;       // Observable: velocity (1-10)
  baseCost?: number;  // Observable: direct cost
  currency?: string;
  dimensions?: Partial<Record<DimensionID, DimensionSignal>>;
  [key: string]: any;
}

/**
 * Dimension Analysis - Scored Dimension with Cascade Info
 *
 * SEMANTIC MEANING: Complete analysis of dimension's cascade potential.
 */
export interface DimensionAnalysis {
  id: DimensionID;
  name: string;
  description: string;
  signals: DimensionSignal;
  score: number;  // Semantic formula: (sound × space × time) / 10
  cascade: {
    level: CascadeLevel;
    probability: number;
    label: string;
  };
  affected: boolean;
}

/**
 * Cascade Map - Complete Cascade Analysis
 *
 * SEMANTIC MEANING: Map of all cascade pathways and impacts.
 */
export interface CascadeMap {
  target: string;
  count: number;
  entities: CascadeAnalysis[];
  summary: CascadeSummary;
}

/**
 * Cascade Analysis - Entity Cascade Result
 *
 * SEMANTIC MEANING: Complete cascade analysis for single entity.
 */
export interface CascadeAnalysis {
  entity: string;
  timestamp: string;
  methodology: string;
  lens: {
    sound: number;
    space: number;
    time: number;
  };
  dimensions: Record<string, DimensionAnalysis>;
  summary: EntitySummary;
  cascades: CascadePathway[];
}

/**
 * Entity Summary - Aggregate Cascade Metrics
 */
export interface EntitySummary {
  dimensionsAffected: number;
  totalScore: number;
  averageScore: number;
  cascadeDepth: number;
  baseCost: number;
  estimatedImpact?: FinancialImpact;
  multiplier?: MultiplierRange;
}

/**
 * Cascade Summary - Aggregate Results
 */
export interface CascadeSummary {
  count: number;
  totalDimensionsAffected?: number;
  averageScore: number;
  totalImpact?: {
    min: number;
    max: number;
  };
  criticalCount?: number;
  highCount?: number;
}

/**
 * Cascade Pathway - Multi-Level Cascade Path
 *
 * SEMANTIC MEANING: Observable cascade propagation through dimensions.
 */
export interface CascadePathway {
  origin: {
    dimension: DimensionID;
    name: string;
    score: number;
    level: number;
  };
  levels: CascadeLevel_Path[];
}

export interface CascadeLevel_Path {
  level: number;
  cascades: CascadeLink[];
}

export interface CascadeLink {
  from: DimensionID;
  to: DimensionID;
  name: string;
  score: number;
  probability: number;
  level: number;
}

/**
 * Financial Impact - Observable Cost Cascade
 *
 * SEMANTIC FORMULA:
 * - Multiplier based on (dimensions × depth)
 * - Cascade Cost = Base Cost × Multiplier
 */
export interface FinancialImpact {
  min: number;
  max: number;
  currency?: string;
}

/**
 * Multiplier Range - Semantic Impact Boundaries
 *
 * SEMANTIC RANGES:
 * - 15+:   10-15× (Extreme)
 * - 10-14:  6-10× (Severe)
 * - 6-9:    4-6×  (Significant)
 * - 3-5:    2-4×  (Moderate)
 * - <3:     1.5-2× (Limited)
 */
export interface MultiplierRange {
  min: number;
  max: number;
  label: 'Extreme' | 'Severe' | 'Significant' | 'Moderate' | 'Limited';
}

// ============================================
// ADAPTER INTERFACES
// ============================================

/**
 * Data Adapter - Data Source Interface
 *
 * SEMANTIC MEANING: Abstraction for querying entities.
 */
export interface DataAdapter {
  query(filter: any): Promise<Entity[]>;
  get(id: string): Promise<Entity | null>;
}

/**
 * Alert Adapter - Alert Emission Interface
 *
 * SEMANTIC MEANING: Abstraction for CHIRP signals.
 */
export interface AlertAdapter {
  send(type: string, message: string, data?: any): Promise<void>;
}

// ============================================
// ERROR TYPES
// ============================================

/**
 * Semantic Contract Violation Error
 *
 * SEMANTIC MEANING: Thrown when semantic anchoring is violated.
 */
export class SemanticContractViolation extends Error {
  constructor(message: string) {
    super(`Semantic Contract Violation: ${message}`);
    this.name = 'SemanticContractViolation';
  }
}

/**
 * Parse Error - Syntax Violation
 */
export interface ParseError {
  success: false;
  error: {
    message: string;
    location?: any;
    expected?: any[];
    found?: string;
  };
}

/**
 * Parse Success
 */
export interface ParseSuccess {
  success: true;
  ast: Program;
}

/**
 * Parse Result - Union Type
 */
export type ParseResult = ParseSuccess | ParseError;

/**
 * Compile Result - Full Compilation
 */
export type CompileResult =
  | {
      success: true;
      source: string;
      ast: Program;
      actionPlan: ActionPlan;
    }
  | ParseError;

// ============================================
// TYPE GUARDS (Semantic Validation)
// ============================================

/**
 * Check if keyword is valid CAL keyword
 *
 * SEMANTIC VALIDATION: Ensures semantic keyword preservation.
 */
export function isValidCALKeyword(keyword: string): keyword is CALKeyword {
  const validKeywords: CALKeyword[] = [
    'forage', 'dive', 'drift', 'fetch', 'perch',
    'listen', 'wake', 'chirp', 'trace', 'watch', 'surface'
  ];
  return validKeywords.includes(keyword as CALKeyword);
}

/**
 * Check if action is DRIFT action
 *
 * SEMANTIC TYPE GUARD: Preserves semantic action type.
 */
export function isDriftAction(action: Action): action is DriftAction {
  return action.action === 'drift';
}

/**
 * Check if action is FETCH action
 *
 * SEMANTIC TYPE GUARD: Preserves semantic action type.
 */
export function isFetchAction(action: Action): action is FetchAction {
  return action.action === 'fetch';
}

/**
 * Check if gap type is curiosity
 *
 * SEMANTIC VALIDATION: Observable semantic check.
 */
export function isCuriosityGap(result: DriftResult): boolean {
  return result.gapType === 'curiosity';
}

/**
 * Check if gap type is teaching
 *
 * SEMANTIC VALIDATION: Observable semantic check.
 */
export function isTeachingGap(result: DriftResult): boolean {
  return result.gapType === 'teaching';
}

/**
 * Check if fetch level is EXECUTE
 *
 * SEMANTIC VALIDATION: Observable semantic check.
 */
export function shouldExecute(result: FetchResult): boolean {
  return result.level === 'EXECUTE';
}

/**
 * Check if dimension is valid
 *
 * SEMANTIC VALIDATION: Ensures dimension has semantic identity.
 */
export function isValidDimension(id: string): id is DimensionID {
  return id in DIMENSION_SEMANTICS;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Deep Readonly - Recursive Immutability
 *
 * SEMANTIC CONTRACT: Enforces immutability at all levels.
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Execution Context - Runtime State
 *
 * SEMANTIC MEANING: Mutable state during execution (isolated).
 */
export interface ExecutionContext {
  results: Record<string, any>;
  watchers: any[];
  scheduledTasks: any[];
  executeAction: (action: Action) => Promise<any>;
}

/**
 * 🪶 Type System Complete
 *
 * SEMANTIC ANCHORING VERIFIED:
 * ✅ Keywords are semantic (cormorant behaviors)
 * ✅ Formulas are contracts (preserved in types)
 * ✅ Dimensions have identity (not indexes)
 * ✅ Observable properties throughout
 * ✅ Immutability enforced (Readonly<T>)
 * ✅ Type guards preserve meaning
 * ✅ Validation types included
 *
 * Ready for Phase 2: Parser Module
 */
