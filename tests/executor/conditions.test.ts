import { describe, it, expect } from 'vitest';
import { compile } from '../../src/parser/index.js';
import { Executor } from '../../src/executor/index.js';
import { MemoryDataAdapter, matchesConditions, toFilterConditions } from '../../src/adapters/data/index.js';

const items = [
  { id: 'a', type: 'x', score: 10 },
  { id: 'b', type: 'y', score: 90 },
  { id: 'c', type: 'z', score: 50 },
];

async function ids(src: string, key = 'res'): Promise<string[]> {
  const r = compile(src);
  expect(r.success).toBe(true);
  const ex = new Executor({ dataAdapter: new MemoryDataAdapter({ items }) } as any);
  const out: any = await ex.execute(r.actionPlan!);
  expect(out.success).toBe(true);
  const res = out.outputs[key];
  // Query results are analyses; the entity id is in the `entity` field.
  return (res.entities ?? []).map((e: any) => e.entity).sort();
}

describe('WHERE conditions: AND, OR and precedence', () => {
  it('OR returns entities matching either condition', async () => {
    expect(await ids('FORAGE items WHERE type = "x" OR type = "y" SURFACE res')).toEqual(['a', 'b']);
  });

  it('AND still requires every condition', async () => {
    expect(await ids('FORAGE items WHERE score > 20 AND score < 80 SURFACE res')).toEqual(['c']);
  });

  it('AND binds tighter than OR: "a AND b OR c" is "(a AND b) OR c"', async () => {
    // (type = x AND score > 50) OR type = z  ->  only c (a fails score > 50)
    expect(await ids('FORAGE items WHERE type = "x" AND score > 50 OR type = "z" SURFACE res')).toEqual(['c']);
    // type = y OR (type = x AND score < 20)  ->  b and a
    expect(await ids('FORAGE items WHERE type = "y" OR type = "x" AND score < 20 SURFACE res')).toEqual(['a', 'b']);
  });

  it('a single condition works', async () => {
    expect(await ids('FORAGE items WHERE score >= 50 SURFACE res')).toEqual(['b', 'c']);
  });

  it('the parser records how each condition is joined', () => {
    const r = compile('FORAGE items WHERE type = "x" OR score > 1 AND score < 99 SURFACE res');
    const filters = (r.actionPlan!.actions[0] as any).filters;
    expect(filters.map((f: any) => f.logic ?? null)).toEqual([null, 'OR', 'AND']);
  });
});

describe('DIVE ... WHEN', () => {
  it('runs with a WHEN condition instead of throwing', async () => {
    const r = compile('DIVE INTO items WHEN score > 20 TRACE cascade EMIT rep');
    expect(r.success).toBe(true);
    const ex = new Executor({ dataAdapter: new MemoryDataAdapter({ items }) } as any);
    const out: any = await ex.execute(r.actionPlan!);
    expect(out.success).toBe(true);
    expect(out.outputs.rep.count).toBe(2);
  });

  it('supports OR in WHEN', async () => {
    const r = compile('DIVE INTO items WHEN type = "x" OR type = "z" TRACE cascade EMIT rep');
    const ex = new Executor({ dataAdapter: new MemoryDataAdapter({ items }) } as any);
    const out: any = await ex.execute(r.actionPlan!);
    expect(out.success).toBe(true);
    expect(out.outputs.rep.count).toBe(2);
  });
});

describe('matchesConditions (backward compatibility)', () => {
  it('filters without a logic field are joined with AND, as before', () => {
    const f = toFilterConditions([{ left: 'score', operator: '>', right: 5 }, { left: 'type', operator: '=', right: 'x' }]);
    expect(matchesConditions(items[0], f)).toBe(true);
    expect(matchesConditions(items[1], f)).toBe(false);
  });
  it('no filters matches everything', () => {
    expect(matchesConditions(items[0], [])).toBe(true);
  });
});
