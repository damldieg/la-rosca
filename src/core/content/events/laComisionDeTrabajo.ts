import type { Event } from '../../domain/events/types'

/** Fase 9: career-path evolution, sindical -> institucional, at the diputado stage. */
export const laComisionDeTrabajo: Event = {
  id: 'la_comision_de_trabajo',
  title: 'La comisión de trabajo',
  description: 'Te ofrecen presidir una comisión legislativa de trabajo y relaciones laborales.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'diputado' },
      { type: 'careerPath', operator: 'equals', value: 'sindical' },
    ],
  },
  choices: [
    {
      id: 'presidir_la_comision',
      text: 'Presidir la comisión',
      careerPath: 'institucional',
      relationships: { fiscal: 5, sindicalista: -3 },
      effects: { power: 6 },
      ideology: { institutional: 8 },
      durationMonths: 3,
    },
    {
      id: 'seguir_representando_al_gremio',
      text: 'Seguir representando al gremio de cerca',
      relationships: { sindicalista: 4 },
      effects: { structure: 2 },
      durationMonths: 1,
    },
  ],
}
