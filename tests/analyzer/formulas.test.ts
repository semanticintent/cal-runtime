/**
 * 🪶 Analyzer Formula Tests
 *
 * Validates semantic formulas and contracts
 */

import { describe, it, expect } from 'vitest';
import {
  calculate3DScore,
  cascadeProbability,
  calculateDrift,
  calculateFetch,
  estimateMultiplier,
  calculateFinancialImpact,
  scoreSignal
} from '../../src/analyzer/index.js';

describe('Analyzer - 3D Lens Scoring', () => {
  it('should calculate 3D score: (Sound × Space × Time) / 10', () => {
    // Minimal: 1 × 1 × 1 / 10 = 0.1
    expect(calculate3DScore({ sound: 1, space: 1, time: 1 })).toBe(0.1);

    // Maximum: 10 × 10 × 10 / 10 = 100
    expect(calculate3DScore({ sound: 10, space: 10, time: 10 })).toBe(100);

    // Example: 9 × 8 × 9 / 10 = 64.8
    expect(calculate3DScore({ sound: 9, space: 8, time: 9 })).toBe(64.8);

    // Middle: 5 × 5 × 5 / 10 = 12.5
    expect(calculate3DScore({ sound: 5, space: 5, time: 5 })).toBe(12.5);
  });

  it('should clamp values to 1-10 range', () => {
    // Below range
    expect(calculate3DScore({ sound: 0, space: 0, time: 0 })).toBe(0.1);
    expect(calculate3DScore({ sound: -5, space: -10, time: -1 })).toBe(0.1);

    // Above range
    expect(calculate3DScore({ sound: 15, space: 20, time: 100 })).toBe(100);
  });

  it('should determine cascade probability from score', () => {
    // Critical (≥70)
    const critical = cascadeProbability(75);
    expect(critical.level).toBe('critical');
    expect(critical.probability).toBe(0.9);

    // High (≥50)
    const high = cascadeProbability(55);
    expect(high.level).toBe('high');
    expect(high.probability).toBe(0.7);

    // Medium (≥30)
    const medium = cascadeProbability(35);
    expect(medium.level).toBe('medium');
    expect(medium.probability).toBe(0.5);

    // Low (≥15)
    const low = cascadeProbability(20);
    expect(low.level).toBe('low');
    expect(low.probability).toBe(0.3);

    // Minimal (<15)
    const minimal = cascadeProbability(10);
    expect(minimal.level).toBe('minimal');
    expect(minimal.probability).toBe(0.1);
  });
});

describe('Analyzer - DRIFT Calculation', () => {
  it('should calculate DRIFT: Methodology - Performance', () => {
    // Teaching gap (positive)
    const teaching = calculateDrift(85, 35, 'auto');
    expect(teaching.drift).toBe(50);
    expect(teaching.absDrift).toBe(50);
    expect(teaching.gapType).toBe('teaching');
    expect(teaching.methodology).toBe(85);
    expect(teaching.performance).toBe(35);
  });

  it('should detect curiosity gap (negative drift)', () => {
    // Performance exceeds methodology
    const curiosity = calculateDrift(30, 50, 'auto');
    expect(curiosity.drift).toBe(-20);
    expect(curiosity.absDrift).toBe(20);
    expect(curiosity.gapType).toBe('curiosity');
  });

  it('should assess optimal teaching gap (+8 to +15)', () => {
    const optimal = calculateDrift(45, 35, 'auto');
    expect(optimal.drift).toBe(10);
    expect(optimal.driftQuality).toBe('optimal');
    expect(optimal.interpretation).toContain('Perfect teaching gap');
  });

  it('should assess optimal curiosity gap (-11 to -20)', () => {
    const optimal = calculateDrift(30, 45, 'auto');
    expect(optimal.drift).toBe(-15);
    expect(optimal.driftQuality).toBe('optimal');
    expect(optimal.interpretation).toContain('Perfect curiosity gap');
  });

  it('should detect extreme teaching gap (>25)', () => {
    const extreme = calculateDrift(85, 35, 'auto');
    expect(extreme.absDrift).toBe(50);
    expect(extreme.driftQuality).toBe('extreme');
    expect(extreme.interpretation).toContain('Over-explanation');
  });

  it('should detect minimal gap (<5)', () => {
    const minimal = calculateDrift(52, 50, 'auto');
    expect(minimal.absDrift).toBe(2);
    expect(minimal.driftQuality).toBe('minimal');
  });

  it('should respect manual gap type override', () => {
    const manual = calculateDrift(30, 50, 'teaching');
    expect(manual.drift).toBe(-20);
    expect(manual.gapType).toBe('teaching'); // Override auto-detection
  });

  it('should return immutable result', () => {
    const result = calculateDrift(85, 35);
    expect(Object.isFrozen(result)).toBe(true);
  });
});

describe('Analyzer - FETCH Calculation', () => {
  it('should calculate FETCH: Chirp × |DRIFT| × Confidence', () => {
    // Example from closed-loop pipeline
    const chirp = 64.8; // 3D score
    const drift = 50;   // |DRIFT|
    const confidence = 0.7;
    const threshold = 1000;

    const result = calculateFetch(chirp, drift, confidence, threshold);

    expect(result.fetchScore).toBeCloseTo(2268, 0); // 64.8 × 50 × 0.7
    expect(result.components.chirp).toBe(chirp);
    expect(result.components.drift).toBe(drift);
    expect(result.components.confidence).toBe(confidence);
  });

  it('should determine EXECUTE level (score > threshold)', () => {
    const result = calculateFetch(60, 50, 0.8, 1000);
    expect(result.fetchScore).toBe(2400);
    expect(result.level).toBe('EXECUTE');
  });

  it('should determine CONFIRM level (score > threshold × 0.5)', () => {
    const result = calculateFetch(40, 20, 0.8, 1000);
    expect(result.fetchScore).toBe(640); // Between 500 and 1000
    expect(result.level).toBe('CONFIRM');
  });

  it('should determine QUEUE level (score > threshold × 0.1)', () => {
    const result = calculateFetch(22, 10, 0.5, 1000);
    expect(result.fetchScore).toBe(110); // Between 100 and 500
    expect(result.level).toBe('QUEUE');
  });

  it('should determine WAIT level (score ≤ threshold × 0.1)', () => {
    const result = calculateFetch(10, 5, 0.5, 1000);
    expect(result.fetchScore).toBe(25); // Below 100
    expect(result.level).toBe('WAIT');
  });

  it('should return immutable result', () => {
    const result = calculateFetch(60, 50, 0.8, 1000);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.components)).toBe(true);
  });
});

describe('Analyzer - Cascade Multiplier', () => {
  it('should calculate multiplier from dimensions × depth', () => {
    // Limited (base < 3): 1.5-2×
    const limited = estimateMultiplier(1, 2);
    expect(limited.min).toBe(1.5);
    expect(limited.max).toBe(2);
    expect(limited.label).toBe('Limited');

    // Moderate (base ≥ 3): 2-4×
    const moderate = estimateMultiplier(2, 2);
    expect(moderate.min).toBe(2);
    expect(moderate.max).toBe(4);
    expect(moderate.label).toBe('Moderate');

    // Significant (base ≥ 6): 4-6×
    const significant = estimateMultiplier(3, 2);
    expect(significant.min).toBe(4);
    expect(significant.max).toBe(6);
    expect(significant.label).toBe('Significant');

    // Severe (base ≥ 10): 6-10×
    const severe = estimateMultiplier(5, 2);
    expect(severe.min).toBe(6);
    expect(severe.max).toBe(10);
    expect(severe.label).toBe('Severe');

    // Extreme (base ≥ 15): 10-15×
    const extreme = estimateMultiplier(5, 3);
    expect(extreme.min).toBe(10);
    expect(extreme.max).toBe(15);
    expect(extreme.label).toBe('Extreme');
  });

  it('should calculate financial impact', () => {
    const multiplier = { min: 10, max: 15, label: 'Extreme' as const };
    const impact = calculateFinancialImpact(300000, multiplier, 'USD');

    expect(impact.min).toBe(3000000); // 300K × 10
    expect(impact.max).toBe(4500000); // 300K × 15
    expect(impact.currency).toBe('USD');
    expect(Object.isFrozen(impact)).toBe(true);
  });

  it('should handle different currencies', () => {
    const multiplier = { min: 2, max: 4, label: 'Moderate' as const };
    const impact = calculateFinancialImpact(50000, multiplier, 'EUR');

    expect(impact.min).toBe(100000);
    expect(impact.max).toBe(200000);
    expect(impact.currency).toBe('EUR');
  });
});

describe('Analyzer - Signal Scoring', () => {
  it('should score numeric values (0-100 → 1-10)', () => {
    expect(scoreSignal(0)).toBe(1);
    expect(scoreSignal(50)).toBeCloseTo(5, 0);  // Middle value
    expect(scoreSignal(100)).toBe(10);
  });

  it('should score with custom min/max', () => {
    expect(scoreSignal(0, { min: 0, max: 10 })).toBe(1);
    expect(scoreSignal(5, { min: 0, max: 10 })).toBe(5);  // Midpoint normalized
    expect(scoreSignal(10, { min: 0, max: 10 })).toBe(10);
  });

  it('should invert scores when requested', () => {
    expect(scoreSignal(100, { invert: true })).toBe(1); // High becomes low
    expect(scoreSignal(0, { invert: true })).toBe(10);  // Low becomes high
  });

  it('should score boolean values', () => {
    expect(scoreSignal(true)).toBe(10);
    expect(scoreSignal(false)).toBe(1);
    expect(scoreSignal(true, { invert: true })).toBe(1);
    expect(scoreSignal(false, { invert: true })).toBe(10);
  });

  it('should score semantic string levels', () => {
    expect(scoreSignal('critical')).toBe(10);
    expect(scoreSignal('high')).toBe(8);
    expect(scoreSignal('medium')).toBe(5);
    expect(scoreSignal('low')).toBe(3);
    expect(scoreSignal('minimal')).toBe(1);
  });

  it('should score string boolean equivalents', () => {
    expect(scoreSignal('yes')).toBe(10);
    expect(scoreSignal('no')).toBe(1);
    expect(scoreSignal('true')).toBe(10);
    expect(scoreSignal('false')).toBe(1);
  });

  it('should use default score (5) for unknown inputs', () => {
    expect(scoreSignal('unknown')).toBe(5);
    expect(scoreSignal(null)).toBe(5);
    expect(scoreSignal(undefined)).toBe(5);
    expect(scoreSignal({})).toBe(5);
  });
});

describe('Analyzer - Semantic Contract Preservation', () => {
  it('should preserve Tailwind CSS example calculations', () => {
    // From VALIDATION-RESULTS.md
    const sound = 9;
    const space = 8;
    const time = 9;

    const score = calculate3DScore({ sound, space, time });
    expect(score).toBe(64.8); // 9 × 8 × 9 / 10

    const drift = calculateDrift(85, 35);
    expect(drift.drift).toBe(50);
    expect(drift.gapType).toBe('teaching');
    expect(drift.driftQuality).toBe('extreme');

    const fetch = calculateFetch(score, drift.absDrift, 0.7, 1000);
    expect(fetch.fetchScore).toBeCloseTo(2268, 0); // 64.8 × 50 × 0.7
    expect(fetch.level).toBe('EXECUTE');

    const multiplier = estimateMultiplier(5, 3);
    expect(multiplier.label).toBe('Extreme');
    expect(multiplier.min).toBe(10);
    expect(multiplier.max).toBe(15);
  });
});
