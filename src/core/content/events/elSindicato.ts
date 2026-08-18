import type { Event } from '../../domain/events/types'

export const elSindicato: Event = {
  id: 'el_sindicato',
  title: 'El sindicato',
  description: 'El gremio te pide encabezar una movilización a cambio de sumarte a su lista de punteros de confianza.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'party', operator: 'equals', value: 'popular' },
    ],
  },
  choices: [
    {
      id: 'liderar_movilizacion',
      text: 'Liderar la movilización',
      effects: { structure: 12, popularity: 6 },
      ideology: { institutional: -5 },
      durationMonths: 2,
    },
    {
      id: 'delegar_movilizacion',
      text: 'Delegar en otro referente',
      effects: { structure: 3 },
      durationMonths: 1,
    },
  ],
}
