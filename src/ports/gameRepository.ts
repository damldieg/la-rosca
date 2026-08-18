import type { GameState } from '../domain/game/types/gameState'

/**
 * Boundary for persisting/loading a GameState. No adapter exists yet in this
 * phase — this only names the seam infrastructure will implement later.
 */
export interface GameRepository {
  save(state: GameState): void
  load(): GameState | null
}
