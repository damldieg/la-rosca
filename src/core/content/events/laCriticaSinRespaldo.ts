import type { Event } from '../../domain/events/types'

/** The técnica path's own named weakness: real capacity, but no street/structure behind it. */
export const laCriticaSinRespaldo: Event = {
  id: 'la_critica_sin_respaldo',
  title: 'La crítica sin respaldo',
  description: 'Te acusan de ser un funcionario de escritorio, sin ningún respaldo territorial real.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'careerPath', operator: 'equals', value: 'tecnica' },
      { type: 'stat', stat: 'structure', operator: 'lt', value: 25 },
    ],
  },
  choices: [
    {
      id: 'buscar_apoyo_territorial',
      text: 'Reconocer el punto y buscar apoyo territorial',
      relationships: { jefePartidario: 5 },
      effects: { structure: 6, popularity: -2 },
      durationMonths: 2,
    },
    {
      id: 'redoblar_la_apuesta_tecnica',
      text: 'Redoblar la apuesta técnica: los resultados van a hablar por vos',
      effects: { power: 4, popularity: -5 },
      durationMonths: 1,
    },
  ],
}
