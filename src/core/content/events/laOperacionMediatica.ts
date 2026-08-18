import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laOperacionMediatica: Event = {
  id: 'la_operacion_mediatica',
  title: 'La operación mediática',
  description: 'El periodista con el que tenés buena onda te ofrece instalar una nota favorable.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'relationship', target: 'periodista', operator: 'gte', value: 20 },
    ],
  },
  chainId: 'periodista',
  choices: [
    {
      id: 'orquestar_la_nota_positiva',
      text: 'Orquestar la nota positiva',
      effects: { popularity: 10, money: -MONEY_SCALE.MEDIA_OPERATION },
      relationships: { periodista: 10 },
      durationMonths: 1,
    },
    {
      id: 'dejar_pasar_la_oportunidad',
      text: 'Dejar pasar la oportunidad',
      effects: { popularity: 2 },
      relationships: { periodista: -5 },
      durationMonths: 1,
    },
  ],
}
