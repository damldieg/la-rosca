import type { Event } from '../../domain/events/types'

export const laEntrevista: Event = {
  id: 'la_entrevista',
  title: 'La primera entrevista',
  description: 'Un periodista de la zona te pide una entrevista para conocerte mejor.',
  conditions: { type: 'role', operator: 'equals', value: 'concejal' },
  chainId: 'periodista',
  weightModifiers: [{ conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' }, modifier: 15 }],
  choices: [
    {
      id: 'dar_la_entrevista',
      text: 'Dar la entrevista',
      addFlags: ['gave_interview'],
      effects: { popularity: 5 },
      relationships: { periodista: 15 },
      durationMonths: 1,
    },
    {
      id: 'evitar_la_prensa',
      text: 'Evitar la prensa por ahora',
      effects: { popularity: -2 },
      relationships: { periodista: -10 },
      durationMonths: 1,
    },
  ],
}
