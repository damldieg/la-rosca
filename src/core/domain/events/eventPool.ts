import type { GameState } from '../game/types/gameState'
import { evaluateConditions } from './conditionEngine'
import { isLifecycleEligible } from './eventLifecycle'
import type { Event } from './types'

export type EventPool = Event[]

/**
 * An event is eligible when its conditions hold AND its own lifecycle (oneShot,
 * repeatable, cooldown, milestone — see EventLifecycle) still allows it given
 * what's already in history. Without this, an oneShot event would resurface
 * indefinitely and the pool could never run dry.
 */
export function getEligibleEvents(pool: EventPool, state: GameState): Event[] {
  return pool.filter((event) => isLifecycleEligible(event, state) && evaluateConditions(event.conditions, state))
}
