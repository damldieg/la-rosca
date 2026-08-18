import type { Event } from '../../domain/events/types'

/** Demonstrates the cooldown lifecycle — see phase 5 spec §9. */
export const laMovilizacion: Event = {
  id: 'la_movilizacion',
  title: 'Otra movilización',
  description: 'El sindicato te vuelve a pedir gente en la calle.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'party', operator: 'equals', value: 'popular' },
      { type: 'relationship', target: 'sindicalista', operator: 'gte', value: 10 },
      { type: 'relationship', target: 'sindicalista', operator: 'lt', value: 80 },
      // Once la_negociacion is settled, el_favor_sindical takes over as the sole
      // driver of this relationship — never refilled again — so it's guaranteed
      // to trend down and eventually fall below its own eligibility threshold.
      { type: 'flag', flag: 'union_ally', operator: 'not_exists' },
    ],
  },
  lifecycle: { type: 'cooldown', months: 4 },
  chainId: 'sindicalista',
  choices: [
    {
      id: 'salir_a_la_calle',
      text: 'Salir a la calle otra vez',
      effects: { structure: 8, popularity: 4 },
      relationships: { sindicalista: 15 },
      durationMonths: 2,
    },
    {
      id: 'bajar_el_perfil',
      text: 'Bajar el perfil esta vez',
      effects: { structure: 2 },
      relationships: { sindicalista: -5 },
      durationMonths: 1,
    },
  ],
}
