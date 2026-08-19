import type { Event } from '../../domain/events/types'

export const elAscenso: Event = {
  id: 'el_ascenso',
  title: 'El ascenso',
  description: 'Tu lealtad al armado provincial tiene premio: una banca en el Senado.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'age', operator: 'gte', value: 20 },
      { type: 'relationship', target: 'jefePartidario', operator: 'gte', value: 40 },
    ],
  },
  lifecycle: { type: 'milestone' },
  chainId: 'partido',
  weightModifiers: [
    { conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' }, modifier: 10 },
    { conditions: { type: 'careerPath', operator: 'equals', value: 'institucional' }, modifier: 10 },
  ],
  choices: [
    {
      id: 'aceptar_la_banca_de_senador',
      text: 'Aceptar la banca de senador',
      role: 'senador',
      effects: { power: 15, popularity: 5 },
      durationMonths: 6,
    },
    {
      id: 'quedarte_en_el_concejo',
      text: 'Quedarte en el Concejo por ahora',
      effects: { structure: 5 },
      durationMonths: 1,
    },
  ],
}
