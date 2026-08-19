import type { EventChoice } from '../../domain/events/types'
import type { DecisionPolicy } from './types'

/**
 * Baseline policy: uniformly random among the offered choices, using the same
 * RandomSource the rest of the simulation draws from. This is what answers
 * "how does the system behave", not "what's the best strategy" — see
 * scoredPolicies below for the alternative, opinionated policies.
 */
export const randomDecisionPolicy: DecisionPolicy = (event, _state, random) => {
  const index = Math.min(Math.floor(random.next() * event.choices.length), event.choices.length - 1)
  return event.choices[index]
}

type ChoiceScorer = (choice: EventChoice) => number

/** Peso amount is orders of magnitude larger than the other stats — bring it into a comparable range. */
const MONEY_NORMALIZER = 1_000_000

function relationshipSum(choice: EventChoice): number {
  return Object.values(choice.relationships ?? {}).reduce((sum, delta) => sum + delta, 0)
}

function corruptScore(choice: EventChoice): number {
  const effects = choice.effects ?? {}
  return (effects.money ?? 0) / MONEY_NORMALIZER + (effects.power ?? 0) * 2 + (effects.corruption ?? 0) * 2
}

function popularScore(choice: EventChoice): number {
  const effects = choice.effects ?? {}
  return (effects.popularity ?? 0) * 2 + (effects.structure ?? 0) * 2
}

function institutionalScore(choice: EventChoice): number {
  const effects = choice.effects ?? {}
  return (choice.ideology?.institutional ?? 0) * 2 + relationshipSum(choice) - (effects.corruption ?? 0) * 2
}

/**
 * Highest-scoring choice wins; ties are broken with the RandomSource so the
 * policy stays reproducible instead of always favoring array order.
 */
function scoredPolicy(scorer: ChoiceScorer): DecisionPolicy {
  return (event, _state, random) => {
    const scores = event.choices.map(scorer)
    const bestScore = Math.max(...scores)
    const bestChoices = event.choices.filter((_, i) => scores[i] === bestScore)
    const index = Math.min(Math.floor(random.next() * bestChoices.length), bestChoices.length - 1)
    return bestChoices[index]
  }
}

/** Prioritizes money, power and corruption gains. */
export const corruptDecisionPolicy: DecisionPolicy = scoredPolicy(corruptScore)
/** Prioritizes popularity and structure gains. */
export const popularDecisionPolicy: DecisionPolicy = scoredPolicy(popularScore)
/** Prioritizes institutional ideology, positive relationships, and avoiding corruption. */
export const institutionalDecisionPolicy: DecisionPolicy = scoredPolicy(institutionalScore)

export const decisionPolicies: Record<string, DecisionPolicy> = {
  random: randomDecisionPolicy,
  corrupt: corruptDecisionPolicy,
  popular: popularDecisionPolicy,
  institutional: institutionalDecisionPolicy,
}
