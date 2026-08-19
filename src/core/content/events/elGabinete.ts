import type { Event } from '../../domain/events/types'

export const elGabinete: Event = {
  id: 'el_gabinete',
  title: 'El gabinete',
  description: 'Te ofrecen un ministerio en el gobierno nacional.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'senador' },
      { type: 'age', operator: 'gte', value: 20 },
      { type: 'stat', stat: 'power', operator: 'gte', value: 50 },
    ],
  },
  lifecycle: { type: 'milestone' },
  chainId: 'partido',
  choices: [
    {
      id: 'aceptar_el_ministerio',
      text: 'Aceptar el ministerio',
      role: 'ministro',
      effects: { power: 10, popularity: 8 },
      durationMonths: 6,
    },
    {
      id: 'seguir_en_el_senado',
      text: 'Seguir en el Senado por ahora',
      effects: { structure: 3 },
      durationMonths: 1,
    },
  ],
}
