import type { Event } from '../../domain/events/types'

export const laColumnaDeOpinion: Event = {
  id: 'la_columna_de_opinion',
  title: 'La columna de opinión',
  description: 'El diario de mayor tirada de la región te ofrece una columna de opinión fija.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'party', operator: 'equals', value: 'progresista' },
      { type: 'flag', flag: 'technical_profile', operator: 'exists' },
    ],
  },
  chainId: 'tecnico',
  choices: [
    {
      id: 'aceptar_la_columna',
      text: 'Aceptar la columna',
      addFlags: ['opinion_columnist'],
      effects: { popularity: 8 },
      relationships: { periodista: 15 },
      durationMonths: 2,
    },
    {
      id: 'rechazar_la_columna',
      text: 'Rechazar: preferís mantener perfil bajo',
      effects: { popularity: -2 },
      relationships: { periodista: -5 },
      durationMonths: 1,
    },
  ],
}
