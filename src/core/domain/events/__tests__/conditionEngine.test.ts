import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../game/state/initialState'
import type { PoliticalParty } from '../../party/types'
import { evaluateCondition, evaluateConditions } from '../conditionEngine'
import type { Condition } from '../types'

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

describe('evaluateCondition', () => {
  it('role condition is true when the role matches', () => {
    const state = freshState()
    const condition: Condition = { type: 'role', operator: 'equals', value: 'puntero' }

    expect(evaluateCondition(condition, state)).toBe(true)
  })

  it('role condition is false when the role does not match', () => {
    const state = freshState()
    const condition: Condition = { type: 'role', operator: 'equals', value: 'concejal' }

    expect(evaluateCondition(condition, state)).toBe(false)
  })

  it('flag "exists" condition is true when the flag is present', () => {
    const state = { ...freshState(), flags: ['accepted_bribe'] }
    const condition: Condition = { type: 'flag', flag: 'accepted_bribe', operator: 'exists' }

    expect(evaluateCondition(condition, state)).toBe(true)
  })

  it('flag "exists" condition is false when the flag is absent', () => {
    const state = freshState()
    const condition: Condition = { type: 'flag', flag: 'accepted_bribe', operator: 'exists' }

    expect(evaluateCondition(condition, state)).toBe(false)
  })

  it.each([
    ['eq', 10, true],
    ['neq', 10, false],
    ['gt', 5, true],
    ['gte', 10, true],
    ['lt', 20, true],
    ['lte', 10, true],
    ['gt', 10, false],
    ['lt', 10, false],
  ] as const)('stat condition power %s %d -> %s', (operator, value, expected) => {
    const state = freshState() // power starts at 10
    const condition: Condition = { type: 'stat', stat: 'power', operator, value }

    expect(evaluateCondition(condition, state)).toBe(expected)
  })

  it('party condition compares the current party', () => {
    const state = freshState() // party: 'popular'

    expect(evaluateCondition({ type: 'party', operator: 'equals', value: 'popular' }, state)).toBe(true)
    expect(evaluateCondition({ type: 'party', operator: 'equals', value: 'liberal' }, state)).toBe(false)
    expect(evaluateCondition({ type: 'party', operator: 'not_equals', value: 'liberal' }, state)).toBe(true)
  })

  it('ideology condition compares the given axis', () => {
    const party: PoliticalParty = { ...testParty, ideology: { economic: 60, social: 0, institutional: 0 } }
    const state = createInitialGameState(party)

    expect(evaluateCondition({ type: 'ideology', axis: 'economic', operator: 'gte', value: 50 }, state)).toBe(true)
    expect(evaluateCondition({ type: 'ideology', axis: 'social', operator: 'gte', value: 50 }, state)).toBe(false)
  })

  it('relationship condition compares the given target, defaulting to 0 when absent', () => {
    const state = { ...freshState(), relationships: { empresario: 65 } }

    expect(evaluateCondition({ type: 'relationship', target: 'empresario', operator: 'gte', value: 50 }, state)).toBe(
      true,
    )
    expect(evaluateCondition({ type: 'relationship', target: 'empresario', operator: 'lt', value: 50 }, state)).toBe(
      false,
    )
    expect(
      evaluateCondition({ type: 'relationship', target: 'periodista', operator: 'eq', value: 0 }, freshState()),
    ).toBe(true)
  })

  it('combines relationship + stat in a single AND', () => {
    const state = { ...freshState(), relationships: { empresario: 60 }, money: 100 }
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'relationship', target: 'empresario', operator: 'gte', value: 50 },
        { type: 'stat', stat: 'money', operator: 'gte', value: 100 },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)
    expect(evaluateCondition(condition, { ...state, money: 0 })).toBe(false)
  })

  it('combines relationship + party in a single AND', () => {
    const state = { ...freshState(), relationships: { sindicalista: 40 } } // party: 'popular'
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'relationship', target: 'sindicalista', operator: 'gte', value: 30 },
        { type: 'party', operator: 'equals', value: 'popular' },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)
    expect(evaluateCondition(condition, { ...state, party: 'liberal' })).toBe(false)
  })

  it('combines relationship + role in a single AND', () => {
    const state = { ...freshState(), relationships: { jefePartidario: 45 }, role: 'concejal' as const }
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'relationship', target: 'jefePartidario', operator: 'gte', value: 40 },
        { type: 'role', operator: 'equals', value: 'concejal' },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)
    expect(evaluateCondition(condition, { ...state, role: 'puntero' as const })).toBe(false)
  })

  it('combines relationship + flag in a single AND', () => {
    const state = { ...freshState(), relationships: { fiscal: 20 }, flags: ['negotiated_with_prosecutor'] }
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'relationship', target: 'fiscal', operator: 'gte', value: 10 },
        { type: 'flag', flag: 'negotiated_with_prosecutor', operator: 'exists' },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)
    expect(evaluateCondition(condition, { ...state, flags: [] })).toBe(false)
  })

  it('age condition compares the current age', () => {
    const state = freshState() // age starts at 18

    expect(evaluateCondition({ type: 'age', operator: 'gte', value: 18 }, state)).toBe(true)
    expect(evaluateCondition({ type: 'age', operator: 'gte', value: 30 }, state)).toBe(false)
  })

  it('combines conditions with AND', () => {
    const state = { ...freshState(), flags: ['accepted_bribe'] }
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'role', operator: 'equals', value: 'puntero' },
        { type: 'flag', flag: 'accepted_bribe', operator: 'exists' },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)

    const otherRole = { ...state, role: 'concejal' as const }
    expect(evaluateCondition(condition, otherRole)).toBe(false)
  })

  it('combines conditions with OR', () => {
    const state = freshState()
    const condition: Condition = {
      type: 'or',
      conditions: [
        { type: 'role', operator: 'equals', value: 'concejal' },
        { type: 'flag', flag: 'accepted_bribe', operator: 'exists' },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(false)

    const withFlag = { ...state, flags: ['accepted_bribe'] }
    expect(evaluateCondition(condition, withFlag)).toBe(true)
  })

  it('supports nested combinators', () => {
    const state = { ...freshState(), flags: ['helped_local_club'] }
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'role', operator: 'equals', value: 'puntero' },
        {
          type: 'or',
          conditions: [
            { type: 'flag', flag: 'helped_local_club', operator: 'exists' },
            { type: 'flag', flag: 'businessman_ally', operator: 'exists' },
          ],
        },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)
  })

  it('combines party + stat + role + flags in a single AND', () => {
    const state = { ...freshState(), power: 40, flags: ['trusted_by_party'] }
    const condition: Condition = {
      type: 'and',
      conditions: [
        { type: 'role', operator: 'equals', value: 'puntero' },
        { type: 'party', operator: 'equals', value: 'popular' },
        { type: 'stat', stat: 'power', operator: 'gte', value: 30 },
        { type: 'flag', flag: 'trusted_by_party', operator: 'exists' },
      ],
    }

    expect(evaluateCondition(condition, state)).toBe(true)
  })
})

describe('evaluateConditions', () => {
  it('is true when there are no conditions', () => {
    const state = createInitialGameState(testParty)

    expect(evaluateConditions(undefined, state)).toBe(true)
  })

  it('delegates to evaluateCondition when conditions are present', () => {
    const state = createInitialGameState(testParty)
    const condition: Condition = { type: 'role', operator: 'equals', value: 'concejal' }

    expect(evaluateConditions(condition, state)).toBe(false)
  })
})
