import type { RelationshipId } from '../game/types/gameState'

export type ActorType = 'person' | 'organization' | 'faction' | 'institution' | 'media'

/**
 * A stable identity for a relationship target. Content declares actors instead
 * of the engine hardcoding character names — see src/core/content/actors/.
 */
export interface Actor {
  /** Same value used as the key in GameState.relationships. */
  id: RelationshipId
  name: string
  type: ActorType
  description: string
}
