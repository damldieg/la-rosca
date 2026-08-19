import type { EventPool } from '../../domain/events/eventPool'
import type { PartyId } from '../../domain/party/types'
import { simulateGame } from './simulateGame'
import type { DecisionPolicy, SimulationResult } from './types'

export interface BatchConfig {
  parties: readonly PartyId[]
  gamesPerParty: number
  maxTurns: number
  decisionPolicy?: DecisionPolicy
  /** First seed used; each subsequent game (across all parties) gets the next integer. Defaults to 1. */
  seedStart?: number
  pool?: EventPool
}

export interface BatchResult {
  results: SimulationResult[]
  totalGames: number
}

/**
 * Runs gamesPerParty independent, reproducibly-seeded games for each party.
 * Seeds never collide across the whole batch, so every game in the result
 * set is a distinct, independently reproducible playthrough.
 */
export function runSimulationBatch(config: BatchConfig): BatchResult {
  const { parties, gamesPerParty, maxTurns, decisionPolicy, seedStart = 1, pool } = config

  const results: SimulationResult[] = []
  parties.forEach((partyId, partyIndex) => {
    for (let i = 0; i < gamesPerParty; i++) {
      const seed = seedStart + partyIndex * gamesPerParty + i
      results.push(simulateGame({ partyId, seed, maxTurns, decisionPolicy, pool }))
    }
  })

  return { results, totalGames: results.length }
}
