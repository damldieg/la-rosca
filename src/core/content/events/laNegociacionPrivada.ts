import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laNegociacionPrivada: Event = {
  id: 'la_negociacion_privada',
  title: 'La negociación privada',
  description: 'Un empresario busca cerrar un acuerdo de financiamiento a cambio de buena predisposición futura.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'empresarial' },
  choices: [
    {
      id: 'cerrar_el_acuerdo',
      text: 'Cerrar el acuerdo',
      relationships: { empresario: 10 },
      effects: { money: MONEY_SCALE.JOINT_VENTURE_RETURN, corruption: 3 },
      durationMonths: 2,
    },
    {
      id: 'pedir_tiempo',
      text: 'Pedir tiempo para pensarlo',
      effects: { popularity: 1 },
      durationMonths: 1,
    },
  ],
}
