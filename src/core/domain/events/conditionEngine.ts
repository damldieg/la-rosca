import type { GameState } from '../game/types/gameState'
import type { Condition, NumericOperator } from './types'

function compareNumeric(actual: number, operator: NumericOperator, expected: number): boolean {
  switch (operator) {
    case 'eq':
      return actual === expected
    case 'neq':
      return actual !== expected
    case 'gt':
      return actual > expected
    case 'gte':
      return actual >= expected
    case 'lt':
      return actual < expected
    case 'lte':
      return actual <= expected
  }
}

export function evaluateCondition(condition: Condition, state: GameState): boolean {
  switch (condition.type) {
    case 'role':
      return state.role === condition.value
    case 'flag': {
      const has = state.flags.includes(condition.flag)
      return condition.operator === 'exists' ? has : !has
    }
    case 'stat':
      return compareNumeric(state[condition.stat], condition.operator, condition.value)
    case 'party':
      return condition.operator === 'equals' ? state.party === condition.value : state.party !== condition.value
    case 'ideology':
      return compareNumeric(state.ideology[condition.axis], condition.operator, condition.value)
    case 'age':
      return compareNumeric(state.age, condition.operator, condition.value)
    case 'relationship':
      return compareNumeric(state.relationships[condition.target] ?? 0, condition.operator, condition.value)
    case 'and':
      return condition.conditions.every((c) => evaluateCondition(c, state))
    case 'or':
      return condition.conditions.some((c) => evaluateCondition(c, state))
  }
}

export function evaluateConditions(conditions: Condition | undefined, state: GameState): boolean {
  return conditions === undefined || evaluateCondition(conditions, state)
}
