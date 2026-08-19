import { describe, expect, it } from 'vitest'
import type { PoliticalParty } from '../../../party/types'
import { createInitialGameState } from '../initialState'

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

describe('createInitialGameState', () => {
  it('returns a valid initial state', () => {
    const state = createInitialGameState(testParty)

    expect(state.age).toBe(18)
    expect(state.date).toEqual({ years: 18, months: 0 })
    expect(state.role).toBe('puntero')
    expect(state.exposure).toBe(0) // unknown politician, not yet on anyone's radar
    expect(state.flags).toEqual([])
    expect(state.relationships).toEqual({})
    expect(state.history).toEqual([])
  })

  it('stores the chosen party and its ideology profile', () => {
    const party: PoliticalParty = { ...testParty, ideology: { economic: 60, social: 10, institutional: 40 } }
    const state = createInitialGameState(party)

    expect(state.party).toBe('popular')
    expect(state.ideology).toEqual({ economic: 60, social: 10, institutional: 40 })
  })

  it('applies the party starting stat overrides on top of the shared base', () => {
    const party: PoliticalParty = { ...testParty, startingStats: { money: 2_000_000, structure: 5 } }
    const state = createInitialGameState(party)

    expect(state.money).toBe(2_000_000)
    expect(state.structure).toBe(5)
    expect(state.power).toBe(10) // untouched base default
  })
})
