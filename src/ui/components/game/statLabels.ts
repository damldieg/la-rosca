import type { DecisionEffects, Ideology } from '@/core/domain/game/types/gameState'

export const STAT_LABELS: Record<keyof DecisionEffects, string> = {
  money: 'Dinero',
  power: 'Poder',
  popularity: 'Popularidad',
  corruption: 'Corrupción',
  impunity: 'Impunidad',
  structure: 'Estructura',
  exposure: 'Exposición',
}

export const IDEOLOGY_AXIS_LABELS: Record<keyof Ideology, string> = {
  economic: 'Eje económico',
  social: 'Eje social',
  institutional: 'Eje institucional',
}

export function formatStatDelta(key: keyof DecisionEffects, delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return key === 'money' ? `${sign}${formatMoney(delta)}` : `${sign}${delta} ${STAT_LABELS[key]}`
}

export function formatIdeologyDelta(axis: keyof Ideology, delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta} ${IDEOLOGY_AXIS_LABELS[axis]}`
}

/** $10.000.000 / $10M for large amounts — formatting belongs to UI, never to Domain. */
export function formatMoney(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  const abs = Math.abs(amount)
  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000
    const rounded = Math.round(millions * 10) / 10
    return `${sign}$${rounded}M`
  }
  return `${sign}$${abs.toLocaleString('es-AR')}`
}
