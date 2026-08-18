import type { GameDate } from '../types/gameState'

export function advanceTime(date: GameDate, months: number): GameDate {
  const totalMonths = date.years * 12 + date.months + months
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  }
}
