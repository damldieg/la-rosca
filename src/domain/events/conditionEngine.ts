import type { GameState } from '../game/types/gameState'
import type { Condition } from './types'

export function evaluateCondition(condition: Condition, state: GameState): boolean {
  switch (condition.type) {
    case 'role':
      return state.role === condition.value
    case 'flag': {
      const has = state.flags.includes(condition.flag)
      return condition.operator === 'exists' ? has : !has
    }
    case 'and':
      return condition.conditions.every((c) => evaluateCondition(c, state))
    case 'or':
      return condition.conditions.some((c) => evaluateCondition(c, state))
  }
}

export function evaluateConditions(conditions: Condition | undefined, state: GameState): boolean {
  return conditions === undefined || evaluateCondition(conditions, state)
}
