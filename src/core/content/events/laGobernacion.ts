import type { Event } from '../../domain/events/types'

export const laGobernacion: Event = {
  id: 'la_gobernacion',
  title: 'La gobernación',
  description: 'Tu nombre empieza a sonar para encabezar la boleta a gobernador.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'intendente' },
      { type: 'age', operator: 'gte', value: 21 },
      { type: 'stat', stat: 'power', operator: 'gte', value: 40 },
    ],
  },
  choices: [
    {
      id: 'aceptar_candidatura_gobernador',
      text: 'Aceptar la candidatura',
      role: 'gobernador',
      effects: { power: 20, popularity: 10 },
      durationMonths: 10,
    },
    {
      id: 'consolidar_intendencia',
      text: 'Consolidar primero la intendencia',
      effects: { structure: 5 },
      durationMonths: 2,
    },
  ],
}
