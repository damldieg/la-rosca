import type { PartyId } from '../../party/types'

export type Role =
  | 'puntero'
  | 'concejal'
  | 'asesor'
  | 'intendente'
  | 'diputado'
  | 'senador'
  | 'gobernador'
  | 'ministro'
  | 'presidente'

/** Elapsed in-game time, precise to the month. */
export interface GameDate {
  years: number
  months: number
}

/** A relationship id is an arbitrary string key (e.g. "businessman", "unionLeader"). */
export type RelationshipId = string

/**
 * Multi-axis ideological position, each axis independent and clamped -100..100.
 * Supersedes the old single-scalar ideologyAlignment stat from Phase 1.
 */
export interface Ideology {
  /** -100 estatista .. +100 mercado */
  economic: number
  /** -100 conservador .. +100 progresista */
  social: number
  /** -100 populista/antiinstitucional .. +100 institucionalista */
  institutional: number
}

export interface DecisionEffects {
  money?: number
  power?: number
  popularity?: number
  corruption?: number
  impunity?: number
  structure?: number
  /**
   * How vulnerable the player currently is to consequences for their actions
   * (visibility, evidence, enemies, public attention) — separate from
   * `corruption`, which is how much they've actually done. A politician can
   * be highly corrupt but well-insulated (low exposure), or fairly clean but
   * under intense scrutiny (high exposure). See eventWeight.ts and the
   * el_investigacion_periodistica family of events for how it's used.
   */
  exposure?: number
}

export interface HistoryEntry {
  decisionId: string
  gameDate: GameDate
  effects: DecisionEffects
}

export interface GameState {
  age: number
  date: GameDate
  role: Role
  party: PartyId
  ideology: Ideology
  money: number
  power: number
  popularity: number
  corruption: number
  impunity: number
  structure: number
  exposure: number
  flags: string[]
  relationships: Record<RelationshipId, number>
  history: HistoryEntry[]
}
