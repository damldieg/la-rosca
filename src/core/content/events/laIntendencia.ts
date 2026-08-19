import type { Event } from '../../domain/events/types'

export const laIntendencia: Event = {
  id: 'la_intendencia',
  title: 'La intendencia',
  description: 'El partido te ofrece encabezar la lista a intendente en la próxima elección.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'age', operator: 'gte', value: 20 },
      { type: 'flag', flag: 'trusted_by_party', operator: 'exists' },
    ],
  },
  weightModifiers: [{ conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' }, modifier: 15 }],
  choices: [
    {
      id: 'aceptar_candidatura_intendente',
      text: 'Aceptar encabezar la lista',
      role: 'intendente',
      effects: { power: 15, popularity: 10 },
      durationMonths: 10,
    },
    {
      id: 'esperar_tu_momento',
      text: 'Todavía no es tu momento',
      effects: { popularity: 3 },
      durationMonths: 1,
    },
  ],
}
