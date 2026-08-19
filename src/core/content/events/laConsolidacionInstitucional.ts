import type { Event } from '../../domain/events/types'

/** Fase 9: career-path evolution, diputado stage, any path -> institucional. */
export const laConsolidacionInstitucional: Event = {
  id: 'la_consolidacion_institucional',
  title: 'La consolidación institucional',
  description: 'Una fundación de transparencia te propone sumarte formalmente a su consejo asesor.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'diputado' },
      { type: 'careerPath', operator: 'not_equals', value: 'institucional' },
    ],
  },
  choices: [
    {
      id: 'sumarte_al_consejo',
      text: 'Sumarte al consejo asesor',
      careerPath: 'institucional',
      relationships: { fiscal: 6 },
      effects: { popularity: 2, corruption: -3 },
      ideology: { institutional: 8 },
      durationMonths: 2,
    },
    {
      id: 'mantener_tu_rumbo_actual',
      text: 'Mantener tu rumbo actual',
      effects: { power: 1 },
      durationMonths: 1,
    },
  ],
}
