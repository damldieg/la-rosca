import type { Event } from '../../domain/events/types'

export const elAcuerdoSindical: Event = {
  id: 'el_acuerdo_sindical',
  title: 'El acuerdo sindical',
  description: 'El gremio te ofrece un acuerdo de apoyo estable a cambio de garantías concretas.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'sindical' },
  choices: [
    {
      id: 'aceptar_las_garantias',
      text: 'Aceptar las garantías que piden',
      relationships: { sindicalista: 8 },
      effects: { structure: 5 },
      ideology: { economic: -6 },
      durationMonths: 1,
    },
    {
      id: 'negociar_a_la_baja',
      text: 'Negociar garantías más chicas',
      relationships: { sindicalista: 3 },
      effects: { structure: 1 },
      durationMonths: 1,
    },
  ],
}
