import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const laAuditoriaDeContratos: Event = {
  id: 'la_auditoria_de_contratos',
  title: 'La auditoría de contratos',
  description: 'Un fiscal empieza a mirar de cerca los contratos que firmaste con tu círculo empresarial.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'party', operator: 'equals', value: 'liberal' },
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 30 },
      { type: 'relationship', target: 'empresario', operator: 'gte', value: 20 },
    ],
  },
  lifecycle: { type: 'cooldown', months: 12 },
  weightModifiers: [{ conditions: { type: 'stat', stat: 'exposure', operator: 'gte', value: 50 }, modifier: 15 }],
  choices: [
    {
      id: 'pagar_para_frenarla',
      text: 'Pagar para frenarla antes de que avance',
      effects: { money: -MONEY_SCALE.COVERUP_PAYMENT, impunity: 8 },
      durationMonths: 1,
    },
    {
      id: 'colaborar_con_la_auditoria',
      text: 'Colaborar y abrir los libros',
      effects: { corruption: -10, popularity: 5 },
      durationMonths: 1,
    },
    {
      id: 'presionar_al_fiscal',
      text: 'Presionar al fiscal para que la archive',
      relationships: { fiscal: -20 },
      effects: { exposure: 15, power: 5 },
      durationMonths: 1,
    },
  ],
}
