import type { Event } from '../../domain/events/types'

export const laTraicion: Event = {
  id: 'la_traicion',
  title: 'La traición',
  description: 'Corren rumores de un armado paralelo. El jefe quiere saber si vas a sostenerlo o a romper.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      {
        type: 'or',
        conditions: [
          { type: 'flag', flag: 'toed_the_party_line', operator: 'exists' },
          { type: 'flag', flag: 'challenged_the_boss', operator: 'exists' },
        ],
      },
    ],
  },
  chainId: 'partido',
  choices: [
    {
      id: 'mantenerte_leal',
      text: 'Mantenerte leal al jefe',
      effects: { power: 5 },
      relationships: { jefePartidario: 15 },
      durationMonths: 1,
    },
    {
      id: 'romper_con_el_jefe',
      text: 'Romper con el jefe',
      addFlags: ['broke_with_boss'],
      effects: { popularity: 10, structure: -10 },
      relationships: { jefePartidario: -30 },
      durationMonths: 1,
    },
  ],
}
