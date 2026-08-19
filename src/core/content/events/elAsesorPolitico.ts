import type { Event } from '../../domain/events/types'

/**
 * Fase 8's own named example of career-path evolution: a territorial puntero
 * who pivots into the técnica path as an asesor — careerPath is never a rigid
 * class. Reuses the existing decision.careerPath mechanism from Fase 7.5;
 * this is just new content that happens to set a different path.
 */
export const elAsesorPolitico: Event = {
  id: 'el_asesor_politico',
  title: 'El asesor político',
  description: 'Un bloque te ofrece dejar la calle y sumarte como asesor de su equipo técnico.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'careerPath', operator: 'equals', value: 'territorial' },
    ],
  },
  choices: [
    {
      id: 'aceptar_el_pase_a_tecnico',
      text: 'Aceptar el pase a un rol técnico',
      role: 'asesor',
      careerPath: 'tecnica',
      relationships: { periodista: 3 },
      effects: { power: 5, structure: -4 },
      ideology: { institutional: 6 },
      durationMonths: 3,
    },
    {
      id: 'quedarte_en_el_territorio',
      text: 'Quedarte en el territorio',
      effects: { structure: 2 },
      durationMonths: 1,
    },
  ],
}
