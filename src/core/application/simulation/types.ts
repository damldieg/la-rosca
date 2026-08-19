import type { Event, EventChoice } from '../../domain/events/types'
import type {
  CareerPathHistoryEntry,
  CareerPathId,
  GameState,
  Ideology,
  RelationshipId,
  Role,
  RoleHistoryEntry,
} from '../../domain/game/types/gameState'
import type { PartyId } from '../../domain/party/types'
import type { RandomSource } from '../../domain/random/randomSource'

/**
 * Chooses among an event's choices given the current state. Receives the same
 * RandomSource the simulation itself uses, so a policy that needs randomness
 * (e.g. the default uniform pick) stays reproducible under a given seed.
 */
export type DecisionPolicy = (event: Event, state: GameState, random: RandomSource) => EventChoice

/**
 * Summary of one simulated playthrough. Deliberately not the full GameState —
 * only what's needed for aggregate analysis, per the audit's own scope.
 */
export interface SimulationResult {
  seed: number
  partyId: PartyId
  finalRole: Role
  startingAge: number
  finalAge: number
  careerPath: CareerPathId | undefined
  roleHistory: RoleHistoryEntry[]
  careerPathHistory: CareerPathHistoryEntry[]
  turns: number
  /** True when the event pool was exhausted (natural end); false when maxTurns cut the run short. */
  gameOver: boolean
  money: number
  power: number
  popularity: number
  corruption: number
  impunity: number
  structure: number
  exposure: number
  ideology: Ideology
  relationships: Record<RelationshipId, number>
  historyLength: number
  /** Event ids in the order they were actually selected and resolved. */
  eventsVisited: string[]
  /** How many turns each event id was eligible for, regardless of whether it was picked — backs event-dominance/dead-event analysis. */
  eligibleCounts: Record<string, number>
}
