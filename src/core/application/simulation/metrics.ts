import type { Role } from '../../domain/game/types/gameState'
import type { PartyId } from '../../domain/party/types'
import type { SimulationResult } from './types'

export function groupByParty(results: SimulationResult[]): Partial<Record<PartyId, SimulationResult[]>> {
  const groups: Partial<Record<PartyId, SimulationResult[]>> = {}
  for (const result of results) {
    ;(groups[result.partyId] ??= []).push(result)
  }
  return groups
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length
}

export interface RoleCount {
  count: number
  percentage: number
}

export type CareerDistribution = Partial<Record<Role, RoleCount>>

export function careerDistribution(results: SimulationResult[]): CareerDistribution {
  const distribution: CareerDistribution = {}
  for (const result of results) {
    const entry = (distribution[result.finalRole] ??= { count: 0, percentage: 0 })
    entry.count += 1
  }
  for (const entry of Object.values(distribution)) {
    if (entry) entry.percentage = (entry.count / results.length) * 100
  }
  return distribution
}

export interface ResourceSummary {
  mean: number
  min: number
  max: number
}

function summarize(values: number[]): ResourceSummary {
  return values.length === 0 ? { mean: 0, min: 0, max: 0 } : { mean: average(values), min: Math.min(...values), max: Math.max(...values) }
}

export interface DurationSummary {
  averageTurns: number
  averageFinalAge: number
  averageEventsPlayed: number
  shortestTurns: number
  longestTurns: number
}

export function durationSummary(results: SimulationResult[]): DurationSummary {
  const turns = results.map((r) => r.turns)
  return {
    averageTurns: average(turns),
    averageFinalAge: average(results.map((r) => r.finalAge)),
    averageEventsPlayed: average(results.map((r) => r.historyLength)),
    shortestTurns: turns.length === 0 ? 0 : Math.min(...turns),
    longestTurns: turns.length === 0 ? 0 : Math.max(...turns),
  }
}

export interface ResourceAnalysis {
  money: ResourceSummary
  power: ResourceSummary
  popularity: ResourceSummary
  corruption: ResourceSummary
  structure: ResourceSummary
}

export function resourceAnalysis(results: SimulationResult[]): ResourceAnalysis {
  return {
    money: summarize(results.map((r) => r.money)),
    power: summarize(results.map((r) => r.power)),
    popularity: summarize(results.map((r) => r.popularity)),
    corruption: summarize(results.map((r) => r.corruption)),
    structure: summarize(results.map((r) => r.structure)),
  }
}

export interface EventStat {
  id: string
  eligibleCount: number
  selectedCount: number
  /** selectedCount / eligibleCount, across all turns of all games. */
  selectionRate: number
  gamesAppearedIn: number
  /** gamesAppearedIn / total games in the batch. */
  gamesAppearedInRate: number
}

export function eventStats(results: SimulationResult[]): EventStat[] {
  const eligible: Record<string, number> = {}
  const selected: Record<string, number> = {}
  const gamesAppearedIn: Record<string, number> = {}

  for (const result of results) {
    for (const [id, count] of Object.entries(result.eligibleCounts)) {
      eligible[id] = (eligible[id] ?? 0) + count
    }
    for (const id of result.eventsVisited) {
      selected[id] = (selected[id] ?? 0) + 1
    }
    for (const id of new Set(result.eventsVisited)) {
      gamesAppearedIn[id] = (gamesAppearedIn[id] ?? 0) + 1
    }
  }

  const ids = new Set([...Object.keys(eligible), ...Object.keys(selected)])
  return [...ids].map((id) => {
    const eligibleCount = eligible[id] ?? 0
    const selectedCount = selected[id] ?? 0
    const appeared = gamesAppearedIn[id] ?? 0
    return {
      id,
      eligibleCount,
      selectedCount,
      selectionRate: eligibleCount > 0 ? selectedCount / eligibleCount : 0,
      gamesAppearedIn: appeared,
      gamesAppearedInRate: results.length > 0 ? appeared / results.length : 0,
    }
  })
}

/** An event selected in more than `threshold` of games it was eligible in at least once — a candidate dominant event. */
export function dominantEvents(stats: EventStat[], threshold = 0.5): EventStat[] {
  return stats.filter((s) => s.gamesAppearedInRate > threshold).sort((a, b) => b.gamesAppearedInRate - a.gamesAppearedInRate)
}

/** Eligible often but almost never actually picked — a candidate dead event. */
export function deadEvents(stats: EventStat[], minEligible = 50, maxSelectionRate = 0.02): EventStat[] {
  return stats
    .filter((s) => s.eligibleCount >= minEligible && s.selectionRate <= maxSelectionRate)
    .sort((a, b) => a.selectionRate - b.selectionRate)
}

export type RelationshipAnalysis = Record<string, ResourceSummary>

export function relationshipAnalysis(results: SimulationResult[]): RelationshipAnalysis {
  const ids = new Set<string>()
  for (const result of results) {
    for (const id of Object.keys(result.relationships)) ids.add(id)
  }

  const analysis: RelationshipAnalysis = {}
  for (const id of ids) {
    analysis[id] = summarize(results.map((r) => r.relationships[id] ?? 0))
  }
  return analysis
}

export interface ReplayabilityAnalysis {
  totalGames: number
  distinctRoleOutcomes: number
  distinctEventSequences: number
  /** distinctEventSequences / totalGames — 1.0 means every game told a different story. */
  distinctEventSequenceRate: number
}

export function replayabilityAnalysis(results: SimulationResult[]): ReplayabilityAnalysis {
  const roles = new Set(results.map((r) => r.finalRole))
  const sequences = new Set(results.map((r) => r.eventsVisited.join('>')))
  return {
    totalGames: results.length,
    distinctRoleOutcomes: roles.size,
    distinctEventSequences: sequences.size,
    distinctEventSequenceRate: results.length > 0 ? sequences.size / results.length : 0,
  }
}

export interface CareerMilestoneAnalysis {
  reachedSenadorOrAbove: number
  reachedMinistroOrAbove: number
  reachedPresidente: number
  rate: { senadorOrAbove: number; ministroOrAbove: number; presidente: number }
}

const SENIOR_ROLES: Role[] = ['senador', 'gobernador', 'ministro', 'presidente']
const MINISTRO_ROLES: Role[] = ['ministro', 'presidente']

export function careerMilestoneAnalysis(results: SimulationResult[]): CareerMilestoneAnalysis {
  const total = results.length || 1
  const reachedSenadorOrAbove = results.filter((r) => SENIOR_ROLES.includes(r.finalRole)).length
  const reachedMinistroOrAbove = results.filter((r) => MINISTRO_ROLES.includes(r.finalRole)).length
  const reachedPresidente = results.filter((r) => r.finalRole === 'presidente').length

  return {
    reachedSenadorOrAbove,
    reachedMinistroOrAbove,
    reachedPresidente,
    rate: {
      senadorOrAbove: reachedSenadorOrAbove / total,
      ministroOrAbove: reachedMinistroOrAbove / total,
      presidente: reachedPresidente / total,
    },
  }
}
