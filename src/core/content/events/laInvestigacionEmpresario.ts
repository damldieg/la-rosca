import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laInvestigacionEmpresario: Event = {
  id: 'la_investigacion_empresario',
  title: 'La investigación',
  description: 'Empiezan a circular versiones sobre la licitación arreglada. Alguien va a tener que hacerse cargo.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'flag', flag: 'accepted_bribe', operator: 'exists' },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 10 },
    ],
  },
  chainId: 'empresario',
  choices: [
    {
      id: 'pagar_para_tapar',
      text: 'Pagar para tapar la investigación',
      addFlags: ['bribed_investigation'],
      effects: { money: -MONEY_SCALE.COVERUP_PAYMENT, impunity: 8 },
      relationships: { empresario: 10, fiscal: -10 },
      durationMonths: 2,
    },
    {
      id: 'colaborar_con_la_causa',
      text: 'Colaborar con la causa para despegarte del empresario',
      addFlags: ['cooperated_with_investigation'],
      effects: { popularity: 5, corruption: -5 },
      relationships: { fiscal: 15, empresario: -20 },
      durationMonths: 2,
    },
  ],
}
