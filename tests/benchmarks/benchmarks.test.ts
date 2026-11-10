import { describe, it, expect } from 'vitest'
import { sectorReach, eventRatio, measuredMultiplier, BenchmarkError, EXCLUDED_FOLKLORE } from '../../src/benchmarks/index.js'

describe('sectorReach (BEA output multipliers)', () => {
  it('returns BEA 2023 published value for construction (summary level)', () => {
    const r = sectorReach('23')
    expect(r.year).toBe(2023)
    expect(r.multiplier).toBeCloseTo(1.9004, 4)
    expect(r.industry).toBe('Construction')
  })
  it('uses the latest year at or before the requested year', () => {
    expect(sectorReach('3361MV', 2017).year).toBe(2017)
    expect(sectorReach('3361MV', 2030).year).toBe(2023)
  })
  it('finds sector-level codes', () => {
    expect(sectorReach('FIRE').level).toBe('sector')
  })
  it('rejects unknown codes and years before the data', () => {
    expect(() => sectorReach('NOPE')).toThrow(BenchmarkError)
    expect(() => sectorReach('23', 1990)).toThrow(BenchmarkError)
  })
})

describe('eventRatio (published, cited ratios)', () => {
  it('picks the OSHA tier from the direct cost', () => {
    expect(eventRatio('osha-injury-indirect', 2500).value).toBe(4.5)
    expect(eventRatio('osha-injury-indirect', 3000).value).toBe(1.6)
    expect(eventRatio('osha-injury-indirect', 50000).value).toBe(1.1)
  })
  it('requires a direct cost for tiered entries', () => {
    expect(() => eventRatio('osha-injury-indirect')).toThrow(/direct cost/)
  })
  it('gives no Hallegatte ratio below $50B direct (none is stated)', () => {
    expect(() => eventRatio('hallegatte-disaster', 10e9)).toThrow(BenchmarkError)
    expect(eventRatio('hallegatte-disaster', 107e9).value).toBe(1.39)
    expect(eventRatio('hallegatte-disaster', 250e9).value).toBe(2)
  })
  it('marks share-price ratios as market_value so they are never added to costs', () => {
    expect(eventRatio('armour-fsa-fine').kind).toBe('market_value')
    expect(eventRatio('armour-fsa-fine').value).toBe(9)
    expect(eventRatio('jarrell-peltzman-drug-recall').value).toBe(12)
  })
  it('rejects unknown entries and lists folklore as excluded', () => {
    expect(() => eventRatio('heinrich-4-to-1')).toThrow(BenchmarkError)
    expect(EXCLUDED_FOLKLORE.some(f => f.startsWith('Heinrich'))).toBe(true)
  })
})

describe('measuredMultiplier', () => {
  it('divides final by first', () => {
    expect(measuredMultiplier(6.5, 32)).toBe(4.92)
  })
  it('rejects zero or missing values', () => {
    expect(() => measuredMultiplier(0, 10)).toThrow(BenchmarkError)
  })
})
