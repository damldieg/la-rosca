import type { Event } from '../../domain/events/types'

/** The empresarial path's own named weakness: exposure and conflicts of interest pile up. */
export const elConflictoDeIntereses: Event = {
  id: 'el_conflicto_de_intereses',
  title: 'El conflicto de intereses',
  description: 'La prensa empieza a cruzar tus decisiones públicas con tus socios privados.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'careerPath', operator: 'equals', value: 'empresarial' },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 15 },
    ],
  },
  choices: [
    {
      id: 'transparentar_los_vinculos',
      text: 'Transparentar públicamente tus vínculos',
      effects: { exposure: -10, popularity: -4 },
      relationships: { empresario: -5 },
      durationMonths: 2,
    },
    {
      id: 'minimizarlo',
      text: 'Minimizarlo y esperar que pase',
      effects: { exposure: 8 },
      durationMonths: 1,
    },
  ],
}
