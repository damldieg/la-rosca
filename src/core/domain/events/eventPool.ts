import type { GameState } from '../game/types/gameState'
import { evaluateConditions } from './conditionEngine'
import { isLifecycleEligible } from './eventLifecycle'
import type { Event } from './types'

export type EventPool = Event[]

/**
 * Filters an event's own choices down to the ones whose `conditions` hold for
 * `state` (Fase 8 — lets one event offer genuinely different choices per
 * careerPath, e.g. laOfertaDeFinanciamiento). Returns the original event
 * unchanged when nothing was filtered out, so the ~66 pre-Fase-8 events with
 * no per-choice conditions are never touched. If filtering would leave zero
 * choices, the original (unfiltered) list is kept instead — a defensive
 * fallback so a content mistake can never leave nothing to pick from; the real
 * safety net is that every conditional-choice event must also carry an
 * always-eligible fallback choice.
 */
export function withEligibleChoices(event: Event, state: GameState): Event {
  const eligible = event.choices.filter((choice) => evaluateConditions(choice.conditions, state))
  return eligible.length > 0 && eligible.length < event.choices.length ? { ...event, choices: eligible } : event
}

/**
 * An event is eligible when its conditions hold AND its own lifecycle (oneShot,
 * repeatable, cooldown, milestone — see EventLifecycle) still allows it given
 * what's already in history. Without this, an oneShot event would resurface
 * indefinitely and the pool could never run dry.
 */
export function getEligibleEvents(pool: EventPool, state: GameState): Event[] {
  return pool
    .filter((event) => isLifecycleEligible(event, state) && evaluateConditions(event.conditions, state))
    .map((event) => withEligibleChoices(event, state))
}
