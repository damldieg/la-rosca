import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laNegociacion: Event = {
  id: 'la_negociacion',
  title: 'La negociación',
  description: 'El gremio te sienta a discutir una paritaria antes de que la calle se caliente de nuevo.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'party', operator: 'equals', value: 'popular' },
      { type: 'relationship', target: 'sindicalista', operator: 'gte', value: 30 },
    ],
  },
  chainId: 'sindicalista',
  choices: [
    {
      id: 'conceder_la_paritaria',
      text: 'Conceder la paritaria que piden',
      addFlags: ['union_ally'],
      effects: { money: -MONEY_SCALE.UNION_SETTLEMENT, structure: 10 },
      relationships: { sindicalista: 15 },
      durationMonths: 2,
    },
    {
      id: 'endurecer_la_postura',
      text: 'Endurecer la postura',
      effects: { power: 5, popularity: -5 },
      ideology: { institutional: 5 },
      relationships: { sindicalista: -20 },
      durationMonths: 2,
    },
  ],
}
