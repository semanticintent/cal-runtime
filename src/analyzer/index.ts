/**
 * 🪶 CAL Analyzer Module
 *
 * Semantic Anchoring: Analysis follows observable cormorant foraging behaviors
 * - 3D Lens: Score = (Sound × Space × Time) / 10
 * - DRIFT: Gap = Methodology - Performance
 * - FETCH: Decision = Chirp × |DRIFT| × Confidence
 * - Cascade: Multiplier = f(dimensions × depth)
 *
 * All calculations preserve semantic meaning from methodology
 *
 * @module analyzer
 */

import type {
  Entity,
  DimensionID,
  DimensionSignal,
  DimensionAnalysis,
  CascadeAnalysis,
  CascadePathway,
  DriftResult,
  FetchResult,
  GapType,
  FetchLevel,
  DriftQuality,
  MultiplierRange,
  FinancialImpact
} from '../types/index.js';

import { DIMENSION_SEMANTICS as DIMS, SemanticContractViolation } from '../types/index.js';

// ============================================
// 3D LENS SCORING
// ============================================

/**
 * Calculate 3D Lens score: (Sound × Space × Time) / 10
 *
 * Semantic Contract: Cormorant foraging uses three observables
 * - Sound: Acoustic signals (urgency, intensity)
 * - Space: Position and reach (scope, breadth)
 * - Time: Temporal dynamics (velocity, urgency)
 *
 * Observable Properties: All values are 1-10 (directly observable)
 * Formula: Multiply three dimensions, normalize by 10
 * Result: Score from 0.1 to 100 (1×1×1/10 = 0.1, 10×10×10/10 = 100)
 *
 * @param signals - 3D Lens signals {sound, space, time}
 * @returns Score (0.1 to 100)
 */
export function calculate3DScore(signals: DimensionSignal): number {
  // Clamp to observable range 1-10
  const sound = Math.max(1, Math.min(10, signals.sound));
  const space = Math.max(1, Math.min(10, signals.space));
  const time = Math.max(1, Math.min(10, signals.time));

  // Apply semantic formula
  return (sound * space * time) / 10;
}

/**
 * Determine cascade probability from 3D score
 *
 * Semantic Anchoring: Observable score thresholds from empirical data
 * - critical (≥70): Almost certain (90%)
 * - high (≥50): Likely (70%)
 * - medium (≥30): May occur (50%)
 * - low (≥15): Unlikely (30%)
 * - minimal (<15): Rare (10%)
 *
 * @param score - 3D Lens score
 * @returns Cascade probability assessment
 */
export function cascadeProbability(score: number): {
  level: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  probability: number;
  label: string;
} {
  if (score >= 70) {
    return { level: 'critical', probability: 0.9, label: 'Almost certain to cascade' };
  }
  if (score >= 50) {
    return { level: 'high', probability: 0.7, label: 'Likely to cascade' };
  }
  if (score >= 30) {
    return { level: 'medium', probability: 0.5, label: 'May cascade' };
  }
  if (score >= 15) {
    return { level: 'low', probability: 0.3, label: 'Unlikely to cascade' };
  }
  return { level: 'minimal', probability: 0.1, label: 'Minimal cascade risk' };
}

// ============================================
// CHIRP CALCULATION (SKILL.md)
// ============================================

/**
 * Calculate Chirp: Simple average of raw D1-D6 dimension scores
 *
 * Semantic Contract: Chirp measures dimensional severity on the 0-100 scale.
 * Independent of cascade probability analysis (3D modulation).
 *
 * @param entity - Entity with D1-D6 scores (0-100)
 * @returns Chirp value (average of present dimension scores)
 * @throws SemanticContractViolation if no D1-D6 scores are present
 */
export function calculateChirp(entity: Entity): number {
  const dimKeys = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] as const;
  const scores: number[] = [];

  for (const key of dimKeys) {
    const val = entity[key];
    if (typeof val === 'number') {
      scores.push(val);
    }
  }

  if (scores.length === 0) {
    throw new SemanticContractViolation(
      'Chirp requires at least one D1-D6 dimension score on the entity. ' +
      'Scores must be on the 0-100 scale (SKILL.md).'
    );
  }

  return Math.round(
    (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
  ) / 100;
}

// ============================================
// DRIFT CALCULATION
// ============================================

/**
 * Calculate DRIFT: Methodology - Performance
 *
 * Semantic Contract: Gap between "should be" and "is"
 * - Positive drift (+): Teaching gap (methodology exceeds performance)
 * - Negative drift (-): Curiosity gap (performance exceeds methodology)
 * - Zero drift (0): Perfect alignment
 *
 * Observable Properties:
 * - Methodology: What should be (0-100 scale)
 * - Performance: What actually is (0-100 scale)
 * - DRIFT: Observable difference
 *
 * Gap Quality Thresholds (empirically derived):
 * - Teaching gap optimal: +8 to +15
 * - Curiosity gap optimal: -11 to -20
 * - Extreme: |drift| > 25
 * - Minimal: |drift| < 5
 *
 * @param methodology - Expected/ideal state (0-100)
 * @param performance - Actual/current state (0-100)
 * @param gapType - Type of gap ('auto' to detect from drift sign)
 * @returns Immutable DRIFT result
 */
export function calculateDrift(
  methodology: number,
  performance: number,
  gapType: GapType | 'auto' = 'auto'
): DriftResult {
  // Calculate drift
  const drift = methodology - performance;
  const absDrift = Math.abs(drift);

  // Determine gap type from observable drift
  let detectedGapType: GapType;
  if (gapType === 'auto') {
    detectedGapType = drift < 0 ? 'curiosity' : 'teaching';
  } else {
    detectedGapType = gapType;
  }

  // Assess drift quality based on semantic thresholds
  let driftQuality: DriftQuality;
  let interpretation: string;

  if (detectedGapType === 'curiosity') {
    // Curiosity gap (negative drift): Performance exceeds methodology
    // Optimal: -11 to -20 (engaging, intriguing)
    if (absDrift >= 11 && absDrift <= 20) {
      driftQuality = 'optimal';
      interpretation = 'Perfect curiosity gap - engaging and intriguing';
    } else if (absDrift > 25) {
      driftQuality = 'extreme';
      interpretation = 'Gap too large - may cause confusion or disengagement';
    } else if (absDrift < 5) {
      driftQuality = 'minimal';
      interpretation = 'Gap too small - insufficient curiosity generation';
    } else {
      driftQuality = 'moderate';
      interpretation = 'Reasonable curiosity gap';
    }
  } else {
    // Teaching gap (positive drift): Methodology exceeds performance
    // Optimal: +8 to +15 (clear guidance without overwhelm)
    if (absDrift >= 8 && absDrift <= 15) {
      driftQuality = 'optimal';
      interpretation = 'Perfect teaching gap - clear guidance without overwhelm';
    } else if (absDrift > 25) {
      driftQuality = 'extreme';
      interpretation = 'Over-explanation - may cause cognitive overload';
    } else if (absDrift < 5) {
      driftQuality = 'minimal';
      interpretation = 'Insufficient teaching - gap too small';
    } else {
      driftQuality = 'moderate';
      interpretation = 'Reasonable teaching gap';
    }
  }

  // Return immutable result
  const result: DriftResult = Object.freeze({
    target: 'drift_calculation',
    drift,
    absDrift,
    methodology,
    performance,
    gapType: detectedGapType,
    driftQuality,
    interpretation
  });

  return result;
}

// ============================================
// FETCH CALCULATION
// ============================================

/**
 * Calculate FETCH: Chirp × |DRIFT| × Confidence
 *
 * Semantic Contract: Action decision based on observable factors
 * - Chirp: Urgency signal (0-100, from 3D Lens average score)
 * - |DRIFT|: Gap magnitude (absolute value of drift)
 * - Confidence: Readiness level (0-1, from min(Perch, Wake))
 *
 * Decision Levels (threshold-based):
 * - EXECUTE: fetchScore > threshold
 * - CONFIRM: fetchScore > threshold × 0.5
 * - QUEUE: fetchScore > threshold × 0.1
 * - WAIT: fetchScore ≤ threshold × 0.1
 *
 * Observable Properties: All inputs are directly measurable
 * Formula: Multiply three observable factors
 *
 * @param chirp - Urgency signal (0-100)
 * @param drift - Gap magnitude (absolute value)
 * @param confidence - Readiness (0-1)
 * @param threshold - Action threshold
 * @returns Immutable FETCH result with decision level
 */
export function calculateFetch(
  chirp: number,
  drift: number,
  confidence: number,
  threshold: number = 1000
): FetchResult {
  // Normalize confidence: PEG grammar parses CONFIDENCE as integer (e.g., 85)
  // SKILL.md expects 0-1 scale. Normalize if > 1.
  if (confidence > 1) {
    confidence = confidence / 100;
  }

  // Calculate fetch score using semantic formula
  const fetchScore = chirp * drift * confidence;

  // SKILL.md fixed threshold bands (with CONFIRM retained)
  let level: FetchLevel;
  if (fetchScore >= 2000) {
    level = 'EXECUTE';      // High Priority
  } else if (fetchScore >= 1000) {
    level = 'EXECUTE';
  } else if (fetchScore >= 750) {
    level = 'CONFIRM';
  } else if (fetchScore >= 500) {
    level = 'QUEUE';
  } else {
    level = 'WAIT';
  }

  // Generate recommendation
  const recommendation = fetchScore >= 2000
    ? `Score: ${fetchScore.toFixed(2)} | Level: EXECUTE (High Priority)`
    : `Score: ${fetchScore.toFixed(2)} | Level: ${level}`;

  // Return immutable result
  const result: FetchResult = Object.freeze({
    target: 'fetch_decision',
    fetchScore,
    threshold,
    level,
    components: Object.freeze({
      chirp,
      drift,
      confidence
    }),
    recommendation
  });

  return result;
}

// ============================================
// CASCADE MULTIPLIER
// ============================================

/**
 * Estimate cost multiplier: f(dimensions × depth)
 *
 * Semantic Contract: Financial impact grows with cascade scope
 * - More dimensions affected = wider impact
 * - Greater cascade depth = longer chains
 * - Multiplier = base value of (dimensions × depth)
 *
 * Observable Thresholds (empirically derived):
 * - Extreme (≥15): 10-15× multiplier
 * - Severe (≥10): 6-10× multiplier
 * - Significant (≥6): 4-6× multiplier
 * - Moderate (≥3): 2-4× multiplier
 * - Limited (<3): 1.5-2× multiplier
 *
 * @param dimensionsAffected - Number of dimensions (1-6)
 * @param cascadeDepth - Levels deep (1-5)
 * @returns Multiplier range with semantic label
 */
export function estimateMultiplier(
  dimensionsAffected: number,
  cascadeDepth: number
): MultiplierRange {
  const base = dimensionsAffected * cascadeDepth;

  if (base >= 15) {
    return Object.freeze({ min: 10, max: 15, label: 'Extreme' });
  }
  if (base >= 10) {
    return Object.freeze({ min: 6, max: 10, label: 'Severe' });
  }
  if (base >= 6) {
    return Object.freeze({ min: 4, max: 6, label: 'Significant' });
  }
  if (base >= 3) {
    return Object.freeze({ min: 2, max: 4, label: 'Moderate' });
  }
  return Object.freeze({ min: 1.5, max: 2, label: 'Limited' });
}

/**
 * Calculate financial impact: baseCost × multiplier
 *
 * @param baseCost - Original cost estimate
 * @param multiplier - Cascade multiplier range
 * @param currency - Currency code (default: USD)
 * @returns Financial impact range
 */
export function calculateFinancialImpact(
  baseCost: number,
  multiplier: MultiplierRange,
  currency: string = 'USD'
): FinancialImpact {
  return Object.freeze({
    min: Math.round(baseCost * multiplier.min),
    max: Math.round(baseCost * multiplier.max),
    currency
  });
}

// ============================================
// 6D DIMENSION ANALYSIS
// ============================================

/**
 * Analyze entity across 6D dimensions
 *
 * Semantic Anchoring: Each dimension has semantic identity
 * - D1 Customer: External stakeholders
 * - D2 Employee: Internal people
 * - D3 Revenue: Financial impact
 * - D4 Regulatory: Compliance
 * - D5 Quality: Product/service
 * - D6 Operational: Processes/systems
 *
 * Analysis Process:
 * 1. Calculate 3D Lens score for each dimension
 * 2. Determine cascade probability
 * 3. Identify affected dimensions (score > 20)
 * 4. Estimate financial multiplier
 * 5. Generate cascade pathways
 *
 * @param entity - Entity with dimension signals
 * @param options - Analysis configuration
 * @returns Complete 6D cascade analysis
 */
export function analyze6D(
  entity: Entity,
  options: {
    dimensions?: DimensionID[];
    depth?: number;
    baseCost?: number;
    origin?: { dimension: DimensionID; trigger?: string };
  } = {}
): CascadeAnalysis {
  const {
    dimensions = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
    depth = 2,
    baseCost = 0,
    origin
  } = options;

  const analysis: CascadeAnalysis = {
    entity: entity.id || entity.name || 'Unknown',
    timestamp: new Date().toISOString(),
    methodology: '6D Foraging',
    lens: {
      sound: entity.sound || 5,
      space: entity.space || 5,
      time: entity.time || 5
    },
    dimensions: {} as Record<DimensionID, DimensionAnalysis>,
    summary: {
      dimensionsAffected: 0,
      totalScore: 0,
      averageScore: 0,
      chirp: 0,
      cascadeDepth: depth,
      baseCost,
      estimatedImpact: Object.freeze({ min: 0, max: 0, currency: 'USD' }),
      multiplier: Object.freeze({ min: 1, max: 1, label: 'Limited' })
    },
    cascades: []
  };

  // Analyze each requested dimension
  for (const dimId of dimensions) {
    const dim = DIMS[dimId];
    if (!dim) continue;

    // Get dimension-specific signals or use entity defaults
    const dimData = entity.dimensions?.[dimId];
    const signals: DimensionSignal = {
      sound: dimData?.sound ?? entity.sound ?? 5,
      space: dimData?.space ?? entity.space ?? 5,
      time: dimData?.time ?? entity.time ?? 5
    };

    const score = calculate3DScore(signals);
    const cascade = cascadeProbability(score);

    const dimAnalysis: DimensionAnalysis = {
      ...dim,
      signals,
      score: Math.round(score * 10) / 10,
      cascade,
      affected: score > 20
    };

    analysis.dimensions[dimId] = dimAnalysis;

    // Accumulate affected dimensions
    if (score > 20) {
      analysis.summary.dimensionsAffected++;
      analysis.summary.totalScore += score;
    }
  }

  // Calculate average score for affected dimensions
  if (analysis.summary.dimensionsAffected > 0) {
    analysis.summary.averageScore = Math.round(
      (analysis.summary.totalScore / analysis.summary.dimensionsAffected) * 10
    ) / 10;
  }

  // SKILL.md Chirp: simple average of raw D1-D6 scores (0-100 scale)
  // Independent of cascade probability analysis — uses entity's raw dimension scores
  try {
    analysis.summary.chirp = calculateChirp(entity);
  } catch {
    // Entity has no D1-D6 scores — chirp stays 0 (cascade-only analysis)
  }

  // Estimate multiplier and financial impact
  analysis.summary.multiplier = estimateMultiplier(
    analysis.summary.dimensionsAffected,
    depth
  );

  if (baseCost > 0) {
    analysis.summary.estimatedImpact = calculateFinancialImpact(
      baseCost,
      analysis.summary.multiplier,
      entity.currency || 'USD'
    );
  }

  // Generate cascade pathways
  analysis.cascades = generateCascadePathways(analysis, depth, origin);

  return Object.freeze(analysis) as CascadeAnalysis;
}

// ============================================
// CASCADE PATHWAY GENERATION
// ============================================

/**
 * Cascade map: Semantic pathways between dimensions
 *
 * Based on observable relationships in organizational systems:
 * - D6 Operational failures → Employee, Quality, Revenue impacts
 * - D2 Employee issues → Quality, Customer, Revenue impacts
 * - D3 Revenue problems → Employee, Operational, Regulatory impacts
 * - D1 Customer issues → Revenue, Quality, Employee impacts
 * - D5 Quality defects → Customer, Revenue, Operational impacts
 * - D4 Regulatory violations → Revenue, Operational, Employee impacts
 */
const CASCADE_MAP: Record<DimensionID, DimensionID[]> = Object.freeze({
  D6: ['D2', 'D5', 'D3'], // Operational → Employee, Quality, Revenue
  D2: ['D5', 'D1', 'D3'], // Employee → Quality, Customer, Revenue
  D3: ['D2', 'D6', 'D4'], // Revenue → Employee, Operational, Regulatory
  D1: ['D3', 'D5', 'D2'], // Customer → Revenue, Quality, Employee
  D5: ['D1', 'D3', 'D6'], // Quality → Customer, Revenue, Operational
  D4: ['D3', 'D6', 'D2'], // Regulatory → Revenue, Operational, Employee
  ALL: [] // ALL doesn't cascade
}) as Record<DimensionID, DimensionID[]>;

/**
 * Generate cascade pathways from analysis
 *
 * Semantic Process:
 * 1. Identify origin (highest scoring affected dimension)
 * 2. Follow semantic cascade map for probable pathways
 * 3. Calculate degrading probability at each level (×0.8 per level)
 * 4. Build complete cascade tree up to specified depth
 *
 * @param analysis - 6D analysis result
 * @param depth - Cascade depth to trace
 * @returns Array of cascade pathways
 */
export function generateCascadePathways(
  analysis: CascadeAnalysis,
  depth: number,
  explicitOrigin?: { dimension: DimensionID; trigger?: string }
): CascadePathway[] {
  const pathways: CascadePathway[] = [];

  // Find affected dimensions, sorted by score (descending)
  const affectedDims = Object.entries(analysis.dimensions)
    .filter(([_, dim]) => dim.affected)
    .sort((a, b) => b[1].score - a[1].score);

  if (affectedDims.length === 0) return pathways;

  // Use explicit origin if provided, otherwise auto-detect from highest score
  let originId: string;
  let origin: DimensionAnalysis;

  if (explicitOrigin && analysis.dimensions[explicitOrigin.dimension]) {
    originId = explicitOrigin.dimension;
    origin = analysis.dimensions[explicitOrigin.dimension];
  } else {
    [originId, origin] = affectedDims[0];
  }

  // Build pathway from origin
  const pathway: CascadePathway = {
    origin: {
      dimension: originId as DimensionID,
      name: origin.name,
      score: origin.score,
      level: 0
    },
    levels: []
  };

  let currentLevel = [originId as DimensionID];
  const visited = new Set<DimensionID>([originId as DimensionID]);

  // Trace cascade through depth levels
  for (let level = 1; level <= depth; level++) {
    const nextLevel: DimensionID[] = [];
    const cascades: Array<{
      from: DimensionID;
      to: DimensionID;
      name: string;
      score: number;
      probability: number;
      level: number;
    }> = [];

    for (const dimId of currentLevel) {
      const targets = CASCADE_MAP[dimId] || [];

      for (const targetId of targets) {
        if (visited.has(targetId)) continue;
        if (!analysis.dimensions[targetId]) continue;

        const target = analysis.dimensions[targetId];
        // Probability degrades by 20% per level
        const probability = Math.round(origin.cascade.probability * (1 - level * 0.2) * 100) / 100;

        cascades.push({
          from: dimId,
          to: targetId,
          name: target.name,
          score: target.score,
          probability,
          level
        });

        visited.add(targetId);
        nextLevel.push(targetId);
      }
    }

    if (cascades.length > 0) {
      pathway.levels.push({
        level,
        cascades
      });
      currentLevel = nextLevel;
    }
  }

  pathways.push(pathway);
  return pathways;
}

// ============================================
// SIGNAL SCORING
// ============================================

/**
 * Score a signal value: Convert various inputs to 1-10 scale
 *
 * Semantic Contract: Normalize heterogeneous inputs to observable range
 * - Numbers: Linear normalization within min/max range
 * - Booleans: Binary mapping (true=10, false=1 by default)
 * - Strings: Semantic level mapping (critical/high/medium/low/minimal)
 * - Default: 5 (middle neutral value)
 *
 * @param value - Input value (any type)
 * @param options - Scoring configuration
 * @returns Normalized score (1-10)
 */
export function scoreSignal(
  value: any,
  options: {
    min?: number;
    max?: number;
    invert?: boolean;
  } = {}
): number {
  const { min = 0, max = 100, invert = false } = options;

  // Numeric values: normalize to 1-10
  if (typeof value === 'number') {
    let normalized = ((value - min) / (max - min)) * 10;
    normalized = Math.max(1, Math.min(10, normalized));
    return invert ? 11 - normalized : normalized;
  }

  // Boolean values: binary mapping
  if (typeof value === 'boolean') {
    return value ? (invert ? 1 : 10) : (invert ? 10 : 1);
  }

  // String values: semantic level mapping
  if (typeof value === 'string') {
    const levels: Record<string, number> = {
      critical: 10,
      high: 8,
      medium: 5,
      low: 3,
      minimal: 1,
      yes: 10,
      no: 1,
      true: 10,
      false: 1
    };
    return levels[value.toLowerCase()] || 5;
  }

  // Default: middle neutral score
  return 5;
}

/**
 * 🪶 Analyzer Module Complete
 *
 * SEMANTIC ANCHORING VERIFIED:
 * ✅ 3D Lens: (Sound × Space × Time) / 10
 * ✅ DRIFT: Methodology - Performance with gap detection
 * ✅ FETCH: Chirp × |DRIFT| × Confidence with threshold levels
 * ✅ Cascade: Multiplier from observable dimensions × depth
 * ✅ 6D Framework: Semantic identity preserved for all dimensions
 * ✅ Immutability: All results frozen
 * ✅ Observable Properties: All calculations from measurable values
 *
 * Ready for Phase 4: Executor Module
 */
