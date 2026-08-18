import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../game/state/initialState'
import type { PoliticalParty } from '../../party/types'
import { getEligibleEvents } from '../eventPool'
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

const punteroEvent: Event = {
  id: 'puntero_event',
  title: 'Puntero event',
  description: '',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  choices: [{ id: 'ok', text: 'ok' }],
}

const concejalEvent: Event = {
  id: 'concejal_event',
  title: 'Concejal event',
  description: '',
  conditions: { type: 'role', operator: 'equals', value: 'concejal' },
  choices: [{ id: 'ok', text: 'ok' }],
}

const unconditionalEvent: Event = {
  id: 'unconditional_event',
  title: 'Unconditional event',
  description: '',
  choices: [{ id: 'ok', text: 'ok' }],
}

const liberalOnlyEvent: Event = {
  id: 'liberal_only_event',
  title: 'Liberal-only event',
  description: '',
  conditions: { type: 'party', operator: 'equals', value: 'liberal' },
  choices: [{ id: 'ok', text: 'ok' }],
}

const highPowerEvent: Event = {
  id: 'high_power_event',
  title: 'High power event',
  description: '',
  conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 50 },
  choices: [{ id: 'ok', text: 'ok' }],
}

const adultEvent: Event = {
  id: 'adult_event',
  title: 'Adult event',
  description: '',
  conditions: { type: 'age', operator: 'gte', value: 30 },
  choices: [{ id: 'ok', text: 'ok' }],
}

describe('getEligibleEvents', () => {
  it('filters out events whose conditions are not met', () => {
    const state = freshState()
    const eligible = getEligibleEvents([punteroEvent, concejalEvent], state)

    expect(eligible).toEqual([punteroEvent])
  })

  it('returns all compatible events', () => {
    const state = freshState()
    const eligible = getEligibleEvents([punteroEvent, unconditionalEvent], state)

    expect(eligible).toEqual([punteroEvent, unconditionalEvent])
  })

  it('does not mutate the GameState', () => {
    const state = freshState()
    const snapshot = structuredClone(state)

    getEligibleEvents([punteroEvent, concejalEvent, unconditionalEvent], state)

    expect(state).toEqual(snapshot)
  })

  it('excludes an event already resolved in history, even if its conditions still hold', () => {
    const state = {
      ...freshState(),
      history: [{ decisionId: 'unconditional_event:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    const eligible = getEligibleEvents([punteroEvent, unconditionalEvent], state)

    expect(eligible).toEqual([punteroEvent])
  })

  it('returns an empty pool once every eligible event has been resolved', () => {
    const state = {
      ...freshState(),
      history: [{ decisionId: 'puntero_event:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    expect(getEligibleEvents([punteroEvent], state)).toEqual([])
  })

  it('an event can depend on party', () => {
    const popularPlayer = freshState() // party: 'popular'
    const liberalPlayer = createInitialGameState({ ...testParty, id: 'liberal' })

    expect(getEligibleEvents([liberalOnlyEvent], popularPlayer)).toEqual([])
    expect(getEligibleEvents([liberalOnlyEvent], liberalPlayer)).toEqual([liberalOnlyEvent])
  })

  it('an event can depend on a stat threshold', () => {
    const lowPower = freshState() // power starts at 10
    const highPower = { ...freshState(), power: 60 }

    expect(getEligibleEvents([highPowerEvent], lowPower)).toEqual([])
    expect(getEligibleEvents([highPowerEvent], highPower)).toEqual([highPowerEvent])
  })

  it('an event can depend on age', () => {
    const young = freshState() // age starts at 18
    const older = { ...freshState(), age: 35 }

    expect(getEligibleEvents([adultEvent], young)).toEqual([])
    expect(getEligibleEvents([adultEvent], older)).toEqual([adultEvent])
  })
})
