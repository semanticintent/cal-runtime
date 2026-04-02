# CAL WATCH Temporal Duration — Specification & Implementation Plan

**Status:** Proposed  
**Version:** 1.0  
**Date:** 2026-04-01  
**Scope:** `grammar.pegjs`, `src/types/index.ts`, `src/parser/index.ts`, `src/executor/index.ts`

---

## 1. Motivation

`WATCH` currently supports only point-in-time condition monitoring:

```cal
WATCH nvidia_deceleration WHEN nvidia_yoy_growth < 0.20
```

This fires on a single period where the condition is true. For financial and business analysis, a single bad quarter is noise. A condition sustained across multiple periods is a structural signal. Without temporal duration support, authors either accept false positives from one-period spikes or fold duration into an unreadable computed variable.

This feature adds an optional `FOR` clause to `WATCH` that expresses temporal persistence:

```cal
WATCH nvidia_deceleration WHEN nvidia_yoy_growth < 0.20 FOR 2 quarters
```

This reads: *"fire this trigger only if the condition holds across 2 consecutive measurement periods of that unit."*

---

## 2. Current State

| Component | Current WATCH behaviour |
|-----------|------------------------|
| Grammar | `WATCH target WHEN conditions` — no duration |
| Types | `WatchStatement.when: Condition[]` — no duration field |
| Parser | Direct pass-through transform — no duration handling |
| Executor | Creates watcher with `status: 'active'` — no expiry logic |
| `Watcher` interface | Has `timeout?: any` field — **unused** |
| `ScheduledTask` type | Has `type: 'watcher_timeout'` — **unused** |

The infrastructure anticipates this feature. The `timeout` field on `Watcher` and the `'watcher_timeout'` task type exist but are never populated.

---

## 3. Syntax

### 3.1 Proposed Grammar

```
WATCH target WHEN conditions [FOR n unit]
```

The `FOR` clause is **optional**. Existing WATCH statements without it are unchanged.

### 3.2 Examples

```cal
-- Point-in-time (unchanged, no FOR clause)
WATCH inflation_spike WHEN cpi_yoy > 0.05

-- Duration persistence: fires after 6 continuous months
WATCH demand_erosion WHEN monthly_bookings < 10000 FOR 6mo

-- Period persistence: fires after 2 consecutive quarterly reports
WATCH nvidia_deceleration WHEN nvidia_yoy_growth < 0.20 FOR 2 quarters

-- Period persistence with explicit consecutive marker (equivalent)
WATCH streaming_decline WHEN subscriber_loss = true FOR 3 quarters

-- Longer duration
WATCH services_reversal WHEN bea_services_share_declining = true FOR 3 quarters
```

### 3.3 Time Units

Extend the existing `TimeUnit` set to add `quarters` and `years`:

| Token | Unit | Canonical value |
|-------|------|-----------------|
| `d` | days | — |
| `h` | hours | — |
| `m` | minutes | — |
| `w` | weeks | — |
| `mo` | months | — |
| `quarters` *(new)* | quarters | 3 months each |
| `years` *(new)* | years | 12 months |

`quarters` and `years` are **period units** — they count discrete measurement events (earnings reports, annual filings), not continuous wall-clock time. `days` through `months` are **duration units** — they measure continuous elapsed time.

This distinction matters for executor semantics (see §6).

### 3.4 FOR keyword disambiguation

`FOR` is already defined in the grammar and used by `LISTEN`:
```pegjs
ListenStatement = LISTEN _ FOR _ signals:SignalList
```

There is no ambiguity. `LISTEN FOR` is always followed by a `SignalList` (identifiers). `WATCH … FOR` is always followed by `Integer TimeUnit`. The parser can distinguish at the token level.

---

## 4. Semantic Definition

### 4.1 Duration units (`days`, `hours`, `minutes`, `weeks`, `months`)

The condition must evaluate to `true` **continuously** for the specified wall-clock duration before the trigger fires.

```cal
WATCH demand_erosion WHEN monthly_bookings < 10000 FOR 6mo
```

→ Fire when `monthly_bookings < 10000` has been true for 6 uninterrupted months.

### 4.2 Period units (`quarters`, `years`)

The condition must evaluate to `true` **in N consecutive discrete measurement periods** of that unit.

```cal
WATCH nvidia_deceleration WHEN nvidia_yoy_growth < 0.20 FOR 2 quarters
```

→ Fire when `nvidia_yoy_growth < 0.20` was true in each of the last 2 consecutive quarterly evaluations. A quarter where the condition is false resets the count.

### 4.3 No FOR clause (unchanged behaviour)

Fires immediately when the condition is true in a single evaluation. No accumulation.

### 4.4 Trigger state transitions

```
active → triggered   (condition met for required duration/periods)
active → expired     (watcher removed without firing — future: WATCH … UNTIL)
```

---

## 5. Type Changes

### 5.1 `WatchDuration` (new type)

```typescript
/**
 * Temporal duration qualifier for WATCH statements.
 * unit: duration units measure continuous elapsed time.
 *       period units (quarters, years) count discrete measurement events.
 */
export interface WatchDuration {
  value: number;
  unit: 'days' | 'hours' | 'minutes' | 'weeks' | 'months' | 'quarters' | 'years';
}
```

Keep this **separate from `Duration`** (used by WAKE/AFTER). Duration does not need `quarters` or `years`; WatchDuration does. They serve different semantic purposes.

### 5.2 `WatchStatement` — add optional `for` field

```typescript
export interface WatchStatement {
  type: 'Watch';
  target: string;
  when: Condition[];
  for?: WatchDuration;   // new — optional temporal persistence clause
}
```

### 5.3 `WatchAction` — mirror the statement

```typescript
export interface WatchAction {
  action: 'watch';
  target: string;
  condition: Condition[];
  duration?: WatchDuration;   // new
}
```

### 5.4 `Watcher` — populate the existing `timeout` field

The `Watcher` interface already has `timeout?: any`. Replace `any` with a typed field:

```typescript
export interface Watcher {
  id: string;
  type: 'observe' | 'monitor';
  target?: any;
  signals?: any[];
  timeout?: WatchDuration;      // was: any — now typed
  periodsMatched?: number;       // new — tracks consecutive period count
  onSignal?: any;
  created: string;
  status: 'active' | 'expired' | 'triggered';
}
```

### 5.5 `TimeUnit` extension

The existing `Duration` type uses:
```typescript
unit: 'days' | 'hours' | 'minutes' | 'weeks' | 'months'
```

Do **not** change this. `WatchDuration` has its own `unit` union that adds `quarters` and `years`. `Duration` (used by WAKE) stays unchanged.

---

## 6. Grammar Changes

**File:** `src/parser/grammar.pegjs`

### 6.1 WatchStatement rule

```pegjs
// Before
WatchStatement
  = WATCH _ target:Identifier _ WHEN _ conditions:ConditionList _ {
      return {
        type: "Watch",
        target: target,
        when: conditions
      };
    }

// After
WatchStatement
  = WATCH _ target:Identifier _ WHEN _ conditions:ConditionList duration:WatchDurationClause? _ {
      return {
        type: "Watch",
        target: target,
        when: conditions,
        for: duration || null
      };
    }
```

### 6.2 WatchDurationClause rule (new)

```pegjs
WatchDurationClause
  = _ FOR _ value:Integer _ unit:WatchTimeUnit _ {
      return { value: value, unit: unit };
    }

WatchTimeUnit
  = "quarters" { return "quarters"; }
  / "years"    { return "years"; }
  / "mo"       { return "months"; }
  / "w"        { return "weeks"; }
  / "d"        { return "days"; }
  / "h"        { return "hours"; }
  / "m"        { return "minutes"; }
```

**Note:** `quarters` and `years` must come before single-character tokens to avoid partial matches. PEG parsers use ordered choice — first match wins.

### 6.3 No other grammar changes required

`FOR` is already a keyword. `LISTEN FOR` is not ambiguous because `SignalList` and `WatchDurationClause` are structurally distinct (identifiers vs. Integer + TimeUnit).

---

## 7. Parser Changes

**File:** `src/parser/index.ts`

### 7.1 `transformWatch`

```typescript
// Before
function transformWatch(stmt: any, plan: ActionPlan): void {
  plan.actions.push({
    action: 'watch',
    target: stmt.target,
    condition: stmt.when
  });
}

// After
function transformWatch(stmt: WatchStatement, plan: ActionPlan): void {
  const watchAction: WatchAction = {
    action: 'watch',
    target: stmt.target,
    condition: stmt.when
  };

  if (stmt.for) {
    watchAction.duration = stmt.for;
  }

  plan.actions.push(watchAction);
}
```

No other parser changes required.

---

## 8. Executor Changes

**File:** `src/executor/index.ts`

### 8.1 `handleWatch`

This is the most substantial change.

```typescript
// Before
private async handleWatch(action: any): Promise<any> {
  const { target, condition } = action;

  const watcher = {
    id: `watch_${target}_${Date.now()}`,
    target,
    condition,
    created: new Date().toISOString(),
    status: 'active'
  };

  if (!this.results['_watchers']) {
    this.results['_watchers'] = [];
  }
  this.results['_watchers'].push(watcher);

  return {
    success: true,
    watcherId: watcher.id,
    target,
    status: 'active',
    message: `Watching ${target}`
  };
}

// After
private async handleWatch(action: WatchAction): Promise<any> {
  const { target, condition, duration } = action;

  const watcher: Watcher = {
    id: `watch_${target}_${Date.now()}`,
    type: 'monitor',
    target,
    condition,
    created: new Date().toISOString(),
    status: 'active',
    ...(duration && {
      timeout: duration,
      periodsMatched: 0
    })
  };

  this.watchers.push(watcher);

  // If duration is a period unit, register a ScheduledTask to track
  // period-boundary evaluations
  if (duration && isPeriodUnit(duration.unit)) {
    const task: ScheduledTask = {
      id: `watcher_timeout_${watcher.id}`,
      type: 'watcher_timeout',
      delay: duration,
      action: { watcherId: watcher.id },
      created: new Date().toISOString(),
      status: 'pending'
    };
    this.scheduledTasks.push(task);
  }

  const message = duration
    ? `Watching ${target} — fires after condition holds for ${duration.value} ${duration.unit}`
    : `Watching ${target}`;

  return {
    success: true,
    watcherId: watcher.id,
    target,
    status: 'active',
    duration: duration || null,
    message
  };
}
```

### 8.2 `isPeriodUnit` helper (new)

```typescript
function isPeriodUnit(unit: WatchDuration['unit']): boolean {
  return unit === 'quarters' || unit === 'years';
}
```

### 8.3 Evaluation semantics note

The current executor creates watchers and returns them in `ExecutionResult.watchers[]` — it does not execute them in a live loop (execution is per-call, not persistent). This is correct for the CAL use case: watchers express **monitoring intent**, not live runtime loops.

The `periodsMatched` field and `ScheduledTask` of type `'watcher_timeout'` record the intent so that a host system (e.g., the MCP server or a future RECALL validator) can:
1. Re-evaluate the WATCH condition each period
2. Increment `periodsMatched` when the condition holds
3. Transition `status` to `'triggered'` when `periodsMatched >= duration.value`
4. Reset `periodsMatched` to `0` on any period where the condition is false

This is consistent with how the existing `Watcher` and `ScheduledTask` types are structured — the execution model is **declarative intent + external scheduler**.

---

## 9. Test Plan

**File:** `tests/parser/watch-duration.test.ts` (new)

```typescript
describe('WATCH with FOR duration clause', () => {

  it('parses WATCH without FOR unchanged', () => {
    const result = parse('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    expect(result.ast.statements[0]).toMatchObject({
      type: 'Watch',
      target: 'inflation_spike',
      for: null
    });
  });

  it('parses FOR with duration unit (months)', () => {
    const result = parse('WATCH demand_erosion WHEN bookings < 10000 FOR 6mo');
    expect(result.ast.statements[0].for).toEqual({ value: 6, unit: 'months' });
  });

  it('parses FOR with period unit (quarters)', () => {
    const result = parse('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    expect(result.ast.statements[0].for).toEqual({ value: 2, unit: 'quarters' });
  });

  it('parses FOR with period unit (years)', () => {
    const result = parse('WATCH long_decline WHEN revenue_falling = true FOR 2 years');
    expect(result.ast.statements[0].for).toEqual({ value: 2, unit: 'years' });
  });

  it('rejects FOR without Integer', () => {
    const result = parse('WATCH x WHEN y > 1 FOR quarters');
    expect(result.success).toBe(false);
  });

});
```

**File:** `tests/executor/watch-duration.test.ts` (new)

```typescript
describe('WATCH executor with FOR clause', () => {

  it('creates watcher with timeout for duration unit', async () => {
    const result = await execute('WATCH demand_erosion WHEN bookings < 10000 FOR 6mo');
    const watcher = result.watchers[0];
    expect(watcher.timeout).toEqual({ value: 6, unit: 'months' });
    expect(watcher.status).toBe('active');
  });

  it('creates ScheduledTask for period unit', async () => {
    const result = await execute('WATCH nvidia_decel WHEN growth < 0.20 FOR 2 quarters');
    const task = result.scheduledTasks.find(t => t.type === 'watcher_timeout');
    expect(task).toBeDefined();
    expect(task!.delay).toEqual({ value: 2, unit: 'quarters' });
  });

  it('creates no ScheduledTask without FOR clause', async () => {
    const result = await execute('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    const task = result.scheduledTasks.find(t => t.type === 'watcher_timeout');
    expect(task).toBeUndefined();
  });

  it('watcher without FOR has no timeout or periodsMatched', async () => {
    const result = await execute('WATCH inflation_spike WHEN cpi_yoy > 0.05');
    const watcher = result.watchers[0];
    expect(watcher.timeout).toBeUndefined();
    expect(watcher.periodsMatched).toBeUndefined();
  });

});
```

---

## 10. Migration — Existing Cases

Six WATCH triggers in published cases use `FOR N consecutive_quarters` syntax that is **currently invalid** per the runtime. Once this feature ships, they need updating to match the new grammar.

`consecutive_quarters` is not a valid token — `quarters` is the unit, `consecutive` is implicit for period units.

| Case | Current (invalid) | Updated |
|------|------------------|---------|
| UC-218 | `FOR 2 consecutive_quarters` | `FOR 2 quarters` |
| UC-218 | `FOR 2 years` | `FOR 2 years` ✓ already valid |
| UC-218 | `FOR 3 quarters` | `FOR 3 quarters` ✓ already valid |
| UC-223 | `FOR 2 consecutive_quarters` | `FOR 2 quarters` |
| UC-228 | `FOR 3 consecutive_quarters` | `FOR 3 quarters` |
| UC-228 | `FOR 4 quarters` | `FOR 4 quarters` ✓ already valid |

The only token that needs replacement is `consecutive_quarters` → `quarters`. Cases that already use `FOR N quarters` or `FOR N years` will be valid once the grammar extension lands.

---

## 11. Implementation Order

1. **`grammar.pegjs`** — Add `WatchDurationClause` and `WatchTimeUnit` rules; update `WatchStatement`. Build and test grammar compiles. *(~30 min)*

2. **`src/types/index.ts`** — Add `WatchDuration` interface; extend `WatchStatement`, `WatchAction`, `Watcher`. *(~20 min)*

3. **`src/parser/index.ts`** — Update `transformWatch` to pass `duration` through. *(~10 min)*

4. **`src/executor/index.ts`** — Update `handleWatch`; add `isPeriodUnit` helper. *(~30 min)*

5. **Tests** — `watch-duration.test.ts` for parser and executor. *(~45 min)*

6. **Case migrations** — Update `consecutive_quarters` in UC-218, UC-223, UC-228 HTML files and redeploy. *(~10 min)*

**Total: ~2.5 hours**

---

## 12. Open Questions

1. **`consecutive` as explicit keyword?** The spec treats period units as implicitly consecutive (quarters are always quarterly). If there's a future use case for "non-consecutive" period matching (condition true in any 2 of the last 4 quarters), a `CONSECUTIVE` keyword could be added later. Not needed for v1.

2. **`UNTIL` clause?** `WATCH … UNTIL date` would let a watcher expire on a calendar date rather than after N periods. Orthogonal to this feature. Defer.

3. **`RECALL` integration?** When a prognostic case is reviewed via `RECALL`, its `WATCH` triggers should be evaluated against the review-date data. The `periodsMatched` field enables this. Full `RECALL` + `WATCH` integration is a separate spec.
