import { describe, expect, it } from 'vitest'
import type { PoliticalParty } from '../../../party/types'
import { createInitialGameState } from '../../state/initialState'
import { applyDecision } from '../applyDecision'

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

describe('applyDecision', () => {
  it('modifies money', () => {
    const state = freshState()
    const newState = applyDecision(state, { id: 'sell_favor', effects: { money: 20 } })

    expect(newState.money).toBe(state.money + 20)
  })

  it('modifies multiple stats at once', () => {
    const state = freshState()
    const newState = applyDecision(state, {
      id: 'accept_bribe',
      effects: { money: 20, corruption: 10, power: -5 },
    })

    expect(newState.money).toBe(state.money + 20)
    expect(newState.corruption).toBe(state.corruption + 10)
    expect(newState.power).toBe(state.power - 5)
  })

  it('keeps 0-100 stats within bounds', () => {
    const state = freshState()

    const overMax = applyDecision(state, { id: 'huge_gain', effects: { power: 1000 } })
    expect(overMax.power).toBe(100)

    const underMin = applyDecision(state, { id: 'huge_loss', effects: { power: -1000 } })
    expect(underMin.power).toBe(0)
  })

  it('modifies exposure and keeps it within 0-100, like the other bounded stats (Fase 7)', () => {
    const state = freshState()

    const investigated = applyDecision(state, { id: 'exposed', effects: { exposure: 30 } })
    expect(investigated.exposure).toBe(30)

    const overMax = applyDecision(state, { id: 'huge_exposure', effects: { exposure: 1000 } })
    expect(overMax.exposure).toBe(100)

    const underMin = applyDecision(investigated, { id: 'huge_coverup', effects: { exposure: -1000 } })
    expect(underMin.exposure).toBe(0)
  })

  it('keeps relationships within -100/+100', () => {
    const state = freshState()

    const overMax = applyDecision(state, {
      id: 'huge_favor',
      relationships: { businessman: 1000 },
    })
    expect(overMax.relationships.businessman).toBe(100)

    const underMin = applyDecision(state, {
      id: 'huge_betrayal',
      relationships: { businessman: -1000 },
    })
    expect(underMin.relationships.businessman).toBe(-100)
  })

  it('modifies relationships incrementally', () => {
    const state = freshState()
    const newState = applyDecision(state, {
      id: 'deal',
      relationships: { businessman: 15, unionLeader: -10 },
    })

    expect(newState.relationships).toEqual({ businessman: 15, unionLeader: -10 })
  })

  it('modifies ideology axes independently and keeps them within -100/+100', () => {
    const state = freshState()
    const newState = applyDecision(state, { id: 'shift', ideology: { economic: 15, social: -10 } })

    expect(newState.ideology).toEqual({ economic: 15, social: -10, institutional: 0 })

    const overMax = applyDecision(state, { id: 'huge_shift', ideology: { economic: 1000 } })
    expect(overMax.ideology.economic).toBe(100)
  })

  it('adds flags', () => {
    const state = freshState()
    const newState = applyDecision(state, { id: 'club', addFlags: ['helped_local_club'] })

    expect(newState.flags).toContain('helped_local_club')
  })

  it('removes flags', () => {
    const state = freshState()
    const withFlag = applyDecision(state, { id: 'club', addFlags: ['helped_local_club'] })
    const withoutFlag = applyDecision(withFlag, { id: 'reversal', removeFlags: ['helped_local_club'] })

    expect(withoutFlag.flags).not.toContain('helped_local_club')
  })

  it('advances time by durationMonths', () => {
    const state = freshState()
    const newState = applyDecision(state, { id: 'wait', durationMonths: 3 })

    expect(newState.date).toEqual({ years: 18, months: 3 })
    expect(newState.age).toBe(18)
  })

  it('changes the role', () => {
    const state = freshState()
    const newState = applyDecision(state, { id: 'promotion', role: 'concejal' })

    expect(newState.role).toBe('concejal')
  })

  it('registers the decision in history', () => {
    const state = freshState()
    const newState = applyDecision(state, {
      id: 'accept_bribe',
      effects: { money: 20 },
      durationMonths: 3,
    })

    expect(newState.history).toHaveLength(1)
    expect(newState.history[0]).toEqual({
      decisionId: 'accept_bribe',
      gameDate: { years: 18, months: 3 },
      effects: { money: 20 },
    })
  })

  it('does not mutate the original state', () => {
    const state = freshState()
    const snapshot = structuredClone(state)

    applyDecision(state, {
      id: 'accept_bribe',
      effects: { money: 20, corruption: 10 },
      relationships: { businessman: 15 },
      ideology: { economic: 5 },
      addFlags: ['accepted_bribe'],
      durationMonths: 3,
      role: 'concejal',
    })

    expect(state).toEqual(snapshot)
  })
})
