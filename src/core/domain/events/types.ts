import type { Decision } from '../game/types/decision'
import type { DecisionEffects, Ideology, Role } from '../game/types/gameState'
import type { PartyId } from '../party/types'

/**
 * A discriminated-union tree: leaf conditions (role, flag, stat, party, ideology,
 * age) plus AND/OR combinators. A new leaf type (relationships, ...) can be added
 * later as another union member without changing evaluateCondition's shape.
 */
export type Condition =
  | RoleCondition
  | FlagCondition
  | StatCondition
  | PartyCondition
  | IdeologyCondition
  | AgeCondition
  | AndCondition
  | OrCondition

export type NumericOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'

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

export interface StatCondition {
  type: 'stat'
  stat: keyof DecisionEffects
  operator: NumericOperator
  value: number
}

export interface PartyCondition {
  type: 'party'
  operator: 'equals' | 'not_equals'
  value: PartyId
}

export interface IdeologyCondition {
  type: 'ideology'
  axis: keyof Ideology
  operator: NumericOperator
  value: number
}

export interface AgeCondition {
  type: 'age'
  operator: NumericOperator
  value: number
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
