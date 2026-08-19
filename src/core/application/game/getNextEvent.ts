import { defaultEventPool } from '../../content/events'
import type { Event } from '../../domain/events/types'
import { getEligibleEvents } from '../../domain/events/eventPool'
import { selectEvent } from '../../domain/events/eventSelector'
import type { EventPool } from '../../domain/events/eventPool'
import { MathRandomSource } from '../../domain/random/randomSource'
import type { RandomSource } from '../../domain/random/randomSource'
import type { GameState } from '../../domain/game/types/gameState'

export function getNextEvent(
  state: GameState,
  random: RandomSource = new MathRandomSource(),
  pool: EventPool = defaultEventPool,
): Event | null {
  const eligible = getEligibleEvents(pool, state)
  return selectEvent(eligible, state, random)
}
