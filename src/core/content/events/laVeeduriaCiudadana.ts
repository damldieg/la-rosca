import type { Event } from '../../domain/events/types'

/** Demonstrates ideology depth: a strongly institutionalist profile opens transparency content (spec §19). */
export const laVeeduriaCiudadana: Event = {
  id: 'la_veeduria_ciudadana',
  title: 'La veeduría ciudadana',
  description: 'Una organización civil te propone abrir la gestión a una veeduría con acceso a la información.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'ideology', axis: 'institutional', operator: 'gt', value: 50 },
    ],
  },
  choices: [
    {
      id: 'promover_la_veeduria',
      text: 'Promover la veeduría',
      effects: { popularity: 8, corruption: -5 },
      ideology: { institutional: 5 },
      durationMonths: 2,
    },
    {
      id: 'descartar_la_iniciativa',
      text: 'Descartar la iniciativa',
      effects: { power: 3 },
      durationMonths: 1,
    },
  ],
}
