import { monthsBetween } from '../game/engine/time'
import type { GameState } from '../game/types/gameState'
import { lastOccurrenceDate, resolvedEventIds } from './toDecision'
import type { Event } from './types'

/**
 * Whether an event's own past occurrences (independent of its `conditions`)
 * still allow it to appear. oneShot/milestone: never again once resolved.
 * repeatable: always again. cooldown: again once enough time has passed.
 */
export function isLifecycleEligible(event: Event, state: GameState): boolean {
  const lifecycle = event.lifecycle ?? { type: 'oneShot' }

  switch (lifecycle.type) {
    case 'oneShot':
    case 'milestone':
      return !resolvedEventIds(state.history).has(event.id)
    case 'repeatable':
      return true
    case 'cooldown': {
      const last = lastOccurrenceDate(state.history, event.id)
      return last === null || monthsBetween(last, state.date) >= lifecycle.months
    }
  }
}
