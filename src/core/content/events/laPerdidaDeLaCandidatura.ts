import type { Event } from '../../domain/events/types'

export const laPerdidaDeLaCandidatura: Event = {
  id: 'la_perdida_de_la_candidatura',
  title: 'La pérdida de la candidatura',
  description: 'El armado nacional no quiere cargar con tu escándalo en la boleta.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'diputado' },
      { type: 'flag', flag: 'under_investigation', operator: 'exists' },
      { type: 'stat', stat: 'power', operator: 'lt', value: 40 },
    ],
  },
  choices: [
    {
      id: 'bajarte_de_la_lista',
      text: 'Bajarte de la lista antes de que te bajen',
      role: 'asesor',
      effects: { popularity: 3, exposure: -25 },
      durationMonths: 2,
    },
    {
      id: 'pelear_tu_lugar',
      text: 'Pelear tu lugar en la interna',
      effects: { power: -10, popularity: -10, exposure: 10 },
      durationMonths: 2,
    },
  ],
}
