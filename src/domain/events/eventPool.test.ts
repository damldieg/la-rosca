import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../game/state/initialState'
import { getEligibleEvents } from './eventPool'
import type { Event } from './types'

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

describe('getEligibleEvents', () => {
  it('filters out events whose conditions are not met', () => {
    const state = createInitialGameState()
    const eligible = getEligibleEvents([punteroEvent, concejalEvent], state)

    expect(eligible).toEqual([punteroEvent])
  })

  it('returns all compatible events', () => {
    const state = createInitialGameState()
    const eligible = getEligibleEvents([punteroEvent, unconditionalEvent], state)

    expect(eligible).toEqual([punteroEvent, unconditionalEvent])
  })

  it('does not mutate the GameState', () => {
    const state = createInitialGameState()
    const snapshot = structuredClone(state)

    getEligibleEvents([punteroEvent, concejalEvent, unconditionalEvent], state)

    expect(state).toEqual(snapshot)
  })

  it('excludes an event already resolved in history, even if its conditions still hold', () => {
    const state = {
      ...createInitialGameState(),
      history: [{ decisionId: 'unconditional_event:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    const eligible = getEligibleEvents([punteroEvent, unconditionalEvent], state)

    expect(eligible).toEqual([punteroEvent])
  })

  it('returns an empty pool once every eligible event has been resolved', () => {
    const state = {
      ...createInitialGameState(),
      history: [{ decisionId: 'puntero_event:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    expect(getEligibleEvents([punteroEvent], state)).toEqual([])
  })
})
