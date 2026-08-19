import type { Event } from '../../domain/events/types'

export const laOportunidad: Event = {
  id: 'la_oportunidad',
  title: 'La oportunidad',
  description: 'El partido te ofrece un lugar en la lista a concejal, en reconocimiento a tu trabajo territorial.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'age', operator: 'gte', value: 20 },
      { type: 'flag', flag: 'helped_local_club', operator: 'exists' },
    ],
  },
  choices: [
    {
      id: 'accept_candidacy',
      text: 'Aceptar la candidatura',
      role: 'concejal',
      effects: { power: 10, popularity: 5 },
      durationMonths: 8,
    },
    {
      id: 'decline_candidacy',
      text: 'Rechazar, todavía no estás listo',
      effects: { popularity: 2 },
      durationMonths: 1,
    },
  ],
}
