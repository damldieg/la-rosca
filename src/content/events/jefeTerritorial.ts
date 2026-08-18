import type { Event } from '../../domain/events/types'

export const jefeTerritorial: Event = {
  id: 'jefe_territorial',
  title: 'El jefe territorial',
  description: 'El referente de la zona te pide lealtad incondicional a cambio de sostenerte.',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  choices: [
    {
      id: 'pledge_loyalty',
      text: 'Jurarle lealtad',
      effects: { structure: 10, ideologyAlignment: -5 },
    },
    {
      id: 'refuse_orders',
      text: 'Plantarte y marcar tu propia línea',
      effects: { structure: -5, power: 5 },
    },
  ],
}
