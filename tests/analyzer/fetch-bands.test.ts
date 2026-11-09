import { describe, it, expect } from 'vitest';
import { calculateFetch } from '../../src/analyzer/index.js';

// CAL spec v1.2: decision levels are fractions of the threshold T.
// EXECUTE >= T (high priority >= 2T), CONFIRM >= 0.75T, QUEUE >= 0.5T, else WAIT.
// fetchScore = chirp × drift × confidence; chirp=1, confidence=1 makes drift the score.
const at = (score: number, threshold = 1000) => calculateFetch(1, score, 1, threshold);

describe('FETCH levels as fractions of the threshold', () => {
  it('gives the bands every published case used at T = 1,000', () => {
    expect(at(2000)).toMatchObject({ level: 'EXECUTE', highPriority: true });
    expect(at(1999.99)).toMatchObject({ level: 'EXECUTE', highPriority: false });
    expect(at(1000)).toMatchObject({ level: 'EXECUTE', highPriority: false });
    expect(at(999.99).level).toBe('CONFIRM');
    expect(at(750).level).toBe('CONFIRM');
    expect(at(749.99).level).toBe('QUEUE');
    expect(at(500).level).toBe('QUEUE');
    expect(at(499.99).level).toBe('WAIT');
    expect(at(0).level).toBe('WAIT');
  });

  it('scales the bands with the threshold', () => {
    expect(at(1500, 2000).level).toBe('CONFIRM');
    expect(at(1000, 2000).level).toBe('QUEUE');
    expect(at(999, 2000).level).toBe('WAIT');
    expect(at(4000, 2000)).toMatchObject({ level: 'EXECUTE', highPriority: true });
    expect(at(75, 100).level).toBe('CONFIRM');
  });

  it('marks high priority in the recommendation only at 2T and above', () => {
    expect(at(2000).recommendation).toContain('High Priority');
    expect(at(1999).recommendation).not.toContain('High Priority');
  });

  it('rejects a threshold that is not greater than 0', () => {
    expect(() => at(500, 0)).toThrow(/threshold must be greater than 0/);
    expect(() => at(500, -1)).toThrow(/threshold must be greater than 0/);
  });

  it('matches a real case: UC-342 (78 × 46 × 0.78 = 2,799, high priority)', () => {
    const r = calculateFetch(78, 46, 0.78, 1000);
    expect(r.fetchScore).toBeCloseTo(2798.64, 2);
    expect(r).toMatchObject({ level: 'EXECUTE', highPriority: true });
  });
});
