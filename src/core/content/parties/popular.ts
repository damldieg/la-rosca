import { MONEY_SCALE } from '../../domain/game/economy'
import type { PoliticalParty } from '../../domain/party/types'

export const popular: PoliticalParty = {
  id: 'popular',
  name: 'Unidad Popular y Territorial',
  description:
    'Un movimiento de base construido sobre punteros, sindicatos y estructura territorial. Fuerte en la calle, incómodo con las instituciones.',
  ideology: { economic: -40, social: -10, institutional: -50 },
  startingStats: {
    money: MONEY_SCALE.PUNTERO_STARTING - 200_000,
    structure: 30,
  },
  preferredStats: ['structure', 'power'],
  availableRoles: ['puntero', 'concejal', 'intendente', 'gobernador'],
  preferredEventTags: ['sindical', 'territorial'],
}
