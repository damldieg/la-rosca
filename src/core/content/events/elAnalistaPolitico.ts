import type { Event } from '../../domain/events/types'

/** Fase 9: career-path evolution, institucional -> mediatica. */
export const elAnalistaPolitico: Event = {
  id: 'el_analista_politico',
  title: 'El analista político',
  description: 'Una señal de noticias te ofrece ser panelista fijo de un programa de análisis político.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'or', conditions: [{ type: 'role', operator: 'equals', value: 'asesor' }, { type: 'role', operator: 'equals', value: 'diputado' }] },
      { type: 'careerPath', operator: 'equals', value: 'institucional' },
    ],
  },
  weightModifiers: [{ conditions: { type: 'party', operator: 'equals', value: 'progresista' }, modifier: 6 }],
  choices: [
    {
      id: 'aceptar_el_panel',
      text: 'Aceptar el panel',
      careerPath: 'mediatica',
      relationships: { periodista: 8, fiscal: -2 },
      effects: { popularity: 5, exposure: 4 },
      durationMonths: 2,
    },
    {
      id: 'declinar_la_exposicion',
      text: 'Declinar la exposición mediática',
      effects: { popularity: 1 },
      durationMonths: 1,
    },
  ],
}
