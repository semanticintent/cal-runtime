/**
 * 🪶 Executor Integration Tests
 *
 * Validates end-to-end execution flow
 */

import { describe, it, expect } from 'vitest';
import { compile } from '../../src/parser/index.js';
import { Executor } from '../../src/executor/index.js';
import type { Entity } from '../../src/types/index.js';

// Mock data adapter with test entities
function createTestDataAdapter() {
  const testEntities: Entity[] = [
    {
      id: 'tailwind-css',
      name: 'Tailwind CSS',
      type: 'technology',
      sound: 9,
      space: 8,
      time: 9,
      baseCost: 300000,
      currency: 'USD'
    },
    {
      id: 'stable-enterprise',
      name: 'Stable Enterprise',
      type: 'technology',
      sound: 3,
      space: 5,
      time: 2,
      baseCost: 100000,
      currency: 'USD'
    }
  ];

  return {
    async query(target: string, filters?: any[]): Promise<Entity[]> {
      // Return all entities for testing
      return testEntities;
    }
  };
}

describe('Executor - Integration', () => {
  it('should execute a simple FORAGE action', async () => {
    const source = `
      FORAGE entities
      ACROSS D1, D2, D3
      DEPTH 2
      SURFACE results
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor({
        dataAdapter: createTestDataAdapter()
      });

      const result = await executor.execute(compileResult.actionPlan);

      expect(result.success).toBe(true);
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].action).toBe('query');
      expect(result.actions[0].result).toBe('success');

      const queryResults = executor.getResult('results');
      expect(queryResults).toBeDefined();
      expect(queryResults.count).toBe(2);
      expect(queryResults.entities).toHaveLength(2);
    }
  });

  it('should execute DRIFT calculation', async () => {
    const source = `
      DRIFT cascade_map
      METHODOLOGY 85
      PERFORMANCE 35
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor();
      const result = await executor.execute(compileResult.actionPlan);

      expect(result.success).toBe(true);

      const driftResult = executor.getResult('cascade_map_drift');
      expect(driftResult).toBeDefined();
      expect(driftResult.drift).toBe(50);
      expect(driftResult.gapType).toBe('teaching');
      expect(driftResult.driftQuality).toBe('extreme');
    }
  });

  it('should execute FETCH decision logic', async () => {
    const source = `
      FORAGE entities ACROSS D1 SURFACE cascade_map
      DRIFT cascade_map METHODOLOGY 85 PERFORMANCE 35
      FETCH cascade_map THRESHOLD 1000
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor({
        dataAdapter: createTestDataAdapter()
      });

      const result = await executor.execute(compileResult.actionPlan);

      expect(result.success).toBe(true);
      expect(result.actions).toHaveLength(3);

      const fetchResult = executor.getResult('cascade_map_fetch');
      expect(fetchResult).toBeDefined();
      expect(fetchResult.level).toBeDefined();
      expect(['EXECUTE', 'CONFIRM', 'QUEUE', 'WAIT']).toContain(fetchResult.level);
    }
  });

  it('should handle multiple actions in sequence', async () => {
    const source = `
      FORAGE entities ACROSS D1, D2
      DIVE INTO analysis
      CHIRP info "Analysis complete"
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor({
        dataAdapter: createTestDataAdapter()
      });

      const result = await executor.execute(compileResult.actionPlan);

      expect(result.success).toBe(true);
      expect(result.actions).toHaveLength(3);
      expect(result.actions[0].action).toBe('query');
      expect(result.actions[1].action).toBe('analyze');
      expect(result.actions[2].action).toBe('alert');

      expect(result.actions[0].result).toBe('success');
      expect(result.actions[1].result).toBe('success');
      expect(result.actions[2].result).toBe('success');
    }
  });

  it('should preserve execution context', async () => {
    const source = `
      FORAGE entities ACROSS D1
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor({
        dataAdapter: createTestDataAdapter(),
        context: { userId: 'test-user', sessionId: '12345' }
      });

      const result = await executor.execute(compileResult.actionPlan, {
        requestId: 'req-001'
      });

      expect(result.success).toBe(true);
      expect(result.methodology).toBe('6D Foraging');
      expect(result.started).toBeDefined();
      expect(result.completed).toBeDefined();
    }
  });

  it('should create watchers for PERCH actions', async () => {
    const source = `
      PERCH ON segment:"high-value"
      LISTEN FOR churn signals
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor();
      const result = await executor.execute(compileResult.actionPlan);

      expect(result.success).toBe(true);
      expect(result.watchers.length).toBeGreaterThan(0);
      expect(result.watchers[0].type).toBe('observe');
      expect(result.watchers[0].status).toBe('active');
    }
  });

  it('should handle errors gracefully', async () => {
    const source = `
      FETCH nonexistent_target THRESHOLD 1000
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor();
      const result = await executor.execute(compileResult.actionPlan);

      // FETCH should fail because target doesn't exist
      expect(result.actions[0].result).toBe('failed');
    }
  });

  it('should calculate correct 3D scores from entities', async () => {
    const source = `
      FORAGE entities ACROSS D1, D2, D3 DEPTH 2 SURFACE cascade_map
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor({
        dataAdapter: createTestDataAdapter()
      });

      const result = await executor.execute(compileResult.actionPlan);

      const cascadeMap = executor.getResult('cascade_map');
      expect(cascadeMap).toBeDefined();
      expect(cascadeMap.entities).toHaveLength(2);

      // First entity: Tailwind CSS (9 × 8 × 9 / 10 = 64.8)
      const tailwind = cascadeMap.entities[0];
      expect(tailwind.lens.sound).toBe(9);
      expect(tailwind.lens.space).toBe(8);
      expect(tailwind.lens.time).toBe(9);

      // Second entity: Stable Enterprise (3 × 5 × 2 / 10 = 3)
      const stable = cascadeMap.entities[1];
      expect(stable.lens.sound).toBe(3);
      expect(stable.lens.space).toBe(5);
      expect(stable.lens.time).toBe(2);
    }
  });
});

describe('Executor - Semantic Contracts', () => {
  it('should preserve Tailwind CSS example from validation', async () => {
    const source = `
      FORAGE entities ACROSS D1, D2, D3, D5, D6 DEPTH 3 SURFACE cascade_map
      DRIFT cascade_map METHODOLOGY 85 PERFORMANCE 35
      FETCH cascade_map THRESHOLD 1000
    `;

    const compileResult = compile(source);
    expect(compileResult.success).toBe(true);

    if (compileResult.success) {
      const executor = new Executor({
        dataAdapter: createTestDataAdapter()
      });

      const result = await executor.execute(compileResult.actionPlan);

      expect(result.success).toBe(true);

      // Verify DRIFT
      const drift = executor.getResult('cascade_map_drift');
      expect(drift.drift).toBe(50);
      expect(drift.gapType).toBe('teaching');
      expect(drift.driftQuality).toBe('extreme');

      // Verify FETCH
      const fetch = executor.getResult('cascade_map_fetch');
      expect(fetch).toBeDefined();
      expect(fetch.level).toBeDefined();

      // With Tailwind's high scores and extreme drift,
      // fetch score should be substantial
      expect(fetch.fetchScore).toBeGreaterThan(1000);
      expect(fetch.level).toBe('EXECUTE');
    }
  });
});
