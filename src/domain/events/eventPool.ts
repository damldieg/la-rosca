import type { GameState } from '../game/types/gameState'
import { evaluateConditions } from './conditionEngine'
import type { Event } from './types'

export type EventPool = Event[]

export function getEligibleEvents(pool: EventPool, state: GameState): Event[] {
  return pool.filter((event) => evaluateConditions(event.conditions, state))
}
