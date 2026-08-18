import type { Event } from '../../domain/events/types'

export const losMedios: Event = {
  id: 'los_medios',
  title: 'Los medios',
  description: 'Un ciclo de streaming te invita a debatir. Es una vidriera enorme si sabés jugarla.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'party', operator: 'equals', value: 'progresista' },
    ],
  },
  choices: [
    {
      id: 'aprovechar_vidriera',
      text: 'Aprovechar la vidriera',
      effects: { popularity: 15, power: 4 },
      durationMonths: 1,
    },
    {
      id: 'evitar_polemica',
      text: 'Evitar la polémica',
      effects: { popularity: -2 },
      durationMonths: 1,
    },
  ],
}
