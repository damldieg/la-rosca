import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/** Demonstrates a money + relationship combined gate (see phase 5 spec §20). */
export const elNegocioConjunto: Event = {
  id: 'el_negocio_conjunto',
  title: 'El negocio conjunto',
  description: 'Con la investigación cerrada y plata en el bolsillo, el empresario te propone algo más permanente.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'stat', stat: 'money', operator: 'gte', value: 5_000_000 },
      { type: 'relationship', target: 'empresario', operator: 'gte', value: 10 },
    ],
  },
  chainId: 'empresario',
  choices: [
    {
      id: 'asociarte_formalmente',
      text: 'Asociarte formalmente al negocio del empresario',
      effects: { money: MONEY_SCALE.JOINT_VENTURE_RETURN, corruption: 5, exposure: 5 },
      relationships: { empresario: 15 },
      durationMonths: 3,
    },
    {
      id: 'mantener_distancia',
      text: 'Mantener distancia, ya cobraste lo tuyo',
      effects: { popularity: 3 },
      relationships: { empresario: -5 },
      durationMonths: 1,
    },
  ],
}
