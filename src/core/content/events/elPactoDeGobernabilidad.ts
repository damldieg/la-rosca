import type { Event } from '../../domain/events/types'

export const elPactoDeGobernabilidad: Event = {
  id: 'el_pacto_de_gobernabilidad',
  title: 'El pacto de gobernabilidad',
  description: 'La conducción partidaria respalda tu versión: la auditoría interna se cierra sin consecuencias.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'flag', flag: 'internal_investigation', operator: 'exists' },
      { type: 'relationship', target: 'jefePartidario', operator: 'gte', value: 40 },
    ],
  },
  choices: [
    {
      id: 'sellar_el_pacto',
      text: 'Sellar el pacto de lealtad mutua',
      effects: { exposure: -15, structure: 10 },
      relationships: { jefePartidario: 10 },
      durationMonths: 1,
    },
    {
      id: 'mantener_distancia_prudente',
      text: 'Mantener distancia prudente por las dudas',
      effects: { exposure: -5 },
      durationMonths: 1,
    },
  ],
}
