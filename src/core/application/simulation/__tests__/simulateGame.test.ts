import { describe, expect, it } from 'vitest'
import type { Event } from '../../../domain/events/types'
import { simulateGame } from '../simulateGame'

describe('simulateGame: reproducibility', () => {
  it('the same seed always produces the exact same result', () => {
    const config = { partyId: 'popular' as const, seed: 12345, maxTurns: 100 }

    const first = simulateGame(config)
    const second = simulateGame(config)

    expect(second).toEqual(first)
  })

  it('different seeds can produce different results', () => {
    const results = [1, 2, 3, 4, 5].map((seed) => simulateGame({ partyId: 'popular', seed, maxTurns: 100 }))
    const sequences = new Set(results.map((r) => r.eventsVisited.join('>')))

    expect(sequences.size).toBeGreaterThan(1)
  })
})

describe('simulateGame: real engine, real pool', () => {
  it('plays a complete game and returns a populated, consistent result', () => {
    const result = simulateGame({ partyId: 'popular', seed: 1, maxTurns: 100 })

    expect(result.seed).toBe(1)
    expect(result.partyId).toBe('popular')
    expect(result.turns).toBeGreaterThan(0)
    expect(result.eventsVisited.length).toBe(result.turns)
    // every applied decision leaves exactly one history entry (see applyDecision.ts)
    expect(result.historyLength).toBe(result.eventsVisited.length)
    expect(typeof result.finalRole).toBe('string')
    expect(typeof result.finalAge).toBe('number')
    expect(result.ideology).toHaveProperty('economic')
    expect(result.ideology).toHaveProperty('social')
    expect(result.ideology).toHaveProperty('institutional')
  })

  it('records eligibility counts for events actually offered along the way', () => {
    const result = simulateGame({ partyId: 'popular', seed: 1, maxTurns: 10 })

    for (const id of result.eventsVisited) {
      expect(result.eligibleCounts[id]).toBeGreaterThan(0)
    }
  })
})

describe('simulateGame: termination', () => {
  it('maxTurns prevents an infinite loop with a repeatable event', () => {
    const infiniteEvent: Event = {
      id: 'infinite',
      title: 'Infinite',
      description: '',
      lifecycle: { type: 'repeatable' },
      choices: [{ id: 'ok', text: 'ok' }],
    }

    const result = simulateGame({ partyId: 'popular', seed: 1, maxTurns: 5, pool: [infiniteEvent] })

    expect(result.turns).toBe(5)
    expect(result.gameOver).toBe(false) // stopped by the cap, not a natural end
    expect(result.eventsVisited).toEqual(['infinite', 'infinite', 'infinite', 'infinite', 'infinite'])
  })

  it('a game with no eligible events ends immediately and correctly', () => {
    const result = simulateGame({ partyId: 'popular', seed: 1, maxTurns: 100, pool: [] })

    expect(result.turns).toBe(0)
    expect(result.gameOver).toBe(true)
    expect(result.eventsVisited).toEqual([])
    expect(result.historyLength).toBe(0)
    expect(result.finalRole).toBe('puntero') // unchanged: no decision was ever applied
  })
})
