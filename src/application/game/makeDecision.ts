import { applyDecision } from '../../domain/game/engine/applyDecision'
import type { Decision } from '../../domain/game/types/decision'
import type { GameState } from '../../domain/game/types/gameState'

export function makeDecision(state: GameState, decision: Decision): GameState {
  return applyDecision(state, decision)
}
