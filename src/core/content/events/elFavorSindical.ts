import type { Event } from '../../domain/events/types'

/**
 * Demonstrates the repeatable lifecycle — see phase 5 spec §9. Naturally bounded:
 * each favor costs relationship with the union, so eligibility eventually lapses
 * on its own without any RNG or explicit occurrence counter.
 */
export const elFavorSindical: Event = {
  id: 'el_favor_sindical',
  title: 'Un favor más',
  description: 'El sindicato te pide otro favor. Siempre hay uno más.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'party', operator: 'equals', value: 'popular' },
      { type: 'flag', flag: 'union_ally', operator: 'exists' },
      { type: 'relationship', target: 'sindicalista', operator: 'gte', value: 20 },
    ],
  },
  lifecycle: { type: 'repeatable' },
  chainId: 'sindicalista',
  choices: [
    {
      id: 'hacerle_el_lugar',
      text: 'Hacerle el lugar que piden',
      effects: { corruption: 5 },
      relationships: { sindicalista: -10 },
      durationMonths: 1,
    },
    {
      id: 'negarte_esta_vez',
      text: 'Negarte esta vez',
      effects: { power: 3 },
      relationships: { sindicalista: -15 },
      durationMonths: 1,
    },
  ],
}
