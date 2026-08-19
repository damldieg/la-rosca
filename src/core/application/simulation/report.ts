import { PARTIES } from '../../content/parties'
import {
  ageAtRoleAnalysis,
  careerDistribution,
  careerMilestoneAnalysis,
  careerPathDistribution,
  deadCareerPaths,
  deadEvents,
  dominantEvents,
  durationSummary,
  eventStats,
  groupByParty,
  politicalFallCount,
  relationshipAnalysis,
  replayabilityAnalysis,
  resourceAnalysis,
} from './metrics'
import type { SimulationResult } from './types'

function pct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`
}

function num(value: number, digits = 0): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: digits })
}

/** Plain-text/Markdown summary of a batch — no UI, matches the audit's console/Markdown-only scope. */
export function generateReport(results: SimulationResult[]): string {
  const lines: string[] = []
  const byParty = groupByParty(results)

  lines.push('# Simulation & Balance Audit', '', `Games simulated: ${results.length}`, '')

  for (const [partyId, partyResults] of Object.entries(byParty)) {
    if (!partyResults) continue
    const party = PARTIES[partyId as keyof typeof PARTIES]
    const career = careerDistribution(partyResults)
    const duration = durationSummary(partyResults)
    const resources = resourceAnalysis(partyResults)
    const milestones = careerMilestoneAnalysis(partyResults)
    const replay = replayabilityAnalysis(partyResults)
    const falls = politicalFallCount(partyResults)
    const paths = careerPathDistribution(partyResults)
    const agesByRole = ageAtRoleAnalysis(partyResults)

    lines.push(`## ${party?.name ?? partyId} (${partyResults.length} games)`, '')
    lines.push('### Career distribution')
    for (const [role, count] of Object.entries(career)) {
      if (count) lines.push(`- ${role}: ${count.count} (${count.percentage.toFixed(1)}%)`)
    }
    lines.push('', '### Career path distribution')
    for (const [path, count] of Object.entries(paths)) {
      if (count) lines.push(`- ${path}: ${count.count} (${count.percentage.toFixed(1)}%)`)
    }
    lines.push('', '### Age reached per role (mean / min / max)')
    for (const [role, summary] of Object.entries(agesByRole)) {
      if (summary) lines.push(`- ${role}: ${summary.mean.toFixed(1)} / ${summary.min} / ${summary.max}`)
    }
    lines.push(
      '',
      '### Milestones',
      `- Senador+: ${milestones.reachedSenadorOrAbove} (${pct(milestones.rate.senadorOrAbove)})`,
      `- Ministro+: ${milestones.reachedMinistroOrAbove} (${pct(milestones.rate.ministroOrAbove)})`,
      `- Presidente: ${milestones.reachedPresidente} (${pct(milestones.rate.presidente)})`,
      '',
      '### Duration',
      `- Average turns: ${duration.averageTurns.toFixed(1)} (range ${duration.shortestTurns}-${duration.longestTurns})`,
      `- Average final age: ${duration.averageFinalAge.toFixed(1)}`,
      '',
      '### Resources (mean / min / max)',
      `- Money: ${num(resources.money.mean)} / ${num(resources.money.min)} / ${num(resources.money.max)}`,
      `- Power: ${resources.power.mean.toFixed(1)} / ${resources.power.min} / ${resources.power.max}`,
      `- Popularity: ${resources.popularity.mean.toFixed(1)} / ${resources.popularity.min} / ${resources.popularity.max}`,
      `- Corruption: ${resources.corruption.mean.toFixed(1)} / ${resources.corruption.min} / ${resources.corruption.max}`,
      `- Structure: ${resources.structure.mean.toFixed(1)} / ${resources.structure.min} / ${resources.structure.max}`,
      `- Exposure: ${resources.exposure.mean.toFixed(1)} / ${resources.exposure.min} / ${resources.exposure.max}`,
      '',
      '### Political risk',
      `- Games with at least one political fall: ${falls} (${pct(falls / partyResults.length)})`,
      '',
      '### Replayability',
      `- Distinct event sequences: ${replay.distinctEventSequences}/${replay.totalGames} (${pct(replay.distinctEventSequenceRate)})`,
      `- Distinct final roles reached: ${replay.distinctRoleOutcomes}`,
      '',
    )
  }

  const deadPaths = deadCareerPaths(results)
  lines.push(
    '## Career paths',
    '',
    deadPaths.length === 0
      ? '- no dead career paths (every chosen path reached at least puntero somewhere)'
      : `- dead career paths (chosen but never left militante/referente): ${deadPaths.join(', ')}`,
    '',
  )

  const stats = eventStats(results)
  const dominant = dominantEvents(stats)
  const dead = deadEvents(stats)

  lines.push('## Events', '', '### Dominant (selected in >50% of games it was eligible for)')
  if (dominant.length === 0) lines.push('- none')
  for (const s of dominant.slice(0, 10)) {
    lines.push(`- ${s.id}: in ${pct(s.gamesAppearedInRate)} of games (eligible ${s.eligibleCount}x, selected ${s.selectedCount}x)`)
  }

  lines.push('', '### Dead (eligible often, almost never selected)')
  if (dead.length === 0) lines.push('- none')
  for (const s of dead.slice(0, 10)) {
    lines.push(`- ${s.id}: eligible ${s.eligibleCount}x, selected only ${s.selectedCount}x (${pct(s.selectionRate, 2)})`)
  }

  const relationships = relationshipAnalysis(results)
  lines.push('', '## Relationships (mean / min / max, all parties)')
  for (const [id, summary] of Object.entries(relationships)) {
    lines.push(`- ${id}: ${summary.mean.toFixed(1)} / ${summary.min} / ${summary.max}`)
  }

  return lines.join('\n')
}
