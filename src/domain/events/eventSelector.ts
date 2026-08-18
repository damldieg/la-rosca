import type { Event } from './types'

/**
 * Deterministic for now: the first eligible event, in pool order. No RNG in
 * this phase (see governance decision log) — a later phase can add a
 * randomSource/weighting parameter without changing this contract.
 */
export function selectEvent(events: Event[]): Event | null {
  return events[0] ?? null
}
