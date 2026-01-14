/**
 * 🪶 Parser Basic Tests
 *
 * Validates parser semantic contracts
 */

import { describe, it, expect } from 'vitest';
import { parse, toActionPlan, compile } from '../../src/parser/index.js';

describe('Parser - Basic Functionality', () => {
  it('should parse a simple FORAGE statement', () => {
    const source = `
      FORAGE customers
      WHERE sound > 7
      ACROSS D1, D2
      DEPTH 2
      SURFACE results
    `;

    const result = parse(source);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ast.type).toBe('Program');
      expect(result.ast.language).toBe('Cormorant Agentic Language');
      expect(result.ast.statements).toHaveLength(1);
      expect(result.ast.statements[0].type).toBe('Forage');
    }
  });

  it('should parse a DRIFT statement', () => {
    const source = `
      DRIFT cascade_map
      METHODOLOGY 85
      PERFORMANCE 35
    `;

    const result = parse(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0];
      expect(stmt.type).toBe('Drift');
      if (stmt.type === 'Drift') {
        expect(stmt.methodology).toBe(85);
        expect(stmt.performance).toBe(35);
      }
    }
  });

  it('should parse a FETCH statement', () => {
    const source = `
      FETCH decision
      THRESHOLD 1000
    `;

    const result = parse(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0];
      expect(stmt.type).toBe('Fetch');
      if (stmt.type === 'Fetch') {
        expect(stmt.threshold).toBe(1000);
      }
    }
  });

  it('should transform AST to ActionPlan', () => {
    const source = `
      FORAGE customers ACROSS D1, D2
      DIVE INTO analysis
      SURFACE results
    `;

    const parseResult = parse(source);
    expect(parseResult.success).toBe(true);

    if (parseResult.success) {
      const plan = toActionPlan(parseResult.ast);

      expect(plan.type).toBe('ActionPlan');
      expect(plan.methodology).toBe('6D Foraging');
      expect(plan.actions).toHaveLength(3);
      expect(plan.actions[0].action).toBe('query');
      expect(plan.actions[1].action).toBe('analyze');
      expect(plan.actions[2].action).toBe('output');
      expect(plan.dimensions).toContain('D1');
      expect(plan.dimensions).toContain('D2');
    }
  });

  it('should compile source to complete result', () => {
    const source = `
      FORAGE data ACROSS D1
      CHIRP info "test message"
    `;

    const result = compile(source);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.source).toBe(source);
      expect(result.ast).toBeDefined();
      expect(result.actionPlan).toBeDefined();
      expect(result.actionPlan.actions).toHaveLength(2);
      expect(result.actionPlan.actions[0].action).toBe('query');
      expect(result.actionPlan.actions[1].action).toBe('alert');
    }
  });

  it('should handle parse errors gracefully', () => {
    const source = `
      INVALID SYNTAX HERE
    `;

    const result = parse(source);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error.message).toBeTruthy();
    }
  });

  it('should preserve semantic contracts in action plan', () => {
    const source = `
      DRIFT gap_analysis
      METHODOLOGY 85
      PERFORMANCE 35
      GAP teaching
    `;

    const result = compile(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const driftAction = result.actionPlan.actions[0];
      expect(driftAction.action).toBe('drift');
      if (driftAction.action === 'drift') {
        expect(driftAction.methodology).toBe(85);
        expect(driftAction.performance).toBe(35);
        expect(driftAction.gapType).toBe('teaching');
      }
    }
  });
});
