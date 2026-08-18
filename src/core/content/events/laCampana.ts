import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laCampana: Event = {
  id: 'la_campana',
  title: 'Día de campaña',
  description: 'Hay que salir a militar antes de la elección interna del partido.',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  choices: [
    {
      id: 'puerta_a_puerta',
      text: 'Caminar el barrio, casa por casa',
      effects: { popularity: 8, structure: 3 },
      durationMonths: 3,
    },
    {
      id: 'gastar_en_boletas',
      text: 'Pagar boletas y pasacalles',
      effects: { money: -MONEY_SCALE.SMALL_CAMPAIGN_COST, structure: 8 },
      durationMonths: 3,
    },
  ],
}
