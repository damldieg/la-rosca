import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laCrisisTerritorial: Event = {
  id: 'la_crisis_territorial',
  title: 'La crisis territorial',
  description: 'El aparato territorial empieza a resistirse: te acusan de haberte alejado de la base.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'party', operator: 'equals', value: 'popular' },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 20 },
      {
        type: 'or',
        conditions: [
          { type: 'relationship', target: 'sindicalista', operator: 'lte', value: -20 },
          { type: 'stat', stat: 'structure', operator: 'lt', value: 30 },
        ],
      },
    ],
  },
  lifecycle: { type: 'cooldown', months: 12 },
  choices: [
    {
      id: 'reforzar_el_territorio',
      text: 'Volver a militar el territorio en persona',
      effects: { structure: 10, money: -MONEY_SCALE.LOCAL_FAVOR },
      relationships: { sindicalista: 10 },
      durationMonths: 2,
    },
    {
      id: 'ignorar_las_bases',
      text: 'Ignorar el reclamo y seguir en la gestión',
      effects: { structure: -15, popularity: -10, exposure: 10 },
      durationMonths: 1,
    },
  ],
}
