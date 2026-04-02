/**
 * WATCH temporal duration executor tests
 * Validates Watcher and ScheduledTask creation with FOR clause
 */

import { describe, it, expect } from 'vitest';
import { compile } from '../../src/parser/index.js';
import { Executor } from '../../src/executor/index.js';

async function execute(source: string) {
  const compiled = compile(source);
  if (!compiled.success) throw new Error('Compile failed: ' + (compiled as any).error.message);
  const executor = new Executor();
  return executor.execute(compiled.actionPlan);
}

describe('WATCH executor — FOR clause', () => {

  it('creates watcher without timeout when no FOR clause', async () => {
    const result = await execute('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    expect(result.watchers).toHaveLength(1);
    const watcher = result.watchers[0];
    expect(watcher.timeout).toBeUndefined();
    expect(watcher.periodsMatched).toBeUndefined();
    expect(watcher.status).toBe('active');
  });

  it('creates no ScheduledTask when no FOR clause', async () => {
    const result = await execute('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    const task = result.scheduledTasks.find((t: any) => t.type === 'watcher_timeout');
    expect(task).toBeUndefined();
  });

  it('creates watcher with timeout for duration unit (months)', async () => {
    const result = await execute('WATCH demand_erosion WHEN bookings < 10000 FOR 6mo');
    expect(result.watchers).toHaveLength(1);
    const watcher = result.watchers[0];
    expect(watcher.timeout).toEqual({ value: 6, unit: 'months' });
    expect(watcher.periodsMatched).toBe(0);
    expect(watcher.status).toBe('active');
  });

  it('creates no ScheduledTask for duration unit (months is not a period unit)', async () => {
    const result = await execute('WATCH demand_erosion WHEN bookings < 10000 FOR 6mo');
    const task = result.scheduledTasks.find((t: any) => t.type === 'watcher_timeout');
    expect(task).toBeUndefined();
  });

  it('creates watcher with timeout for period unit (quarters)', async () => {
    const result = await execute('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    expect(result.watchers).toHaveLength(1);
    const watcher = result.watchers[0];
    expect(watcher.timeout).toEqual({ value: 2, unit: 'quarters' });
    expect(watcher.periodsMatched).toBe(0);
    expect(watcher.status).toBe('active');
  });

  it('creates ScheduledTask for period unit (quarters)', async () => {
    const result = await execute('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    const task = result.scheduledTasks.find((t: any) => t.type === 'watcher_timeout');
    expect(task).toBeDefined();
    expect(task!.delay).toEqual({ value: 2, unit: 'quarters' });
    expect(task!.status).toBe('pending');
    expect(task!.action.watcherId).toContain('watch_nvidia_decel');
  });

  it('creates ScheduledTask for period unit (years)', async () => {
    const result = await execute('WATCH long_decline WHEN revenue_falling = true FOR 2 years');
    const task = result.scheduledTasks.find((t: any) => t.type === 'watcher_timeout');
    expect(task).toBeDefined();
    expect(task!.delay).toEqual({ value: 2, unit: 'years' });
  });

  it('does not create ScheduledTask for non-period duration unit (weeks)', async () => {
    const result = await execute('WATCH weekly_signal WHEN volume < 500 FOR 4w');
    const task = result.scheduledTasks.find((t: any) => t.type === 'watcher_timeout');
    expect(task).toBeUndefined();
    const watcher = result.watchers[0];
    expect(watcher.timeout).toEqual({ value: 4, unit: 'weeks' });
  });

  it('watcher type is monitor for WATCH statements', async () => {
    const result = await execute('WATCH test_watch WHEN val > 0 FOR 3 quarters');
    expect(result.watchers[0].type).toBe('monitor');
  });

  it('result message includes duration description when FOR present', async () => {
    const result = await execute('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    const actionResult = result.actions.find((a: any) => a.action === 'watch');
    expect(actionResult?.data.message).toContain('2 quarters');
  });

  it('result message is plain watch message when no FOR', async () => {
    const result = await execute('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    const actionResult = result.actions.find((a: any) => a.action === 'watch');
    expect(actionResult?.data.message).toBe('Watching inflation_spike');
  });

});
