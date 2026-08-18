import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laDenuncia: Event = {
  id: 'la_denuncia',
  title: 'La denuncia',
  description: 'Alguien presenta una denuncia formal por la licitación arreglada. Ahora es un expediente.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'flag', flag: 'scandal_exposed', operator: 'exists' },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 10 },
    ],
  },
  chainId: 'justicia',
  choices: [
    {
      id: 'buscar_contactos_en_tribunales',
      text: 'Buscar contactos en tribunales',
      addFlags: ['sought_legal_contacts'],
      effects: { money: -MONEY_SCALE.LEGAL_CONTACTS },
      relationships: { fiscal: 10 },
      durationMonths: 1,
    },
    {
      id: 'dejar_que_avance_la_denuncia',
      text: 'Dejar que la denuncia siga su curso',
      addFlags: ['denuncia_avanza'],
      effects: { popularity: -5 },
      durationMonths: 1,
    },
  ],
}
