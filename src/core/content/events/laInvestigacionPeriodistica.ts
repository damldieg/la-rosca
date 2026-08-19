import type { Event } from '../../domain/events/types'
import { POLITICAL_OFFICE_CONDITION } from './riskConditions'

export const laInvestigacionPeriodistica: Event = {
  id: 'la_investigacion_periodistica',
  title: 'La investigación periodística',
  description: 'Un equipo de investigación viene siguiendo tus movimientos hace meses. Están por publicar.',
  conditions: {
    type: 'and',
    conditions: [
      POLITICAL_OFFICE_CONDITION,
      { type: 'stat', stat: 'corruption', operator: 'gte', value: 30 },
      { type: 'stat', stat: 'exposure', operator: 'gte', value: 35 },
    ],
  },
  weightModifiers: [
    { conditions: { type: 'stat', stat: 'corruption', operator: 'gte', value: 50 }, modifier: 20 },
    { conditions: { type: 'stat', stat: 'exposure', operator: 'gte', value: 60 }, modifier: 30 },
    { conditions: { type: 'relationship', target: 'periodista', operator: 'lte', value: -40 }, modifier: 15 },
  ],
  choices: [
    {
      id: 'negar_todo',
      text: 'Negar todo públicamente',
      addFlags: ['under_investigation'],
      effects: { exposure: 15, popularity: -5 },
      relationships: { periodista: -15 },
      durationMonths: 1,
    },
    {
      id: 'colaborar_con_la_prensa',
      text: 'Colaborar y dar explicaciones',
      addFlags: ['under_investigation', 'cooperated_with_press'],
      effects: { exposure: -10, popularity: -10, corruption: -5 },
      relationships: { periodista: 15 },
      ideology: { institutional: 8 },
      durationMonths: 1,
    },
    {
      id: 'atacar_al_periodista',
      text: 'Atacar la credibilidad del periodista',
      addFlags: ['under_investigation', 'attacked_press'],
      effects: { exposure: 20, power: 5 },
      relationships: { periodista: -30 },
      ideology: { institutional: -8 },
      durationMonths: 1,
    },
  ],
}
