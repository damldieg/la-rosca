import { calculateEventWeight } from './eventWeight'
import type { GameState } from '../game/types/gameState'
import type { RandomSource } from '../random/randomSource'
import type { Event } from './types'

/**
 * Weighted random pick among already-eligible events: each event's chance is
 * proportional to calculateEventWeight(event, state). Zero-weight events are
 * dropped before the draw, so they can never be picked. Array order never
 * affects the resulting distribution — only the weights do.
 */
export function selectEvent(events: Event[], state: GameState, random: RandomSource): Event | null {
  const weighted = events
    .map((event) => ({ event, weight: calculateEventWeight(event, state) }))
    .filter((entry) => entry.weight > 0)

  if (weighted.length === 0) return null

  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0)
  const roll = random.next() * totalWeight

  let cumulative = 0
  for (const entry of weighted) {
    cumulative += entry.weight
    if (roll < cumulative) return entry.event
  }
  // Only reachable if random.next() returned exactly 1 (out of contract) or a
  // floating-point rounding error nudged the last comparison — fall back to
  // the last candidate rather than returning null for a nonempty list.
  return weighted[weighted.length - 1].event
}
