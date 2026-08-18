import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elPeriodista: Event = {
  id: 'el_periodista',
  title: 'El periodista',
  description: 'Un periodista de investigación tiene pruebas de la licitación arreglada y te ofrece silencio a cambio de plata.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'flag', flag: 'accepted_bribe', operator: 'exists' },
    ],
  },
  chainId: 'periodista',
  choices: [
    {
      id: 'bribe_journalist',
      text: 'Pagarle para que no publique',
      addFlags: ['scandal_exposed'],
      effects: { money: -MONEY_SCALE.BRIBE_TO_JOURNALIST, impunity: 15, corruption: 5 },
      relationships: { periodista: -15 },
      durationMonths: 1,
    },
    {
      id: 'let_him_publish',
      text: 'Dejar que publique la nota',
      addFlags: ['scandal_exposed'],
      effects: { popularity: -15 },
      relationships: { periodista: 10 },
      durationMonths: 1,
    },
  ],
}
