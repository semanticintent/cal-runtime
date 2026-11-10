/**
 * CAL Benchmarks — optional, cited ratios that replace the retired cascade multiplier.
 *
 * Three tiers, all mechanical (a lookup, never a judgement):
 *  - sectorReach():        BEA output multiplier for one industry (supply-chain reach)
 *  - eventRatio():         a published hidden-cost ratio for one kind of event, picked by tier
 *  - measuredMultiplier(): final cost / first reported cost, both sourced by the case
 *
 * Nothing here is ever blended into a single cross-dimension multiplier.
 *
 * @module benchmarks
 */
import { EVENT_RATIOS, BEA_OUTPUT_MULTIPLIERS } from './data.js'

export class BenchmarkError extends Error {
  constructor(message: string) { super(message); this.name = 'BenchmarkError' }
}

export type BeaLevel = 'sector' | 'summary'

export interface SectorReach {
  code: string
  industry: string
  level: BeaLevel
  year: number
  multiplier: number
  measures: string
  source: string
  url: string
}

type BeaIndustry = { industry: string; multiplier: Record<string, number> }

/**
 * BEA output multiplier for an industry code (sector or summary level).
 * Uses the latest BEA year at or before `year`; with no year, the latest available.
 */
export function sectorReach(code: string, year?: number): SectorReach {
  const levels = BEA_OUTPUT_MULTIPLIERS.levels as unknown as Record<BeaLevel, Record<string, BeaIndustry>>
  const level: BeaLevel | undefined = code in levels.summary ? 'summary' : code in levels.sector ? 'sector' : undefined
  if (!level) throw new BenchmarkError(`Unknown BEA industry code "${code}"`)
  const ind = levels[level][code]
  const years = Object.keys(ind.multiplier).map(Number).sort((a, b) => a - b)
  const pick = year === undefined ? years[years.length - 1] : [...years].reverse().find(y => y <= year)
  if (pick === undefined) throw new BenchmarkError(`No BEA data for "${code}" at or before ${year} (earliest ${years[0]})`)
  return {
    code, industry: ind.industry, level, year: pick,
    multiplier: ind.multiplier[String(pick)],
    measures: BEA_OUTPUT_MULTIPLIERS.measures,
    source: BEA_OUTPUT_MULTIPLIERS.source,
    url: BEA_OUTPUT_MULTIPLIERS.archive,
  }
}

export type EventRatioKind = 'cost_ratio' | 'market_value' | 'cost_share' | 'sizing'

export interface EventRatioResult {
  id: string
  dimension: string
  lands: readonly string[]
  event: string
  kind: EventRatioKind
  measures: string
  /** ratio, share or median, whichever the entry publishes */
  value: number
  tier?: { min: number; max: number | null; note?: string }
  scope: string
  source: string
  url: string
  grade: string
}

type Entry = {
  id: string; dimension: string; lands?: readonly string[]; event: string; kind: string; measures: string
  ratio?: number; share?: number; median?: number; tier_basis?: string
  tiers?: readonly { min: number; max: number | null; ratio: number; note?: string }[]
  scope: string; source: string; url: string; grade: string
}

/**
 * A published ratio for one event type. Tiered entries need the case's sourced direct cost.
 * Throws when the entry is unknown, a needed direct cost is missing, or no tier covers it.
 */
export function eventRatio(id: string, directCost?: number): EventRatioResult {
  const e = (EVENT_RATIOS.entries as unknown as Entry[]).find(x => x.id === id)
  if (!e) throw new BenchmarkError(`Unknown benchmark "${id}"`)
  let value = e.ratio ?? e.share ?? e.median
  let tier: EventRatioResult['tier']
  if (e.tiers) {
    if (directCost === undefined || !(directCost >= 0))
      throw new BenchmarkError(`"${id}" is tiered by ${e.tier_basis}; the case must give a sourced direct cost`)
    const t = e.tiers.find(t => directCost >= t.min && (t.max === null || directCost < t.max))
    if (!t) throw new BenchmarkError(`"${id}" states no ratio for a direct cost of ${directCost}`)
    value = t.ratio
    tier = { min: t.min, max: t.max, ...(t.note ? { note: t.note } : {}) }
  }
  if (value === undefined) throw new BenchmarkError(`"${id}" has no value`)
  return {
    id, dimension: e.dimension, lands: e.lands ?? [], event: e.event, kind: e.kind as EventRatioKind,
    measures: e.measures, value, ...(tier ? { tier } : {}),
    scope: e.scope, source: e.source, url: e.url, grade: e.grade,
  }
}

/** Final cost ÷ first reported cost, both sourced by the case and in the same unit. */
export function measuredMultiplier(first: number, final: number): number {
  if (!(first > 0) || !(final > 0)) throw new BenchmarkError('Both the first and the final cost must be positive numbers')
  return Math.round((final / first) * 100) / 100
}

export const BENCHMARK_RULES = EVENT_RATIOS.rules
export const EXCLUDED_FOLKLORE = EVENT_RATIOS.excluded_folklore
export const BENCHMARKS_VERSION = EVENT_RATIOS.version
