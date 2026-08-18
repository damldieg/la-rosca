import type { Event } from '../../domain/events/types'

export const elDesenlaceEmpresario: Event = {
  id: 'el_desenlace_empresario',
  title: 'El desenlace',
  description: 'La investigación sobre la licitación llega a su fin, para bien o para mal.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      {
        type: 'or',
        conditions: [
          { type: 'flag', flag: 'bribed_investigation', operator: 'exists' },
          { type: 'flag', flag: 'cooperated_with_investigation', operator: 'exists' },
        ],
      },
    ],
  },
  chainId: 'empresario',
  choices: [
    {
      id: 'seguir_como_si_nada',
      text: 'Seguir como si nada, ya pasó lo peor',
      effects: { corruption: 3 },
      relationships: { empresario: 10 },
      durationMonths: 1,
    },
    {
      id: 'marcar_distancia_publica',
      text: 'Marcar distancia pública del empresario',
      effects: { popularity: 6, structure: 3 },
      relationships: { empresario: -10 },
      durationMonths: 1,
    },
  ],
}
