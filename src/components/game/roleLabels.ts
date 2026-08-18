import type { Role } from '@/domain/game/types/gameState'

export const ROLE_LABELS: Record<Role, string> = {
  puntero: 'Puntero',
  concejal: 'Concejal',
  intendente: 'Intendente',
}

/** Presentation-only flavor — not part of GameState, never read by Domain/Application. */
export const PROTAGONIST_NAME = 'Fernando Rosales'
