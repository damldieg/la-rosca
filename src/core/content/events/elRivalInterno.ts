import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'
import { POLITICAL_OFFICE_CONDITION } from './riskConditions'

export const elRivalInterno: Event = {
  id: 'el_rival_interno',
  title: 'El rival interno',
  description: 'Alguien de tu propio espacio empieza a mover fichas para ocupar tu lugar.',
  conditions: {
    type: 'and',
    conditions: [
      POLITICAL_OFFICE_CONDITION,
      { type: 'stat', stat: 'power', operator: 'gte', value: 40 },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 30 },
    ],
  },
  lifecycle: { type: 'cooldown', months: 10 },
  weightModifiers: [
    { conditions: { type: 'relationship', target: 'rivalInterno', operator: 'lte', value: -40 }, modifier: 15 },
    { conditions: { type: 'party', operator: 'equals', value: 'popular' }, modifier: 10 },
  ],
  choices: [
    {
      id: 'negociar_con_el_rival',
      text: 'Negociar un reparto de espacios',
      relationships: { rivalInterno: 20 },
      effects: { money: -MONEY_SCALE.LEGAL_CONTACTS, power: -5 },
      durationMonths: 1,
    },
    {
      id: 'destruir_al_rival',
      text: 'Ir a fondo contra el rival',
      relationships: { rivalInterno: -40 },
      effects: { power: 10, corruption: 10, exposure: 15 },
      durationMonths: 2,
    },
    {
      id: 'aceptar_una_investigacion_interna',
      text: 'Aceptar una auditoría interna para despejar dudas',
      addFlags: ['internal_investigation'],
      effects: { exposure: 10, corruption: -5 },
      durationMonths: 1,
    },
  ],
}
