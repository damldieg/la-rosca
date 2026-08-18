import type { GameState } from '../types/gameState'

/**
 * Starting values for stats not fixed by spec (age/role are). Placeholders for
 * Phase 1 scaffolding — centralized here so future balancing only touches this file.
 */
export const INITIAL_STATS = {
  money: 0,
  power: 10,
  popularity: 20,
  corruption: 0,
  impunity: 0,
  structure: 10,
  ideologyAlignment: 50,
} as const

export function createInitialGameState(): GameState {
  return {
    age: 18,
    date: { years: 18, months: 0 },
    role: 'puntero',
    ...INITIAL_STATS,
    flags: [],
    relationships: {},
    history: [],
  }
}
