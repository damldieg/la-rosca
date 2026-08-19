import type { Decision } from '../game/types/decision'
import type { DecisionEffects, Ideology, RelationshipId, Role } from '../game/types/gameState'
import type { PartyId } from '../party/types'

/**
 * A discriminated-union tree: leaf conditions (role, flag, stat, party, ideology,
 * age, relationship) plus AND/OR combinators. A new leaf type can be added later
 * as another union member without changing evaluateCondition's shape.
 */
export type Condition =
  | RoleCondition
  | FlagCondition
  | StatCondition
  | PartyCondition
  | IdeologyCondition
  | AgeCondition
  | RelationshipCondition
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

export interface RelationshipCondition {
  type: 'relationship'
  target: RelationshipId
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

/**
 * A contextual adjustment to an event's base weight: when `conditions` holds
 * against the current GameState, `modifier` is added to the weight (can be
 * negative). Reuses Condition rather than a parallel condition system.
 */
export interface WeightModifier {
  conditions: Condition
  modifier: number
}

/**
 * How an event's own past occurrences affect its future eligibility, on top of
 * (never instead of) its `conditions`. Defaults to `oneShot` when omitted, so
 * every event authored before this field existed keeps its original behavior.
 */
export type EventLifecycle =
  | { type: 'oneShot' }
  | { type: 'repeatable' }
  | { type: 'cooldown'; months: number }
  | { type: 'milestone' }

export interface Event {
  id: string
  title: string
  description: string
  conditions?: Condition
  /** Defaults to oneShot — see EventLifecycle. */
  lifecycle?: EventLifecycle
  /** Purely descriptive grouping for authoring/UI — never read by eligibility logic. */
  chainId?: string
  /**
   * Base weight for weighted selection among eligible events. Defaults to
   * DEFAULT_EVENT_WEIGHT (see eventWeight.ts) when omitted. A negative value
   * is treated as 0 rather than rejected. 0 means "never picked on its own" —
   * weightModifiers can still raise it above 0 for the right context.
   */
  weight?: number
  /** Contextual adjustments layered on top of `weight` — see WeightModifier. */
  weightModifiers?: WeightModifier[]
  choices: EventChoice[]
}
