import type { Event } from '../../domain/events/types'

/** The institucional path's own named weakness: real reputation, very little apparatus behind it. */
export const laReformaDeGestion: Event = {
  id: 'la_reforma_de_gestion',
  title: 'La reforma de gestión',
  description: 'Sin aparato propio para instalarla, tu reforma de gestión corre el riesgo de quedar en el papel.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'careerPath', operator: 'equals', value: 'institucional' },
      { type: 'stat', stat: 'structure', operator: 'lt', value: 25 },
    ],
  },
  choices: [
    {
      id: 'pedir_apoyo_al_partido',
      text: 'Pedirle estructura prestada al partido',
      relationships: { jefePartidario: 4 },
      effects: { structure: 6, power: -2 },
      durationMonths: 2,
    },
    {
      id: 'sostenerla_solo',
      text: 'Sostenerla solo, apelando a su prestigio técnico',
      effects: { power: 3, popularity: -3 },
      durationMonths: 2,
    },
  ],
}
