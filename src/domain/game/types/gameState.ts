export type Role = 'puntero' | 'concejal' | 'intendente'

/** Elapsed in-game time, precise to the month. */
export interface GameDate {
  years: number
  months: number
}

/** A relationship id is an arbitrary string key (e.g. "businessman", "unionLeader"). */
export type RelationshipId = string

export interface DecisionEffects {
  money?: number
  power?: number
  popularity?: number
  corruption?: number
  impunity?: number
  structure?: number
  ideologyAlignment?: number
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
  money: number
  power: number
  popularity: number
  corruption: number
  impunity: number
  structure: number
  ideologyAlignment: number
  flags: string[]
  relationships: Record<RelationshipId, number>
  history: HistoryEntry[]
}
