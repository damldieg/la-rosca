import type { Event } from '../../domain/events/types'

export const laInvestigacionJudicial: Event = {
  id: 'la_investigacion_judicial',
  title: 'La investigación judicial',
  description: 'El expediente avanza. Peritos, cruces bancarios, testigos.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      {
        type: 'or',
        conditions: [
          { type: 'flag', flag: 'negotiated_with_prosecutor', operator: 'exists' },
          { type: 'flag', flag: 'resisted_prosecutor', operator: 'exists' },
        ],
      },
    ],
  },
  chainId: 'justicia',
  choices: [
    {
      id: 'aportar_pruebas_a_favor_propio',
      text: 'Aportar pruebas a favor propio',
      addFlags: ['judicial_case_reviewed'],
      effects: { impunity: 8, exposure: 5 },
      relationships: { fiscal: 10 },
      durationMonths: 2,
    },
    {
      id: 'guardar_silencio',
      text: 'Guardar silencio',
      addFlags: ['judicial_case_reviewed'],
      effects: { corruption: 3, exposure: 10 },
      relationships: { fiscal: -5 },
      durationMonths: 2,
    },
  ],
}
