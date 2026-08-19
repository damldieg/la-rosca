import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laSupervivenciaDelEscandalo: Event = {
  id: 'la_supervivencia_del_escandalo',
  title: 'La supervivencia del escándalo',
  description: 'El escándalo sigue en danza, pero tu poder y tus contactos todavía pueden contenerlo.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'flag', flag: 'under_investigation', operator: 'exists' },
      { type: 'stat', stat: 'power', operator: 'gte', value: 60 },
      { type: 'relationship', target: 'jefePartidario', operator: 'gte', value: 40 },
    ],
  },
  choices: [
    {
      id: 'usar_tu_influencia_partidaria',
      text: 'Usar tu influencia partidaria para bajarle el perfil',
      effects: { exposure: -20, popularity: -5 },
      relationships: { jefePartidario: 10 },
      durationMonths: 1,
    },
    {
      id: 'comprar_tiempo',
      text: 'Comprar tiempo con buenos abogados',
      effects: { exposure: -10, money: -MONEY_SCALE.LEGAL_CONTACTS },
      durationMonths: 1,
    },
  ],
}
