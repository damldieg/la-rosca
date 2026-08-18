import type { Decision } from '../types/decision'
import type { GameState, Ideology } from '../types/gameState'
import { clamp } from './clamp'
import { advanceTime } from './time'

const BOUNDED_STAT_KEYS = ['power', 'popularity', 'corruption', 'impunity', 'structure'] as const

export function applyDecision(state: GameState, decision: Decision): GameState {
  const effects = decision.effects ?? {}

  const money = state.money + (effects.money ?? 0)

  const boundedStats = Object.fromEntries(
    BOUNDED_STAT_KEYS.map((key) => [key, clamp(state[key] + (effects[key] ?? 0), 0, 100)]),
  ) as Pick<GameState, (typeof BOUNDED_STAT_KEYS)[number]>

  const shiftAxis = (axis: keyof Ideology) =>
    clamp(state.ideology[axis] + (decision.ideology?.[axis] ?? 0), -100, 100)

  const ideology: Ideology = {
    economic: shiftAxis('economic'),
    social: shiftAxis('social'),
    institutional: shiftAxis('institutional'),
  }

  const relationships = { ...state.relationships }
  for (const [id, delta] of Object.entries(decision.relationships ?? {})) {
    relationships[id] = clamp((relationships[id] ?? 0) + delta, -100, 100)
  }

  const addFlags = decision.addFlags ?? []
  const removeFlags = new Set(decision.removeFlags ?? [])
  const flags = [...new Set([...state.flags, ...addFlags])].filter((flag) => !removeFlags.has(flag))

  const role = decision.role ?? state.role

  const date = decision.durationMonths ? advanceTime(state.date, decision.durationMonths) : state.date
  const age = date.years

  const history = [
    ...state.history,
    { decisionId: decision.id, gameDate: date, effects },
  ]

  return {
    ...state,
    money,
    ...boundedStats,
    ideology,
    relationships,
    flags,
    role,
    date,
    age,
    history,
  }
}
