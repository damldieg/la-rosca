import type { GameState } from '../game/types/gameState'
import { evaluateConditions } from './conditionEngine'
import { eventsSinceLastOccurrence } from './toDecision'
import type { Event } from './types'

/** Weight an event gets when its `weight` field is omitted. */
export const DEFAULT_EVENT_WEIGHT = 10

/**
 * Milestone events must never be crowded out to statistical irrelevance by
 * ordinary competitors or a misconfigured negative modifier — this is the
 * floor their final weight can never fall below. Regular events are exempt:
 * only `lifecycle.type === 'milestone'` gets it.
 */
export const MINIMUM_MILESTONE_WEIGHT = 20

/**
 * An event that resolved very recently is penalized so a repeatable event
 * can't dominate several turns in a row. The penalty fades out linearly and
 * is gone entirely once this many other events have happened since.
 */
const RECENT_EVENT_PENALTY_WINDOW = 3
/** Fraction of weight removed when an event was the very last thing to happen. */
const RECENT_EVENT_PENALTY_STRENGTH = 0.7

function recentEventPenaltyFactor(eventsSince: number | null): number {
  if (eventsSince === null || eventsSince >= RECENT_EVENT_PENALTY_WINDOW) return 1
  const recency = 1 - eventsSince / RECENT_EVENT_PENALTY_WINDOW
  return 1 - RECENT_EVENT_PENALTY_STRENGTH * recency
}

/**
 * Pure and deterministic: same event + same state always yields the same
 * weight, with no mutation and no randomness — all RNG lives in the selector.
 *
 * base (weight ?? DEFAULT_EVENT_WEIGHT, floored at 0)
 *   + sum of weightModifiers whose conditions currently hold
 *   × recent-event penalty (from history, not a separate memory)
 *   → floored at 0, then raised to MINIMUM_MILESTONE_WEIGHT for milestones.
 */
export function calculateEventWeight(event: Event, state: GameState): number {
  const base = Math.max(0, event.weight ?? DEFAULT_EVENT_WEIGHT)
  const modifierSum = (event.weightModifiers ?? [])
    .filter((modifier) => evaluateConditions(modifier.conditions, state))
    .reduce((sum, modifier) => sum + modifier.modifier, 0)
  const penalty = recentEventPenaltyFactor(eventsSinceLastOccurrence(state.history, event.id))
  const weight = Math.max(0, base + modifierSum) * penalty

  const lifecycle = event.lifecycle ?? { type: 'oneShot' }
  return lifecycle.type === 'milestone' ? Math.max(weight, MINIMUM_MILESTONE_WEIGHT) : weight
}
