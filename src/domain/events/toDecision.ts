import type { Decision } from '../game/types/decision'
import type { Event, EventChoice } from './types'

export function choiceToDecision(event: Event, choice: EventChoice): Decision {
  const { id, text: _text, ...effects } = choice
  return { id: `${event.id}:${id}`, ...effects }
}
