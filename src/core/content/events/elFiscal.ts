import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elFiscal: Event = {
  id: 'el_fiscal',
  title: 'El fiscal',
  description: 'El fiscal a cargo del expediente te cita a declarar.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      {
        type: 'or',
        conditions: [
          { type: 'flag', flag: 'sought_legal_contacts', operator: 'exists' },
          { type: 'flag', flag: 'denuncia_avanza', operator: 'exists' },
        ],
      },
    ],
  },
  chainId: 'justicia',
  choices: [
    {
      id: 'negociar_con_el_fiscal',
      text: 'Negociar con el fiscal',
      addFlags: ['negotiated_with_prosecutor'],
      effects: { money: -MONEY_SCALE.LEGAL_CONTACTS, impunity: 10, exposure: 3 },
      relationships: { fiscal: 15 },
      durationMonths: 2,
    },
    {
      id: 'resistir_la_presion',
      text: 'Resistir la presión y no negociar',
      addFlags: ['resisted_prosecutor'],
      effects: { power: 5, exposure: 8 },
      relationships: { fiscal: -15 },
      durationMonths: 2,
    },
  ],
}
