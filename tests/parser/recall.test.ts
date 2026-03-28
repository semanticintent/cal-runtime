/**
 * 🪶 RECALL Parser & Executor Tests
 *
 * Validates RECALL keyword: parsing, transformation, execution, and calibration.
 * Tests cover the spec examples from UC-062 and UC-080.
 *
 * @since v1.2
 */

import { describe, it, expect } from 'vitest';
import { parse, compile } from '../../src/parser/index.js';
import { Executor } from '../../src/executor/index.js';

describe('RECALL - Parser', () => {
  it('should parse a basic RECALL with one WATCH', () => {
    const source = `
      RECALL test_case ON "2026-04-15"
        WATCH trigger_1 STATUS fired
          FIRED_DATE "2026-03-15"
          EVIDENCE "Signal observed"
        TRIGGERS 1/1
        CONFIDENCE_STATED 0.50
        CONFIDENCE_ACTUAL 1.0
        CALIBRATION under
    `;

    const result = parse(source);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ast.statements).toHaveLength(1);
      expect(result.ast.statements[0].type).toBe('Recall');
    }
  });

  it('should parse multi-WATCH RECALL with all statuses', () => {
    const source = `
      RECALL multi_test ON "2026-04-15"
        WATCH trigger_a STATUS fired
          FIRED_DATE "2026-02-26"
          EVIDENCE "First signal"
        WATCH trigger_b STATUS not_fired
          EVIDENCE "No signal observed"
        WATCH trigger_c STATUS partial
          EVIDENCE "Partially crossed threshold"
        TRIGGERS 1/3
        CONFIDENCE_STATED 0.45
        CONFIDENCE_ACTUAL 0.33
        CALIBRATION aligned
    `;

    const result = parse(source);
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.type).toBe('Recall');
      expect(stmt.watches).toHaveLength(3);
      expect(stmt.watches[0].status).toBe('fired');
      expect(stmt.watches[1].status).toBe('not_fired');
      expect(stmt.watches[2].status).toBe('partial');
    }
  });

  it('should parse RECALL with all optional fields', () => {
    const source = `
      RECALL full_test ON "2026-04-29"
        WATCH trigger_1 STATUS fired
          FIRED_DATE "2026-04-10"
          EVIDENCE "Threshold crossed"
        TRIGGERS 1/1
        CONFIDENCE_STATED 0.40
        CONFIDENCE_ACTUAL 1.0
        CALIBRATION under
        DRIFT_AFTER 55
        SURFACE validation AS json
    `;

    const result = parse(source);
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.driftAfter).toBe(55);
      expect(stmt.surfaceOutput).toBe('validation');
      expect(stmt.surfaceFormat).toBe('json');
    }
  });

  it('should parse RECALL with minimal fields', () => {
    const source = `
      RECALL minimal_test ON "2026-05-01"
        WATCH trigger_1 STATUS not_fired
        TRIGGERS 0/1
        CONFIDENCE_STATED 0.44
        CONFIDENCE_ACTUAL 0.0
        CALIBRATION over
    `;

    const result = parse(source);
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.watches[0].firedDate).toBeNull();
      expect(stmt.watches[0].evidence).toBeNull();
      expect(stmt.driftAfter).toBeUndefined();
    }
  });

  it('should parse the UC-062 spec example', () => {
    const source = `
      RECALL escape_hatch ON "2026-04-15"
        WATCH compression_ceiling STATUS fired
          FIRED_DATE "2026-02-26"
          EVIDENCE "C3 AI layoffs produced stock decline. First AI layoff to negative reaction."
        WATCH consumer_collapse STATUS not_fired
          EVIDENCE "NFP remained positive through review window. Retail sales stable."
        WATCH infrastructure_plateau STATUS not_fired
          EVIDENCE "AI infrastructure revenue still growing despite broad software sell-off."
        TRIGGERS 1/3
        CONFIDENCE_STATED 0.33
        CONFIDENCE_ACTUAL 0.33
        CALIBRATION aligned
      SURFACE validation AS json
    `;

    const result = parse(source);
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.target).toBe('escape_hatch');
      expect(stmt.date).toBe('2026-04-15');
      expect(stmt.watches).toHaveLength(3);
      expect(stmt.triggersFired).toBe(1);
      expect(stmt.triggersTotal).toBe(3);
      expect(stmt.confidenceStated).toBe(0.33);
      expect(stmt.confidenceActual).toBe(0.33);
      expect(stmt.calibration).toBe('aligned');
    }
  });

  it('should parse the UC-080 spec example with DRIFT_AFTER', () => {
    const source = `
      RECALL canadian_feedback_loop ON "2026-04-29"
        WATCH labour_crack STATUS fired
          FIRED_DATE "2026-04-10"
          EVIDENCE "March LFS: unemployment 7.1%. Healthcare vacancies 5.8%. Both thresholds crossed."
        WATCH cusma_rupture STATUS partial
          EVIDENCE "Review scheduled July 1. Trump rhetoric escalating. No adverse outcome yet."
        WATCH rate_hike STATUS not_fired
          EVIDENCE "BoC held at 2.25% on Apr 29. Trapped but did not hike."
        TRIGGERS 1/3
        CONFIDENCE_STATED 0.40
        CONFIDENCE_ACTUAL 0.33
        CALIBRATION aligned
        DRIFT_AFTER 55
      SURFACE validation AS json
    `;

    const result = parse(source);
    expect(result.success).toBe(true);
    if (result.success) {
      const stmt = result.ast.statements[0] as any;
      expect(stmt.target).toBe('canadian_feedback_loop');
      expect(stmt.driftAfter).toBe(55);
      expect(stmt.watches[1].status).toBe('partial');
    }
  });

  it('should compile RECALL to ActionPlan', () => {
    const source = `
      RECALL test ON "2026-04-15"
        WATCH t1 STATUS fired
        TRIGGERS 1/1
        CONFIDENCE_STATED 0.50
        CONFIDENCE_ACTUAL 1.0
        CALIBRATION under
    `;

    const result = compile(source);
    expect(result.success).toBe(true);
    if (result.success) {
      const recallAction = result.actionPlan.actions.find((a: any) => a.action === 'recall');
      expect(recallAction).toBeDefined();
      expect(recallAction!.target).toBe('test');
    }
  });
});

describe('RECALL - Executor', () => {
  it('should execute RECALL with aligned calibration', async () => {
    const source = `
      RECALL aligned_test ON "2026-04-15"
        WATCH t1 STATUS fired
        TRIGGERS 1/3
        CONFIDENCE_STATED 0.33
        CONFIDENCE_ACTUAL 0.33
        CALIBRATION aligned
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);
      expect(result.success).toBe(true);

      const recallResult = result.outputs['aligned_test_recall'];
      expect(recallResult).toBeDefined();
      expect(recallResult.calibration).toBe('aligned');
      expect(recallResult.calibrationDelta).toBe(0);
      expect(recallResult.validated).toBe(true);
    }
  });

  it('should detect over-confident calibration', async () => {
    const source = `
      RECALL over_test ON "2026-04-15"
        WATCH t1 STATUS not_fired
        TRIGGERS 0/3
        CONFIDENCE_STATED 0.70
        CONFIDENCE_ACTUAL 0.0
        CALIBRATION over
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);

      const recallResult = result.outputs['over_test_recall'];
      expect(recallResult.calibration).toBe('over');
      expect(recallResult.calibrationDelta).toBe(0.7);
      expect(recallResult.validated).toBe(true);
      expect(recallResult.interpretation).toContain('Over-confident');
    }
  });

  it('should detect under-confident calibration', async () => {
    const source = `
      RECALL under_test ON "2026-04-15"
        WATCH t1 STATUS fired
        WATCH t2 STATUS fired
        TRIGGERS 2/3
        CONFIDENCE_STATED 0.20
        CONFIDENCE_ACTUAL 0.67
        CALIBRATION under
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);

      const recallResult = result.outputs['under_test_recall'];
      expect(recallResult.calibration).toBe('under');
      expect(recallResult.validated).toBe(true);
      expect(recallResult.interpretation).toContain('Under-confident');
    }
  });

  it('should handle calibration boundary at exactly 0.10', async () => {
    const source = `
      RECALL boundary_test ON "2026-04-15"
        WATCH t1 STATUS fired
        TRIGGERS 1/2
        CONFIDENCE_STATED 0.60
        CONFIDENCE_ACTUAL 0.50
        CALIBRATION aligned
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);

      const recallResult = result.outputs['boundary_test_recall'];
      expect(recallResult.calibrationDelta).toBe(0.1);
      expect(recallResult.validated).toBe(true); // 0.10 is <= 0.10, so aligned
    }
  });

  it('should flag invalid calibration declaration', async () => {
    const source = `
      RECALL mismatch_test ON "2026-04-15"
        WATCH t1 STATUS not_fired
        TRIGGERS 0/3
        CONFIDENCE_STATED 0.70
        CONFIDENCE_ACTUAL 0.0
        CALIBRATION aligned
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);

      const recallResult = result.outputs['mismatch_test_recall'];
      // Author declared 'aligned' but delta is 0.70 — should be 'over'
      expect(recallResult.validated).toBe(false);
    }
  });

  it('should store DRIFT_AFTER in result', async () => {
    const source = `
      RECALL drift_test ON "2026-04-29"
        WATCH t1 STATUS fired
        TRIGGERS 1/1
        CONFIDENCE_STATED 0.40
        CONFIDENCE_ACTUAL 1.0
        CALIBRATION under
        DRIFT_AFTER 55
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);

      const recallResult = result.outputs['drift_test_recall'];
      expect(recallResult.driftAfter).toBe(55);
    }
  });

  it('should handle SURFACE output within RECALL', async () => {
    const source = `
      RECALL surface_test ON "2026-04-15"
        WATCH t1 STATUS fired
        TRIGGERS 1/1
        CONFIDENCE_STATED 0.50
        CONFIDENCE_ACTUAL 1.0
        CALIBRATION under
        SURFACE validation AS json
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);

      expect(result.outputs['validation']).toBeDefined();
      expect(result.outputs['validation'].format).toBe('json');
      expect(result.outputs['validation'].data).toBeDefined();
    }
  });

  it('should execute full UC-062 integration', async () => {
    const source = `
      RECALL escape_hatch ON "2026-04-15"
        WATCH compression_ceiling STATUS fired
          FIRED_DATE "2026-02-26"
          EVIDENCE "C3 AI layoffs produced stock decline."
        WATCH consumer_collapse STATUS not_fired
          EVIDENCE "NFP remained positive."
        WATCH infrastructure_plateau STATUS not_fired
          EVIDENCE "AI infra revenue still growing."
        TRIGGERS 1/3
        CONFIDENCE_STATED 0.33
        CONFIDENCE_ACTUAL 0.33
        CALIBRATION aligned
      SURFACE validation AS json
    `;

    const compiled = compile(source);
    expect(compiled.success).toBe(true);
    if (compiled.success) {
      const executor = new Executor();
      const result = await executor.execute(compiled.actionPlan);
      expect(result.success).toBe(true);

      const recallResult = result.outputs['escape_hatch_recall'];
      expect(recallResult.target).toBe('escape_hatch');
      expect(recallResult.date).toBe('2026-04-15');
      expect(recallResult.triggersFired).toBe(1);
      expect(recallResult.triggersTotal).toBe(3);
      expect(recallResult.calibration).toBe('aligned');
      expect(recallResult.calibrationDelta).toBe(0);
      expect(recallResult.validated).toBe(true);
      expect(recallResult.watches).toHaveLength(3);
      expect(recallResult.watches[0].status).toBe('fired');
      expect(recallResult.watches[0].firedDate).toBe('2026-02-26');
    }
  });
});
