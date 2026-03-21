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

  it('should parse WATCH with single WHEN condition', () => {
    const source = `
      WATCH labour_crack WHEN unemployment >= 7.0
    `;

    const result = parse(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0];
      expect(stmt.type).toBe('Watch');
      if (stmt.type === 'Watch') {
        expect(stmt.when).toHaveLength(1);
        expect(stmt.when[0].left).toBe('unemployment');
        expect(stmt.when[0].operator).toBe('>=');
        expect(stmt.when[0].right).toBe(7.0);
      }
    }
  });

  it('should parse WATCH with WHEN AND chaining', () => {
    const source = `
      WATCH labour_crack WHEN unemployment >= 7.0 AND vacancy_healthcare_trades > 5.0
    `;

    const result = parse(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0];
      expect(stmt.type).toBe('Watch');
      if (stmt.type === 'Watch') {
        expect(stmt.when).toHaveLength(2);
        expect(stmt.when[0].left).toBe('unemployment');
        expect(stmt.when[0].operator).toBe('>=');
        expect(stmt.when[0].right).toBe(7.0);
        expect(stmt.when[1].left).toBe('vacancy_healthcare_trades');
        expect(stmt.when[1].operator).toBe('>');
        expect(stmt.when[1].right).toBe(5.0);
      }
    }
  });

  it('should parse DIVE with WHEN AND chaining', () => {
    const source = `
      DIVE INTO market_analysis WHEN volatility > 20 AND volume >= 1000
    `;

    const result = parse(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0];
      expect(stmt.type).toBe('Dive');
      if (stmt.type === 'Dive') {
        expect(stmt.when).toHaveLength(2);
        expect(stmt.when[0].left).toBe('volatility');
        expect(stmt.when[0].operator).toBe('>');
        expect(stmt.when[0].right).toBe(20);
        expect(stmt.when[1].left).toBe('volume');
        expect(stmt.when[1].operator).toBe('>=');
        expect(stmt.when[1].right).toBe(1000);
      }
    }
  });

  it('should transform WATCH with AND conditions into action plan', () => {
    const source = `
      WATCH price_alert WHEN price > 100 AND volume >= 500
    `;

    const result = compile(source);

    expect(result.success).toBe(true);
    if (result.success) {
      const watchAction = result.actionPlan.actions[0];
      expect(watchAction.action).toBe('watch');
      if (watchAction.action === 'watch') {
        expect(watchAction.condition).toHaveLength(2);
        expect(watchAction.condition[0].left).toBe('price');
        expect(watchAction.condition[1].left).toBe('volume');
      }
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
