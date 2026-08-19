import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../game/state/initialState'
import type { PoliticalParty } from '../../party/types'
import { FixedRandomSource, SeededRandomSource, SequenceRandomSource } from '../../random/randomSource'
import { selectEvent } from '../eventSelector'
import type { Event } from '../types'

const testParty: PoliticalParty = {
  id: 'popular',
  name: 'Test Party',
  description: '',
  ideology: { economic: 0, social: 0, institutional: 0 },
  startingStats: {},
  preferredStats: [],
  availableRoles: ['puntero'],
  preferredEventTags: [],
}

function freshState() {
  return createInitialGameState(testParty)
}

const eventA: Event = { id: 'a', title: 'A', description: '', choices: [], weight: 10 }
const eventB: Event = { id: 'b', title: 'B', description: '', choices: [], weight: 20 }
const eventC: Event = { id: 'c', title: 'C', description: '', choices: [], weight: 70 }

describe('selectEvent', () => {
  it('always selects the single eligible event', () => {
    const state = freshState()
    expect(selectEvent([eventA], state, new FixedRandomSource(0))).toEqual(eventA)
    expect(selectEvent([eventA], state, new FixedRandomSource(0.999))).toEqual(eventA)
  })

  it('never selects a weight-0 event', () => {
    const zeroWeight: Event = { id: 'zero', title: '', description: '', choices: [], weight: 0 }
    const state = freshState()

    for (const roll of [0, 0.25, 0.5, 0.75, 0.999]) {
      expect(selectEvent([zeroWeight, eventA], state, new FixedRandomSource(roll))).toEqual(eventA)
    }
  })

  it('returns null when all eligible events have weight 0', () => {
    const zeroA: Event = { id: 'zeroA', title: '', description: '', choices: [], weight: 0 }
    const zeroB: Event = { id: 'zeroB', title: '', description: '', choices: [], weight: 0 }
    const state = freshState()

    expect(selectEvent([zeroA, zeroB], state, new FixedRandomSource(0.5))).toBeNull()
  })

  it('returns null for an empty list', () => {
    expect(selectEvent([], freshState(), new FixedRandomSource(0.5))).toBeNull()
  })

  it('respects the weight boundaries exactly: [A=10, B=20, C=70] over [0,100)', () => {
    const state = freshState()
    const pool = [eventA, eventB, eventC]

    // A: [0, 10) -> roll/100
    expect(selectEvent(pool, state, new FixedRandomSource(0))).toEqual(eventA)
    expect(selectEvent(pool, state, new FixedRandomSource(0.0999))).toEqual(eventA)
    // B: [10, 30)
    expect(selectEvent(pool, state, new FixedRandomSource(0.1))).toEqual(eventB)
    expect(selectEvent(pool, state, new FixedRandomSource(0.2999))).toEqual(eventB)
    // C: [30, 100)
    expect(selectEvent(pool, state, new FixedRandomSource(0.3))).toEqual(eventC)
    expect(selectEvent(pool, state, new FixedRandomSource(0.9999))).toEqual(eventC)
  })

  it('same state + same random sequence always produces the same result (reproducibility)', () => {
    const state = freshState()
    const pool = [eventA, eventB, eventC]

    const run = () => {
      const random = new SeededRandomSource(42)
      return Array.from({ length: 20 }, () => selectEvent(pool, state, random)?.id)
    }

    expect(run()).toEqual(run())
  })

  it('array order does not change the resulting distribution', () => {
    const state = freshState()
    const forward = [eventA, eventB, eventC]
    const reversed = [eventC, eventB, eventA]
    const rolls = Array.from({ length: 2000 }, (_, i) => (i + 0.5) / 2000) // even spread over [0, 1)

    const tally = (pool: Event[]) => {
      const random = new SequenceRandomSource(rolls)
      const counts: Record<string, number> = { a: 0, b: 0, c: 0 }
      for (let i = 0; i < rolls.length; i++) {
        const picked = selectEvent(pool, state, random)
        if (picked) counts[picked.id]++
      }
      return counts
    }

    expect(tally(forward)).toEqual(tally(reversed))
  })
})

describe('selectEvent: weighted distribution (simulation)', () => {
  it('over many draws, selection frequency roughly tracks weight share, and weight-0 never appears', () => {
    const zero: Event = { id: 'zero', title: '', description: '', choices: [], weight: 0 }
    const pool = [eventA, eventB, eventC, zero] // weights 10, 20, 70, 0 -> total 100
    const state = freshState()
    const random = new SeededRandomSource(7)

    const counts: Record<string, number> = { a: 0, b: 0, c: 0, zero: 0 }
    const draws = 10_000
    for (let i = 0; i < draws; i++) {
      const picked = selectEvent(pool, state, random)
      if (picked) counts[picked.id]++
    }

    expect(counts.zero).toBe(0)
    // Generous tolerance (+/- 3 percentage points) to avoid a flaky threshold
    // while still proving low/high weight events land in the right ballpark.
    expect(counts.a / draws).toBeGreaterThan(0.07)
    expect(counts.a / draws).toBeLessThan(0.13)
    expect(counts.b / draws).toBeGreaterThan(0.17)
    expect(counts.b / draws).toBeLessThan(0.23)
    expect(counts.c / draws).toBeGreaterThan(0.67)
    expect(counts.c / draws).toBeLessThan(0.73)
  })
})
