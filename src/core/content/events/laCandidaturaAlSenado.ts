import type { Event } from '../../domain/events/types'

/**
 * diputado -> senador. Before Fase 7.5, diputado had no forward transition at
 * all (only the la_perdida_de_la_candidatura demotion) — a genuine accidental
 * dead end, unlike gobernador's (already fixed in Fase 6.75 via elLlamadoNacional).
 */
export const laCandidaturaAlSenado: Event = {
  id: 'la_candidatura_al_senado',
  title: 'La candidatura al Senado',
  description: 'El bloque necesita un diputado con roce para encabezar la lista al Senado.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'diputado' },
      { type: 'age', operator: 'gte', value: 19 },
      { type: 'stat', stat: 'power', operator: 'gte', value: 20 },
    ],
  },
  // repeatable, not milestone: diputado has very little other content (see
  // laDiputacion.ts's own note) — a declined oneShot/milestone offer here would
  // permanently recreate the exact dead end this event exists to fix.
  lifecycle: { type: 'repeatable' },
  weightModifiers: [
    { conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' }, modifier: 15 },
    { conditions: { type: 'careerPath', operator: 'equals', value: 'institucional' }, modifier: 10 },
  ],
  choices: [
    {
      id: 'aceptar_la_banca_de_senador',
      text: 'Aceptar encabezar la lista al Senado',
      role: 'senador',
      effects: { power: 15, popularity: 8 },
      durationMonths: 8,
    },
    {
      id: 'consolidar_la_diputacion',
      text: 'Consolidar primero tu lugar en Diputados',
      effects: { structure: 3 },
      durationMonths: 2,
    },
  ],
}
