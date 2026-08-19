import type { Event } from '../../domain/events/types'

/** The sindical path's own named weakness: mobilization power comes with employer-side enemies. */
export const elParoGeneral: Event = {
  id: 'el_paro_general',
  title: 'El paro general',
  description: 'El gremio evalúa ir a un paro general y quiere saber si contás con vos.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'sindical' },
  choices: [
    {
      id: 'apoyar_el_paro',
      text: 'Apoyarlo públicamente',
      relationships: { sindicalista: 10, empresario: -12 },
      effects: { popularity: 4, power: 3 },
      durationMonths: 1,
    },
    {
      id: 'buscar_una_salida_negociada',
      text: 'Buscar una salida negociada antes de llegar al paro',
      relationships: { sindicalista: 2, empresario: 2 },
      effects: { power: -2 },
      durationMonths: 2,
    },
  ],
}
