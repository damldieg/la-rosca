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
  chainId: 'sindicalista',
  // A more anti-institutional/populist bent makes grassroots union action more likely.
  weightModifiers: [
    { conditions: { type: 'ideology', axis: 'institutional', operator: 'lte', value: -20 }, modifier: 10 },
    { conditions: { type: 'careerPath', operator: 'equals', value: 'sindical' }, modifier: 15 },
  ],
  choices: [
    {
      id: 'liderar_movilizacion',
      text: 'Liderar la movilización',
      effects: { structure: 12, popularity: 6 },
      ideology: { institutional: -5 },
      relationships: { sindicalista: 20 },
      durationMonths: 2,
    },
    {
      id: 'delegar_movilizacion',
      text: 'Delegar en otro referente',
      effects: { structure: 3 },
      relationships: { sindicalista: -5 },
      durationMonths: 1,
    },
  ],
}
