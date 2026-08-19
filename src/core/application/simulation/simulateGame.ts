import { defaultEventPool } from '../../content/events'
import { getEligibleEvents } from '../../domain/events/eventPool'
import { selectEvent } from '../../domain/events/eventSelector'
import type { EventPool } from '../../domain/events/eventPool'
import type { PartyId } from '../../domain/party/types'
import { SeededRandomSource } from '../../domain/random/randomSource'
import { chooseEvent } from '../game/chooseEvent'
import { startGame } from '../game/startGame'
import { randomDecisionPolicy } from './decisionPolicy'
import type { DecisionPolicy, SimulationResult } from './types'

export interface SimulationConfig {
  partyId: PartyId
  seed: number
  maxTurns: number
  decisionPolicy?: DecisionPolicy
  /** Defaults to the real content pool — override only for isolated tests. */
  pool?: EventPool
}

/**
 * Plays one full, reproducible game through the real engine: startGame,
 * getEligibleEvents + selectEvent (the same two calls getNextEvent makes —
 * split out here only so eligibility can be tallied for event analytics),
 * and chooseEvent. No gameplay rule is special-cased for simulation.
 */
export function simulateGame(config: SimulationConfig): SimulationResult {
  const { partyId, seed, maxTurns, decisionPolicy = randomDecisionPolicy, pool = defaultEventPool } = config
  const random = new SeededRandomSource(seed)

  let state = startGame(partyId)
  const startingAge = state.age
  const eventsVisited: string[] = []
  const eligibleCounts: Record<string, number> = {}
  let turns = 0
  let gameOver = false

  while (turns < maxTurns) {
    const eligible = getEligibleEvents(pool, state)
    for (const event of eligible) {
      eligibleCounts[event.id] = (eligibleCounts[event.id] ?? 0) + 1
    }

    const event = selectEvent(eligible, state, random)
    if (!event) {
      gameOver = true
      break
    }

    eventsVisited.push(event.id)
    const choice = decisionPolicy(event, state, random)
    state = chooseEvent(state, event, choice)
    turns += 1
  }

  return {
    seed,
    partyId,
    finalRole: state.role,
    startingAge,
    finalAge: state.age,
    careerPath: state.careerPath,
    roleHistory: state.roleHistory,
    careerPathHistory: state.careerPathHistory,
    turns,
    gameOver,
    money: state.money,
    power: state.power,
    popularity: state.popularity,
    corruption: state.corruption,
    impunity: state.impunity,
    structure: state.structure,
    exposure: state.exposure,
    ideology: state.ideology,
    relationships: state.relationships,
    historyLength: state.history.length,
    eventsVisited,
    eligibleCounts,
  }
}
