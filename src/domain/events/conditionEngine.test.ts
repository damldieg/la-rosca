import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../game/state/initialState'
import { evaluateCondition, evaluateConditions } from './conditionEngine'
import type { Condition } from './types'

describe('evaluateCondition', () => {
  it('role condition is true when the role matches', () => {
    const state = createInitialGameState()
    const condition: Condition = { type: 'role', operator: 'equals', value: 'puntero' }

    expect(evaluateCondition(condition, state)).toBe(true)
  })

  it('role condition is false when the role does not match', () => {
    const state = createInitialGameState()
    const condition: Condition = { type: 'role', operator: 'equals', value: 'concejal' }

    expect(evaluateCondition(condition, state)).toBe(false)
  })

  it('flag "exists" condition is true when the flag is present', () => {
    const state = { ...createInitialGameState(), flags: ['accepted_bribe'] }
    const condition: Condition = { type: 'flag', flag: 'accepted_bribe', operator: 'exists' }

    expect(evaluateCondition(condition, state)).toBe(true)
  })

  it('flag "exists" condition is false when the flag is absent', () => {
    const state = createInitialGameState()
    const condition: Condition = { type: 'flag', flag: 'accepted_bribe', operator: 'exists' }

    expect(evaluateCondition(condition, state)).toBe(false)
  })

  it('combines conditions with AND', () => {
    const state = { ...createInitialGameState(), flags: ['accepted_bribe'] }
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
    const state = createInitialGameState()
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
    const state = { ...createInitialGameState(), flags: ['helped_local_club'] }
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
})

describe('evaluateConditions', () => {
  it('is true when there are no conditions', () => {
    const state = createInitialGameState()

    expect(evaluateConditions(undefined, state)).toBe(true)
  })

  it('delegates to evaluateCondition when conditions are present', () => {
    const state = createInitialGameState()
    const condition: Condition = { type: 'role', operator: 'equals', value: 'concejal' }

    expect(evaluateConditions(condition, state)).toBe(false)
  })
})
