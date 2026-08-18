import type { DecisionEffects, Ideology, Role } from '../game/types/gameState'

export type PartyId = 'popular' | 'liberal' | 'progresista'

/**
 * A party works like an RPG class: it fixes a starting ideological profile and
 * stat overrides, and — via PartyCondition in content events — which situations
 * and career branches a playthrough can actually reach.
 */
export interface PoliticalParty {
  id: PartyId
  name: string
  description: string
  ideology: Ideology
  /** Absolute overrides applied on top of the shared base initial stats, not deltas. */
  startingStats: Partial<DecisionEffects>
  preferredStats: (keyof DecisionEffects)[]
  initialRelationships?: Record<string, number>
  availableRoles: Role[]
  /**
   * Descriptive authoring metadata for now — not yet matched against an Event
   * field. Real content instead gates itself directly with PartyCondition;
   * this becomes mechanically useful once weighted/tag-based selection exists.
   */
  preferredEventTags: string[]
}
