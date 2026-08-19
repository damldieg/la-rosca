import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laFiltracion: Event = {
  id: 'la_filtracion',
  title: 'La filtración',
  description: 'Un chat interno tuyo circula entre periodistas. Ya no depende de vos si sale publicado.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'relationship', target: 'periodista', operator: 'lte', value: -30 },
      { type: 'stat', stat: 'exposure', operator: 'gte', value: 40 },
    ],
  },
  weightModifiers: [
    { conditions: { type: 'stat', stat: 'exposure', operator: 'gte', value: 60 }, modifier: 20 },
    { conditions: { type: 'relationship', target: 'periodista', operator: 'lte', value: -50 }, modifier: 20 },
  ],
  choices: [
    {
      id: 'controlar_el_dano',
      text: 'Controlar el daño con una operación de prensa',
      effects: { money: -MONEY_SCALE.MEDIA_OPERATION, exposure: -10 },
      durationMonths: 1,
    },
    {
      id: 'atacar_la_filtracion',
      text: 'Denunciar la filtración como un ataque orquestado',
      relationships: { periodista: -20 },
      effects: { power: 5, exposure: 10 },
      durationMonths: 1,
    },
    {
      id: 'transparentar_todo',
      text: 'Transparentar todo antes de que lo hagan por vos',
      addFlags: ['radical_transparency'],
      effects: { corruption: -15, popularity: 8, exposure: -20 },
      ideology: { institutional: 10 },
      durationMonths: 1,
    },
  ],
}
