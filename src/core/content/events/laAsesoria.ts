import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laAsesoria: Event = {
  id: 'la_asesoria',
  title: 'La asesoría',
  description: 'Una fundación te ofrece un cargo de asesor si demostrás cintura política y buena imagen.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'age', operator: 'gte', value: 20 },
      {
        type: 'or',
        conditions: [
          { type: 'party', operator: 'equals', value: 'liberal' },
          { type: 'party', operator: 'equals', value: 'progresista' },
        ],
      },
      { type: 'stat', stat: 'popularity', operator: 'gte', value: 30 },
    ],
  },
  weightModifiers: [
    { conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' }, modifier: 15 },
    { conditions: { type: 'careerPath', operator: 'equals', value: 'institucional' }, modifier: 10 },
  ],
  choices: [
    {
      id: 'aceptar_asesoria',
      text: 'Aceptar el cargo de asesor',
      role: 'asesor',
      effects: { power: 8, money: MONEY_SCALE.LOCAL_FAVOR },
      durationMonths: 3,
    },
    {
      id: 'rechazar_asesoria',
      text: 'Seguir en el territorio',
      effects: { structure: 3 },
      durationMonths: 1,
    },
  ],
}
