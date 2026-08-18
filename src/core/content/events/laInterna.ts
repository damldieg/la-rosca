import type { Event } from '../../domain/events/types'

export const laInterna: Event = {
  id: 'la_interna',
  title: 'La interna',
  description: 'Se viene una interna partidaria y el jefe quiere saber con quién contar.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'flag', flag: 'loyal_to_boss', operator: 'exists' },
      { type: 'relationship', target: 'jefePartidario', operator: 'gte', value: 20 },
    ],
  },
  chainId: 'partido',
  choices: [
    {
      id: 'disciplinarte_a_la_lista_oficial',
      text: 'Disciplinarte a la lista oficial',
      addFlags: ['toed_the_party_line'],
      effects: { power: 8 },
      relationships: { jefePartidario: 10 },
      durationMonths: 2,
    },
    {
      id: 'jugar_tu_propia_interna',
      text: 'Jugar tu propia interna',
      addFlags: ['challenged_the_boss'],
      effects: { power: 5, popularity: 8 },
      relationships: { jefePartidario: -25 },
      durationMonths: 2,
    },
  ],
}
