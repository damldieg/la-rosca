import type { Event } from '../../domain/events/types'

/**
 * Fase 9: career-path evolution, territorial -> sindical. A referente/puntero
 * still building street structure gets pulled toward union representation
 * instead — reuses the same decision.careerPath mechanism as elAsesorPolitico.
 */
export const elPaseSindical: Event = {
  id: 'el_pase_sindical',
  title: 'El pase sindical',
  description: 'Un sindicato te ofrece dejar la estructura barrial y sumarte como su representante político.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'or', conditions: [{ type: 'role', operator: 'equals', value: 'referente' }, { type: 'role', operator: 'equals', value: 'puntero' }] },
      { type: 'careerPath', operator: 'equals', value: 'territorial' },
    ],
  },
  weightModifiers: [{ conditions: { type: 'party', operator: 'equals', value: 'popular' }, modifier: 6 }],
  choices: [
    {
      id: 'aceptar_la_representacion_sindical',
      text: 'Aceptar la representación sindical',
      careerPath: 'sindical',
      relationships: { sindicalista: 8, jefePartidario: -3 },
      effects: { structure: -3 },
      ideology: { economic: -6 },
      durationMonths: 3,
    },
    {
      id: 'quedarte_en_la_estructura',
      text: 'Quedarte en la estructura territorial',
      effects: { structure: 3 },
      durationMonths: 1,
    },
  ],
}
