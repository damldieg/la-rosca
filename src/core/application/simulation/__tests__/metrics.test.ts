import { describe, expect, it } from 'vitest'
import type { SimulationResult } from '../types'
import {
  careerDistribution,
  careerMilestoneAnalysis,
  deadEvents,
  dominantEvents,
  durationSummary,
  eventStats,
  relationshipAnalysis,
  replayabilityAnalysis,
  resourceAnalysis,
} from '../metrics'

function fixture(overrides: Partial<SimulationResult> = {}): SimulationResult {
  return {
    seed: 1,
    partyId: 'popular',
    finalRole: 'puntero',
    finalAge: 20,
    turns: 3,
    gameOver: true,
    money: 100,
    power: 10,
    popularity: 10,
    corruption: 0,
    impunity: 0,
    structure: 10,
    ideology: { economic: 0, social: 0, institutional: 0 },
    relationships: {},
    historyLength: 3,
    eventsVisited: ['a', 'b', 'c'],
    eligibleCounts: { a: 1, b: 2, c: 1 },
    ...overrides,
  }
}

describe('careerDistribution', () => {
  it('counts and percentages add up to the total', () => {
    const results = [
      fixture({ finalRole: 'puntero' }),
      fixture({ finalRole: 'puntero' }),
      fixture({ finalRole: 'concejal' }),
      fixture({ finalRole: 'senador' }),
    ]

    const dist = careerDistribution(results)

    expect(dist.puntero?.count).toBe(2)
    expect(dist.puntero?.percentage).toBe(50)
    expect(dist.concejal?.count).toBe(1)
    expect(dist.senador?.count).toBe(1)
    const totalCount = Object.values(dist).reduce((sum, e) => sum + (e?.count ?? 0), 0)
    expect(totalCount).toBe(results.length)
  })
})

describe('durationSummary', () => {
  it('computes averages and range across turns', () => {
    const results = [fixture({ turns: 2 }), fixture({ turns: 4 }), fixture({ turns: 6 })]
    const summary = durationSummary(results)

    expect(summary.averageTurns).toBe(4)
    expect(summary.shortestTurns).toBe(2)
    expect(summary.longestTurns).toBe(6)
  })
})

describe('resourceAnalysis', () => {
  it('summarizes mean/min/max per resource', () => {
    const results = [fixture({ money: 100 }), fixture({ money: 300 }), fixture({ money: 200 })]
    const analysis = resourceAnalysis(results)

    expect(analysis.money).toEqual({ mean: 200, min: 100, max: 300 })
  })
})

describe('eventStats, dominantEvents, deadEvents', () => {
  it('computes selection rate and game-appearance rate per event', () => {
    const results = [
      fixture({ eventsVisited: ['a'], eligibleCounts: { a: 1, b: 5 } }),
      fixture({ eventsVisited: ['a'], eligibleCounts: { a: 1, b: 5 } }),
      fixture({ eventsVisited: ['b'], eligibleCounts: { a: 0, b: 5 } }),
    ]

    const stats = eventStats(results)
    const a = stats.find((s) => s.id === 'a')!
    const b = stats.find((s) => s.id === 'b')!

    expect(a.eligibleCount).toBe(2)
    expect(a.selectedCount).toBe(2)
    expect(a.selectionRate).toBe(1)
    expect(a.gamesAppearedIn).toBe(2)
    expect(a.gamesAppearedInRate).toBeCloseTo(2 / 3)

    expect(b.eligibleCount).toBe(15)
    expect(b.selectedCount).toBe(1)
  })

  it('dominantEvents flags an event selected in most games it appeared in', () => {
    const results = [
      fixture({ eventsVisited: ['dominant'], eligibleCounts: { dominant: 1 } }),
      fixture({ eventsVisited: ['dominant'], eligibleCounts: { dominant: 1 } }),
      fixture({ eventsVisited: ['other'], eligibleCounts: { dominant: 1, other: 1 } }),
    ]

    const dominant = dominantEvents(eventStats(results))
    expect(dominant.map((s) => s.id)).toContain('dominant')
  })

  it('deadEvents flags an event eligible often but almost never picked', () => {
    const results = Array.from({ length: 100 }, (_, i) =>
      fixture({ eventsVisited: i === 0 ? ['dead'] : [], eligibleCounts: { dead: 1 } }),
    )

    const dead = deadEvents(eventStats(results))
    expect(dead.map((s) => s.id)).toContain('dead')
  })
})

describe('relationshipAnalysis', () => {
  it('summarizes each relationship id across all results, treating absence as 0', () => {
    const results = [
      fixture({ relationships: { empresario: 20 } }),
      fixture({ relationships: { empresario: 40 } }),
      fixture({ relationships: {} }), // no empresario relationship at all -> counts as 0
    ]

    const analysis = relationshipAnalysis(results)
    expect(analysis.empresario).toEqual({ mean: 20, min: 0, max: 40 })
  })
})

describe('replayabilityAnalysis', () => {
  it('counts distinct event sequences and distinct final roles', () => {
    const results = [
      fixture({ eventsVisited: ['a', 'b'], finalRole: 'concejal' }),
      fixture({ eventsVisited: ['a', 'b'], finalRole: 'concejal' }), // identical to the first
      fixture({ eventsVisited: ['a', 'c'], finalRole: 'puntero' }),
    ]

    const analysis = replayabilityAnalysis(results)
    expect(analysis.totalGames).toBe(3)
    expect(analysis.distinctEventSequences).toBe(2)
    expect(analysis.distinctRoleOutcomes).toBe(2)
    expect(analysis.distinctEventSequenceRate).toBeCloseTo(2 / 3)
  })
})

describe('careerMilestoneAnalysis', () => {
  it('counts games reaching senador+, ministro+, and presidente', () => {
    const results = [
      fixture({ finalRole: 'puntero' }),
      fixture({ finalRole: 'senador' }),
      fixture({ finalRole: 'ministro' }),
      fixture({ finalRole: 'presidente' }),
    ]

    const analysis = careerMilestoneAnalysis(results)
    expect(analysis.reachedSenadorOrAbove).toBe(3)
    expect(analysis.reachedMinistroOrAbove).toBe(2)
    expect(analysis.reachedPresidente).toBe(1)
  })
})
