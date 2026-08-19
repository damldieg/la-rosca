import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laMulta: Event = {
  id: 'la_multa',
  title: 'La multa',
  description: 'Un organismo de control te aplica una multa por irregularidades administrativas.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 40 },
      { type: 'stat', stat: 'exposure', operator: 'gte', value: 50 },
    ],
  },
  lifecycle: { type: 'cooldown', months: 8 },
  choices: [
    {
      id: 'pagar_la_multa',
      text: 'Pagar la multa y seguir adelante',
      effects: { money: -MONEY_SCALE.LEGAL_CONTACTS, exposure: -10 },
      durationMonths: 1,
    },
    {
      id: 'apelar_en_los_tribunales',
      text: 'Apelar en los tribunales',
      effects: { money: -MONEY_SCALE.LOCAL_FAVOR },
      relationships: { fiscal: -10 },
      durationMonths: 2,
    },
  ],
}
