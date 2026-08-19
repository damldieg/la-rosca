import type { Condition } from '../../domain/events/types'

/**
 * Any role with enough real power to face political-risk consequences —
 * everything except puntero and asesor, which haven't yet acquired anything
 * worth investigating. Shared instead of repeated inline across every risk
 * event that needs it.
 */
export const POLITICAL_OFFICE_CONDITION: Condition = {
  type: 'or',
  conditions: [
    { type: 'role', operator: 'equals', value: 'concejal' },
    { type: 'role', operator: 'equals', value: 'intendente' },
    { type: 'role', operator: 'equals', value: 'diputado' },
    { type: 'role', operator: 'equals', value: 'senador' },
    { type: 'role', operator: 'equals', value: 'gobernador' },
    { type: 'role', operator: 'equals', value: 'ministro' },
    { type: 'role', operator: 'equals', value: 'presidente' },
  ],
}
