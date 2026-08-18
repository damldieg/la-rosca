import type { DecisionEffects, RelationshipId, Role } from './gameState'

export interface Decision {
  id: string
  effects?: DecisionEffects
  relationships?: Record<RelationshipId, number>
  addFlags?: string[]
  removeFlags?: string[]
  durationMonths?: number
  role?: Role
}
