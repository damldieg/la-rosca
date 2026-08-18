import type { DecisionEffects } from '@/core/domain/game/types/gameState'

export const STAT_LABELS: Record<keyof DecisionEffects, string> = {
  money: 'Dinero',
  power: 'Poder',
  popularity: 'Popularidad',
  corruption: 'Corrupción',
  impunity: 'Impunidad',
  structure: 'Estructura',
  ideologyAlignment: 'Alineamiento ideológico',
}

export function formatStatDelta(key: keyof DecisionEffects, delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return key === 'money' ? `${sign}$${delta}` : `${sign}${delta} ${STAT_LABELS[key]}`
}
