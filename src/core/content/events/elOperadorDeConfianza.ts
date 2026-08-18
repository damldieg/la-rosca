import type { Event } from '../../domain/events/types'

/** Demonstrates ideology depth: a strongly anti-institutional profile opens informal-operator content (spec §19). */
export const elOperadorDeConfianza: Event = {
  id: 'el_operador_de_confianza',
  title: 'El operador de confianza',
  description: 'Un operador te ofrece resolver por izquierda lo que por los canales formales tardaría meses.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'ideology', axis: 'institutional', operator: 'lt', value: -50 },
    ],
  },
  choices: [
    {
      id: 'operar_por_izquierda',
      text: 'Operar por izquierda',
      effects: { power: 6, corruption: 8 },
      relationships: { jefePartidario: 10 },
      durationMonths: 1,
    },
    {
      id: 'mantenerte_dentro_de_las_reglas',
      text: 'Mantenerte dentro de las reglas',
      effects: { popularity: 4 },
      ideology: { institutional: 5 },
      durationMonths: 1,
    },
  ],
}
