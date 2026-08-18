import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elEmpresario: Event = {
  id: 'el_empresario',
  title: 'El empresario',
  description: 'Un empresario de la zona te ofrece financiar tu carrera a cambio de favores futuros.',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  chainId: 'empresario',
  choices: [
    {
      id: 'accept_partnership',
      text: 'Aceptar el trato',
      addFlags: ['businessman_ally'],
      effects: { money: MONEY_SCALE.BUSINESS_FINANCING, corruption: 5 },
      relationships: { empresario: 20 },
      durationMonths: 2,
    },
    {
      id: 'reject_partnership',
      text: 'Rechazar el trato',
      effects: { popularity: 2 },
      relationships: { empresario: -10 },
      durationMonths: 1,
    },
  ],
}
