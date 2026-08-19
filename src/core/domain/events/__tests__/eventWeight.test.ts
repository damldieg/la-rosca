import { describe, expect, it } from 'vitest'
import { elEmpresario } from '../../../content/events/elEmpresario'
import { elFinancista } from '../../../content/events/elFinancista'
import { elSindicato } from '../../../content/events/elSindicato'
import { laLicitacion } from '../../../content/events/laLicitacion'
import { createInitialGameState } from '../../game/state/initialState'
import type { GameState, HistoryEntry } from '../../game/types/gameState'
import type { PoliticalParty } from '../../party/types'
import { calculateEventWeight, DEFAULT_EVENT_WEIGHT, MINIMUM_MILESTONE_WEIGHT } from '../eventWeight'
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

function freshState(overrides: Partial<GameState> = {}): GameState {
  return { ...createInitialGameState(testParty), ...overrides }
}

function historyEntryFor(eventId: string, stepsAgo: number): HistoryEntry[] {
  // stepsAgo=0 means it was the most recent entry; pad with unrelated entries after it.
  const entries: HistoryEntry[] = [{ decisionId: `${eventId}:choice`, gameDate: { years: 18, months: 0 }, effects: {} }]
  for (let i = 0; i < stepsAgo; i++) {
    entries.push({ decisionId: `other_${i}:choice`, gameDate: { years: 18, months: i + 1 }, effects: {} })
  }
  return entries
}

const baseEvent: Event = { id: 'base', title: '', description: '', choices: [] }

describe('calculateEventWeight: defaults and safety', () => {
  it('an event without a weight field gets DEFAULT_EVENT_WEIGHT', () => {
    expect(calculateEventWeight(baseEvent, freshState())).toBe(DEFAULT_EVENT_WEIGHT)
  })

  it('a positive weight is used as-is', () => {
    expect(calculateEventWeight({ ...baseEvent, weight: 37 }, freshState())).toBe(37)
  })

  it('weight 0 yields a final weight of 0 (excluded downstream by the selector)', () => {
    expect(calculateEventWeight({ ...baseEvent, weight: 0 }, freshState())).toBe(0)
  })

  it('a negative weight is treated as 0, never propagated as negative', () => {
    expect(calculateEventWeight({ ...baseEvent, weight: -50 }, freshState())).toBe(0)
  })

  it('is pure: repeated calls with the same input return the same result and never mutate state', () => {
    const state = freshState()
    const snapshot = structuredClone(state)
    const event = { ...baseEvent, weight: 15 }

    const first = calculateEventWeight(event, state)
    const second = calculateEventWeight(event, state)

    expect(first).toBe(second)
    expect(state).toEqual(snapshot)
  })
})

describe('calculateEventWeight: weightModifiers', () => {
  it('a matching modifier adds to the base weight', () => {
    const event: Event = {
      ...baseEvent,
      weight: 10,
      weightModifiers: [{ conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 5 }, modifier: 12 }],
    }

    expect(calculateEventWeight(event, freshState({ power: 10 }))).toBe(22)
  })

  it('a non-matching modifier contributes nothing', () => {
    const event: Event = {
      ...baseEvent,
      weight: 10,
      weightModifiers: [{ conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 50 }, modifier: 12 }],
    }

    expect(calculateEventWeight(event, freshState({ power: 10 }))).toBe(10)
  })

  it('multiple matching modifiers accumulate', () => {
    const event: Event = {
      ...baseEvent,
      weight: 10,
      weightModifiers: [
        { conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 5 }, modifier: 5 },
        { conditions: { type: 'party', operator: 'equals', value: 'popular' }, modifier: 7 },
      ],
    }

    expect(calculateEventWeight(event, freshState({ power: 10 }))).toBe(22)
  })

  it('a negative modifier can reduce weight, floored at 0 rather than going negative', () => {
    const event: Event = {
      ...baseEvent,
      weight: 10,
      weightModifiers: [{ conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 5 }, modifier: -100 }],
    }

    expect(calculateEventWeight(event, freshState({ power: 10 }))).toBe(0)
  })

  it('weight 0 with a matching positive modifier can still become selectable', () => {
    const event: Event = {
      ...baseEvent,
      weight: 0,
      weightModifiers: [{ conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 5 }, modifier: 15 }],
    }

    expect(calculateEventWeight(event, freshState({ power: 10 }))).toBe(15)
  })
})

describe('calculateEventWeight: anti-repetition (recent event penalty)', () => {
  it('an event that just happened (0 steps ago) is penalized', () => {
    const state = freshState({ history: historyEntryFor('base', 0) })
    const weight = calculateEventWeight({ ...baseEvent, weight: 10 }, state)

    expect(weight).toBeLessThan(10)
    expect(weight).toBeGreaterThan(0) // never a permanent block
  })

  it('the penalty fades the further back the last occurrence is', () => {
    const weightAt = (stepsAgo: number) =>
      calculateEventWeight({ ...baseEvent, weight: 10 }, freshState({ history: historyEntryFor('base', stepsAgo) }))

    const justHappened = weightAt(0)
    const oneAgo = weightAt(1)
    const twoAgo = weightAt(2)
    const neverAgain = calculateEventWeight({ ...baseEvent, weight: 10 }, freshState())

    expect(justHappened).toBeLessThan(oneAgo)
    expect(oneAgo).toBeLessThan(twoAgo)
    expect(twoAgo).toBeLessThanOrEqual(neverAgain)
  })

  it('an event that never occurred is not penalized', () => {
    expect(calculateEventWeight({ ...baseEvent, weight: 10 }, freshState())).toBe(10)
  })

  it('is deterministic given the same GameState (no RNG involved)', () => {
    const state = freshState({ history: historyEntryFor('base', 0) })
    const event = { ...baseEvent, weight: 10 }

    expect(calculateEventWeight(event, state)).toBe(calculateEventWeight(event, state))
  })
})

describe('calculateEventWeight: critical/milestone events', () => {
  const milestoneEvent: Event = { ...baseEvent, id: 'milestone', lifecycle: { type: 'milestone' } }

  it('a milestone event is never crowded below MINIMUM_MILESTONE_WEIGHT', () => {
    const crushed: Event = {
      ...milestoneEvent,
      weight: 1,
      weightModifiers: [{ conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 0 }, modifier: -100 }],
    }

    expect(calculateEventWeight(crushed, freshState())).toBe(MINIMUM_MILESTONE_WEIGHT)
  })

  it('a milestone whose computed weight already exceeds the floor keeps its higher value', () => {
    const boosted: Event = { ...milestoneEvent, weight: 200 }
    expect(calculateEventWeight(boosted, freshState())).toBe(200)
  })

  it('a non-milestone event with the same low weight is NOT floored', () => {
    const crushed: Event = {
      ...baseEvent,
      weight: 1,
      weightModifiers: [{ conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 0 }, modifier: -100 }],
    }

    expect(calculateEventWeight(crushed, freshState())).toBe(0)
  })
})

describe('calculateEventWeight: real content wiring', () => {
  it('el_empresario weighs more for a liberal player than a non-liberal one', () => {
    const liberal = calculateEventWeight(elEmpresario, freshState({ party: 'liberal' }))
    const popular = calculateEventWeight(elEmpresario, freshState({ party: 'popular' }))

    expect(liberal).toBeGreaterThan(popular)
  })

  it('el_financista weighs more once economic ideology leans pro-market', () => {
    const marketLeaning = calculateEventWeight(elFinancista, freshState({ ideology: { economic: 40, social: 0, institutional: 0 } }))
    const neutral = calculateEventWeight(elFinancista, freshState({ ideology: { economic: 0, social: 0, institutional: 0 } }))

    expect(marketLeaning).toBeGreaterThan(neutral)
  })

  it("el_financista's role and ideology modifiers both apply and accumulate", () => {
    const both = calculateEventWeight(
      elFinancista,
      freshState({ role: 'concejal', ideology: { economic: 40, social: 0, institutional: 0 } }),
    )
    const ideologyOnly = calculateEventWeight(
      elFinancista,
      freshState({ role: 'puntero', ideology: { economic: 40, social: 0, institutional: 0 } }),
    )

    expect(both).toBeGreaterThan(ideologyOnly)
  })

  it('el_sindicato weighs more for a strongly anti-institutional player', () => {
    const populist = calculateEventWeight(elSindicato, freshState({ ideology: { economic: 0, social: 0, institutional: -30 } }))
    const neutral = calculateEventWeight(elSindicato, freshState({ ideology: { economic: 0, social: 0, institutional: 0 } }))

    expect(populist).toBeGreaterThan(neutral)
  })

  it('la_licitacion weighs more with higher power and a closer businessman relationship', () => {
    const established = calculateEventWeight(
      laLicitacion,
      freshState({ role: 'concejal', power: 25, relationships: { empresario: 35 } }),
    )
    const baseline = calculateEventWeight(laLicitacion, freshState({ role: 'concejal', power: 5, relationships: {} }))

    expect(established).toBeGreaterThan(baseline)
  })
})
