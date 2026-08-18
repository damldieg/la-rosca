import type { Event } from '../../domain/events/types'

export const laPresidencia: Event = {
  id: 'la_presidencia',
  title: 'La presidencia',
  description: 'Tu nombre empieza a sonar como candidato presidencial.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'ministro' },
      { type: 'stat', stat: 'power', operator: 'gte', value: 70 },
    ],
  },
  lifecycle: { type: 'milestone' },
  chainId: 'partido',
  choices: [
    {
      id: 'aceptar_la_candidatura_presidencial',
      text: 'Aceptar la candidatura presidencial',
      role: 'presidente',
      addFlags: ['reached_presidency'],
      effects: { power: 20, popularity: 15 },
      durationMonths: 10,
    },
    {
      id: 'declinar_por_ahora',
      text: 'Declinar por ahora',
      effects: { popularity: 3 },
      durationMonths: 1,
    },
  ],
}
