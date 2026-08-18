import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elEmpresario: Event = {
  id: 'el_empresario',
  title: 'El empresario',
  description: 'Un empresario de la zona te ofrece financiar tu carrera a cambio de favores futuros.',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  choices: [
    {
      id: 'accept_partnership',
      text: 'Aceptar el trato',
      addFlags: ['businessman_ally'],
      effects: { money: MONEY_SCALE.BUSINESS_FINANCING, corruption: 5 },
      durationMonths: 2,
    },
    {
      id: 'reject_partnership',
      text: 'Rechazar el trato',
      effects: { popularity: 2 },
      durationMonths: 1,
    },
  ],
}
