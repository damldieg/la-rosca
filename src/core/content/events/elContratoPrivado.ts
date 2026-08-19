import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elContratoPrivado: Event = {
  id: 'el_contrato_privado',
  title: 'El contrato privado',
  description: 'Un privado te ofrece un contrato de consultoría, generoso y de dudosa necesidad.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'empresarial' },
  choices: [
    {
      id: 'firmar_el_contrato',
      text: 'Firmarlo',
      relationships: { empresario: 6 },
      effects: { money: MONEY_SCALE.BUSINESS_FINANCING, corruption: 6, exposure: 8 },
      durationMonths: 2,
    },
    {
      id: 'rechazarlo',
      text: 'Rechazarlo, por las dudas',
      effects: { exposure: -3 },
      durationMonths: 1,
    },
  ],
}
