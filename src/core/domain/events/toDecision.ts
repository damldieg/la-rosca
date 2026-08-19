import type { Decision } from '../game/types/decision'
import type { GameDate, HistoryEntry } from '../game/types/gameState'
import type { Event, EventChoice } from './types'

const DECISION_ID_SEPARATOR = ':'

export function choiceToDecision(event: Event, choice: EventChoice): Decision {
  const { id, text: _text, conditions: _conditions, ...effects } = choice
  return { id: `${event.id}${DECISION_ID_SEPARATOR}${id}`, ...effects }
}

function eventIdOf(decisionId: string): string {
  return decisionId.split(DECISION_ID_SEPARATOR)[0]
}

/** Event ids already resolved by a past decision, derived from history — no separate "seen" state to track. */
export function resolvedEventIds(history: HistoryEntry[]): Set<string> {
  return new Set(history.map((entry) => eventIdOf(entry.decisionId)))
}

/** The gameDate of the most recent past occurrence of an event, or null if it never happened. */
export function lastOccurrenceDate(history: HistoryEntry[], eventId: string): GameDate | null {
  const occurrences = history.filter((entry) => eventIdOf(entry.decisionId) === eventId)
  return occurrences.length > 0 ? occurrences[occurrences.length - 1].gameDate : null
}

/**
 * How many history entries ago an event last resolved: 0 means it was the
 * very last thing that happened, 1 means one event has happened since, and so
 * on. Null if it never occurred. Backs the anti-repetition weight penalty —
 * reads the existing history instead of tracking a second "recently seen" list.
 */
export function eventsSinceLastOccurrence(history: HistoryEntry[], eventId: string): number | null {
  for (let i = history.length - 1, stepsAgo = 0; i >= 0; i--, stepsAgo++) {
    if (eventIdOf(history[i].decisionId) === eventId) return stepsAgo
  }
  return null
}
