import type { GameDate } from '../types/gameState'

export function advanceTime(date: GameDate, months: number): GameDate {
  const totalMonths = date.years * 12 + date.months + months
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  }
}

/** Elapsed months from `from` to `to`, used to evaluate cooldown lifecycles. */
export function monthsBetween(from: GameDate, to: GameDate): number {
  return to.years * 12 + to.months - (from.years * 12 + from.months)
}
