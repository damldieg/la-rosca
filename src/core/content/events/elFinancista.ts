import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elFinancista: Event = {
  id: 'el_financista',
  title: 'El financista',
  description: 'Un fondo de inversión ofrece financiar tu campaña a cambio de acceso privilegiado si llegás al poder.',
  conditions: {
    type: 'and',
    conditions: [
      {
        type: 'or',
        conditions: [
          { type: 'role', operator: 'equals', value: 'puntero' },
          { type: 'role', operator: 'equals', value: 'concejal' },
          { type: 'role', operator: 'equals', value: 'asesor' },
        ],
      },
      { type: 'party', operator: 'equals', value: 'liberal' },
    ],
  },
  choices: [
    {
      id: 'aceptar_financiamiento',
      text: 'Aceptar el financiamiento',
      effects: { money: MONEY_SCALE.BUSINESS_FINANCING, corruption: 8, power: 3 },
      ideology: { economic: 10 },
      durationMonths: 1,
    },
    {
      id: 'rechazar_financiamiento',
      text: 'Rechazar, mantener perfil bajo',
      effects: { popularity: 3 },
      durationMonths: 1,
    },
  ],
}
