import type { Role } from '@/core/domain/game/types/gameState'

export const ROLE_LABELS: Record<Role, string> = {
  puntero: 'Puntero',
  concejal: 'Concejal',
  asesor: 'Asesor',
  intendente: 'Intendente',
  diputado: 'Diputado',
  senador: 'Senador',
  gobernador: 'Gobernador',
  ministro: 'Ministro',
  presidente: 'Presidente',
}

/** Presentation-only flavor — not part of GameState, never read by Domain/Application. */
export const PROTAGONIST_NAME = 'Fernando Rosales'
