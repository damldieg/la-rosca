import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laLicitacion: Event = {
  id: 'la_licitacion',
  title: 'La licitación',
  description: 'Como concejal, tenés que votar una licitación municipal. Tu viejo socio empresario espera que lo favorezcas.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'flag', flag: 'businessman_ally', operator: 'exists' },
    ],
  },
  chainId: 'empresario',
  choices: [
    {
      id: 'favor_empresario',
      text: 'Favorecer a tu socio en la licitación',
      addFlags: ['accepted_bribe'],
      effects: { money: MONEY_SCALE.RIGGED_BID_PAYOUT, corruption: 15, impunity: -10 },
      relationships: { empresario: 15 },
      durationMonths: 4,
    },
    {
      id: 'clean_bid',
      text: 'Votar por la oferta más conveniente para el municipio',
      effects: { popularity: 10, structure: 5 },
      relationships: { empresario: -20 },
      durationMonths: 4,
    },
  ],
}
