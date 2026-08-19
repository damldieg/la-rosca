import type { Event } from '../../domain/events/types'

export const laEntrevistaExclusiva: Event = {
  id: 'la_entrevista_exclusiva',
  title: 'La entrevista exclusiva',
  description: 'Un programa importante te ofrece una entrevista exclusiva en horario central.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' },
  choices: [
    {
      id: 'aceptar_la_exclusiva',
      text: 'Aceptarla',
      relationships: { periodista: 8 },
      effects: { popularity: 8, exposure: 5 },
      durationMonths: 1,
    },
    {
      id: 'declinarla',
      text: 'Declinarla por ahora',
      effects: { exposure: -2 },
      durationMonths: 1,
    },
  ],
}
