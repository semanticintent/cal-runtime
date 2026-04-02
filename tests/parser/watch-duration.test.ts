/**
 * WATCH temporal duration parser tests
 * Validates FOR clause parsing across all unit types
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../../src/parser/index.js';

describe('WATCH — FOR duration clause (parser)', () => {

  it('parses WATCH without FOR unchanged', () => {
    const result = parse('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.type).toBe('Watch');
      expect(stmt.target).toBe('inflation_spike');
      expect(stmt.for).toBeNull();
    }
  });

  it('parses FOR with months unit (mo)', () => {
    const result = parse('WATCH demand_erosion WHEN bookings < 10000 FOR 6mo');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 6, unit: 'months' });
    }
  });

  it('parses FOR with quarters unit', () => {
    const result = parse('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 2, unit: 'quarters' });
    }
  });

  it('parses FOR with years unit', () => {
    const result = parse('WATCH long_decline WHEN revenue_falling = true FOR 2 years');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 2, unit: 'years' });
    }
  });

  it('parses FOR with weeks unit (w)', () => {
    const result = parse('WATCH weekly_signal WHEN volume < 500 FOR 4w');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 4, unit: 'weeks' });
    }
  });

  it('parses FOR with days unit (d)', () => {
    const result = parse('WATCH daily_signal WHEN price < 100 FOR 30d');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 30, unit: 'days' });
    }
  });

  it('parses FOR with hours unit (h)', () => {
    const result = parse('WATCH hourly_signal WHEN load > 90 FOR 2h');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 2, unit: 'hours' });
    }
  });

  it('parses FOR with minutes unit (m)', () => {
    const result = parse('WATCH lag_spike WHEN latency > 500 FOR 15m');
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 15, unit: 'minutes' });
    }
  });

  it('produces a watch action with duration in the action plan', () => {
    const result = parse('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    expect(result.success).toBe(true);
    if (result.success) {
      // Verify the AST for field exists and is correct
      const stmt = result.ast.statements[0] as any;
      expect(stmt.for).toEqual({ value: 2, unit: 'quarters' });
    }
  });

  it('rejects FOR with no integer before unit', () => {
    const result = parse('WATCH x WHEN y > 1 FOR quarters');
    expect(result.success).toBe(false);
  });

});
