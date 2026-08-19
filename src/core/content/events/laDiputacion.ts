import type { Event } from '../../domain/events/types'

export const laDiputacion: Event = {
  id: 'la_diputacion',
  title: 'La diputación',
  description: 'El armado nacional necesita una banca joven y con buena llegada a la city.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'asesor' },
      { type: 'age', operator: 'gte', value: 19 },
      { type: 'stat', stat: 'power', operator: 'gte', value: 20 },
    ],
  },
  // repeatable (Fase 7.5): asesor has almost no other content of its own — a
  // declined oneShot offer here would permanently strand the player at asesor,
  // the same dead end la_candidatura_al_senado exists to prevent one tier up.
  lifecycle: { type: 'repeatable' },
  choices: [
    {
      id: 'aceptar_banca',
      text: 'Aceptar encabezar la lista',
      role: 'diputado',
      effects: { power: 15, popularity: 8 },
      durationMonths: 8,
    },
    {
      id: 'esperar_otra_lista',
      text: 'Esperar una mejor lista',
      effects: { popularity: 2 },
      durationMonths: 2,
    },
  ],
}
