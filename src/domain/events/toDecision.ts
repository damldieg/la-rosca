import type { Decision } from '../game/types/decision'
import type { HistoryEntry } from '../game/types/gameState'
import type { Event, EventChoice } from './types'

const DECISION_ID_SEPARATOR = ':'

export function choiceToDecision(event: Event, choice: EventChoice): Decision {
  const { id, text: _text, ...effects } = choice
  return { id: `${event.id}${DECISION_ID_SEPARATOR}${id}`, ...effects }
}

/** Event ids already resolved by a past decision, derived from history — no separate "seen" state to track. */
export function resolvedEventIds(history: HistoryEntry[]): Set<string> {
  return new Set(history.map((entry) => entry.decisionId.split(DECISION_ID_SEPARATOR)[0]))
}
