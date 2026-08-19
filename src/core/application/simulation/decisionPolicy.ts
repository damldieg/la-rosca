import type { EventChoice } from '../../domain/events/types'
import type { CareerPathId } from '../../domain/game/types/gameState'
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

const ALL_CAREER_PATHS: CareerPathId[] = ['territorial', 'tecnica', 'empresarial', 'sindical', 'mediatica', 'institucional']

/**
 * Simulation-only (Fase 9 §13): scores a choice by whether it moves the
 * player toward `targetCareerPath` — a choice that sets it wins outright, one
 * that sets a *different* path loses outright, and among choices that don't
 * touch careerPath at all it falls back to a mild power/popularity/structure
 * preference so the playthrough still makes reasonable progress. This exists
 * purely to answer "can this path be built deliberately if that's the whole
 * goal" — the real game never uses a DecisionPolicy at all, since a human
 * player picks their own EventChoice directly.
 */
function careerFocusedScorer(targetCareerPath: CareerPathId): ChoiceScorer {
  return (choice) => {
    if (choice.careerPath === targetCareerPath) return 1000
    if (choice.careerPath !== undefined) return -1000
    const effects = choice.effects ?? {}
    return (effects.power ?? 0) + (effects.popularity ?? 0) + (effects.structure ?? 0) * 0.5
  }
}

export function createCareerFocusedPolicy(targetCareerPath: CareerPathId): DecisionPolicy {
  return scoredPolicy(careerFocusedScorer(targetCareerPath))
}

/** One ready-made career-focused policy per path, for directed simulation batches (Fase 9 §14). */
export const careerFocusedDecisionPolicies: Record<CareerPathId, DecisionPolicy> = Object.fromEntries(
  ALL_CAREER_PATHS.map((path) => [path, createCareerFocusedPolicy(path)]),
) as Record<CareerPathId, DecisionPolicy>
