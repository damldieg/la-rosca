import type { Event } from '../../domain/events/types'

export const elInformeTecnico: Event = {
  id: 'el_informe_tecnico',
  title: 'El informe técnico',
  description: 'Un centro de estudios te pide firmar un informe con tu propio diagnóstico técnico.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' },
  choices: [
    {
      id: 'firmar_el_informe',
      text: 'Firmarlo con tu nombre',
      relationships: { periodista: 5 },
      effects: { power: 5 },
      ideology: { institutional: 6 },
      durationMonths: 2,
    },
    {
      id: 'mantenerte_anonimo',
      text: 'Aportar el contenido sin firmarlo',
      effects: { power: 2 },
      durationMonths: 1,
    },
  ],
}
