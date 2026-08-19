import type { PartyId } from '../../party/types'

export type Role =
  | 'militante'
  | 'referente'
  | 'puntero'
  | 'concejal'
  | 'asesor'
  | 'intendente'
  | 'diputado'
  | 'senador'
  | 'gobernador'
  | 'ministro'
  | 'presidente'

/**
 * Which trajectory a career is following — territory, technocracy, business,
 * unions, media, or institutions. Never a rigid class: it can change over a
 * playthrough (see CareerPathHistoryEntry) and never blocks a career outright.
 * Set by la_orientacion_politica, unset until then. Shapes identity three ways
 * (Fase 8): nudges event weights (WeightModifier), gates a handful of
 * path-flavored events outright (Condition), and — for a few shared events —
 * changes which choices are even offered (EventChoice.conditions).
 */
export type CareerPathId = 'territorial' | 'tecnica' | 'empresarial' | 'sindical' | 'mediatica' | 'institucional'

/**
 * Elapsed in-game time since the campaign started, precise to the month —
 * always starts at { years: 0, months: 0 }. Distinct from the character's own
 * `age` (see GameState.age): time elapsed in the world vs. years lived by the
 * politician, even though today both simply advance in lockstep from a fixed
 * starting age.
 */
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

/** One entry per actual role change (including the starting role) — see applyDecision.ts. */
export interface RoleHistoryEntry {
  role: Role
  age: number
  gameDate: GameDate
}

/** One entry per actual careerPath change (Fase 8) — mirrors RoleHistoryEntry exactly; see applyDecision.ts. */
export interface CareerPathHistoryEntry {
  careerPath: CareerPathId
  age: number
  gameDate: GameDate
}

export interface GameState {
  /** Character age in years — see GameDate's own doc comment for how this differs from `date`. */
  age: number
  date: GameDate
  role: Role
  careerPath?: CareerPathId
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
  roleHistory: RoleHistoryEntry[]
  careerPathHistory: CareerPathHistoryEntry[]
}
