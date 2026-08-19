import type { Event } from '../../domain/events/types'

/**
 * Demonstrates "emergent impunity" (Fase 7 §8): no new variable — impunity
 * already exists (built up by past cover-ups, e.g. elPeriodista, elFiscal),
 * and here it directly buys down exposure instead of a dedicated mechanic.
 */
export const elIndultoPolitico: Event = {
  id: 'el_indulto_politico',
  title: 'El gesto judicial',
  description: 'Tus viejos contactos en tribunales logran que la causa pierda impulso, sin que nadie tenga que decirlo en voz alta.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'flag', flag: 'under_investigation', operator: 'exists' },
      { type: 'stat', stat: 'impunity', operator: 'gte', value: 40 },
    ],
  },
  choices: [
    {
      id: 'aceptar_el_gesto_judicial',
      text: 'Aceptar el gesto sin preguntar demasiado',
      addFlags: ['case_shelved'],
      effects: { exposure: -25 },
      relationships: { fiscal: 15 },
      durationMonths: 1,
    },
    {
      id: 'rechazar_por_prudencia',
      text: 'Rechazar: es demasiado riesgoso que se sepa',
      effects: { exposure: -5, popularity: 3 },
      durationMonths: 1,
    },
  ],
}
