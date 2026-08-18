import type { GameState } from '../game/types/gameState'
import { evaluateConditions } from './conditionEngine'
import { resolvedEventIds } from './toDecision'
import type { Event } from './types'

export type EventPool = Event[]

/**
 * An event already resolved (its id appears in history) is excluded — otherwise a
 * still-eligible event would resurface indefinitely, and the pool could never run dry.
 */
export function getEligibleEvents(pool: EventPool, state: GameState): Event[] {
  const resolved = resolvedEventIds(state.history)
  return pool.filter((event) => !resolved.has(event.id) && evaluateConditions(event.conditions, state))
}
