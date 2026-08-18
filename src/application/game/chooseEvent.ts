import { choiceToDecision } from '../../domain/events/toDecision'
import type { Event, EventChoice } from '../../domain/events/types'
import type { GameState } from '../../domain/game/types/gameState'
import { makeDecision } from './makeDecision'

/**
 * Resolves a chosen EventChoice for a given Event into a Decision and applies
 * it. Named distinctly from makeDecision(state, decision) (Phase 1.5) rather
 * than overloading it, since the input shape (Event + EventChoice) differs.
 */
export function chooseEvent(state: GameState, event: Event, choice: EventChoice): GameState {
  const decision = choiceToDecision(event, choice)
  return makeDecision(state, decision)
}
