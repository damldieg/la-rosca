import { describe, expect, it } from 'vitest'
import { careerDistribution, eventStats } from '../metrics'
import { runSimulationBatch } from '../runSimulationBatch'

describe('runSimulationBatch', () => {
  it('runs gamesPerParty games for every party, with no seed collisions', () => {
    const { results, totalGames } = runSimulationBatch({
      parties: ['popular', 'liberal', 'progresista'],
      gamesPerParty: 10,
      maxTurns: 50,
    })

    expect(totalGames).toBe(30)
    expect(results).toHaveLength(30)
    expect(results.filter((r) => r.partyId === 'popular')).toHaveLength(10)
    expect(results.filter((r) => r.partyId === 'liberal')).toHaveLength(10)
    expect(results.filter((r) => r.partyId === 'progresista')).toHaveLength(10)

    const seeds = results.map((r) => r.seed)
    expect(new Set(seeds).size).toBe(seeds.length) // every game has a unique seed
  })

  it('the same batch config reproduces the exact same set of results', () => {
    const config = { parties: ['popular', 'liberal'] as const, gamesPerParty: 5, maxTurns: 50 }

    const first = runSimulationBatch(config)
    const second = runSimulationBatch(config)

    expect(second).toEqual(first)
  })

  it('results are aggregable by the metrics functions', () => {
    const { results } = runSimulationBatch({ parties: ['popular'], gamesPerParty: 20, maxTurns: 50 })

    const career = careerDistribution(results)
    const totalCareerCount = Object.values(career).reduce((sum, entry) => sum + (entry?.count ?? 0), 0)
    expect(totalCareerCount).toBe(20)

    const stats = eventStats(results)
    expect(stats.length).toBeGreaterThan(0)
    for (const stat of stats) {
      expect(stat.selectedCount).toBeLessThanOrEqual(stat.eligibleCount)
      expect(stat.gamesAppearedIn).toBeLessThanOrEqual(20)
    }
  })
})
