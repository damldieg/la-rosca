import { createInitialGameState } from '../../domain/game/state/initialState'
import type { GameState } from '../../domain/game/types/gameState'

export function startGame(): GameState {
  return createInitialGameState()
}
