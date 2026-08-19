import type { Event } from '../../domain/events/types'

export const elOrganismoDeControl: Event = {
  id: 'el_organismo_de_control',
  title: 'El organismo de control',
  description: 'Te ofrecen presidir un organismo de control con poder real de veto.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'institucional' },
  choices: [
    {
      id: 'aceptar_presidirlo',
      text: 'Aceptar presidirlo',
      relationships: { fiscal: 6 },
      effects: { power: 6 },
      ideology: { institutional: 8 },
      durationMonths: 2,
    },
    {
      id: 'declinar_el_cargo',
      text: 'Declinarlo para no atarte a un solo tema',
      effects: { power: 1 },
      durationMonths: 1,
    },
  ],
}
