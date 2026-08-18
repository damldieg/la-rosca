import type { Decision } from '../game/types/decision'
import type { Role } from '../game/types/gameState'

/**
 * A discriminated-union tree: leaf conditions (role, flag, ...) plus AND/OR
 * combinators. New leaf types (money, power, relationships, age, ...) can be
 * added later as additional union members without changing evaluateCondition's
 * shape.
 */
export type Condition = RoleCondition | FlagCondition | AndCondition | OrCondition

export interface RoleCondition {
  type: 'role'
  operator: 'equals'
  value: Role
}

export interface FlagCondition {
  type: 'flag'
  flag: string
  operator: 'exists' | 'not_exists'
}

export interface AndCondition {
  type: 'and'
  conditions: Condition[]
}

export interface OrCondition {
  type: 'or'
  conditions: Condition[]
}

/** Everything a Decision needs except its id, which is derived from the event + choice. */
export interface EventChoice extends Omit<Decision, 'id'> {
  id: string
  text: string
}

export interface Event {
  id: string
  title: string
  description: string
  conditions?: Condition
  choices: EventChoice[]
}
