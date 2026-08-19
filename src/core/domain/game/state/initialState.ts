import type { PoliticalParty } from '../../party/types'
import type { GameState } from '../types/gameState'

/**
 * Starting values shared by every party, before that party's own startingStats
 * overrides are applied. Placeholders for balancing — centralized here so a
 * future pass only has to touch this file (see also economy.ts for money amounts).
 */
export const BASE_INITIAL_STATS = {
  power: 10,
  popularity: 20,
  corruption: 0,
  impunity: 0,
  structure: 10,
  exposure: 0,
} as const

export function createInitialGameState(party: PoliticalParty): GameState {
  return {
    age: 18,
    date: { years: 18, months: 0 },
    role: 'puntero',
    party: party.id,
    ideology: { ...party.ideology },
    money: 0,
    ...BASE_INITIAL_STATS,
    ...party.startingStats,
    flags: [],
    relationships: { ...(party.initialRelationships ?? {}) },
    history: [],
  }
}
