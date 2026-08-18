import type { DecisionEffects, Ideology, RelationshipId, Role } from './gameState'

export interface Decision {
  id: string
  effects?: DecisionEffects
  relationships?: Record<RelationshipId, number>
  /** Deltas per axis; each axis clamped -100..100 independently, same as relationships. */
  ideology?: Partial<Ideology>
  addFlags?: string[]
  removeFlags?: string[]
  durationMonths?: number
  role?: Role
}
