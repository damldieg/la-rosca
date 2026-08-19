import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laPerdidaDeFinanciacion: Event = {
  id: 'la_perdida_de_financiacion',
  title: 'La pérdida de financiación',
  description: 'Con tu nombre tan expuesto, tus financistas de siempre empiezan a alejarse.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'stat', stat: 'exposure', operator: 'gte', value: 50 },
      { type: 'relationship', target: 'empresario', operator: 'lt', value: 10 },
    ],
  },
  choices: [
    {
      id: 'buscar_nuevos_financistas',
      text: 'Salir a buscar nuevos financistas',
      effects: { money: -MONEY_SCALE.SMALL_CAMPAIGN_COST },
      durationMonths: 2,
    },
    {
      id: 'ajustar_la_estructura',
      text: 'Ajustar la estructura a lo que hay',
      effects: { structure: -10, popularity: -5 },
      durationMonths: 1,
    },
  ],
}
