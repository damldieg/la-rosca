import type { Event } from '../../domain/events/types'

export const laTransparencia: Event = {
  id: 'la_transparencia',
  title: 'La transparencia',
  description: 'La organización te pide impulsar una ordenanza de acceso a la información en el Concejo.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'party', operator: 'equals', value: 'progresista' },
      { type: 'flag', flag: 'civic_ally', operator: 'exists' },
    ],
  },
  chainId: 'civica',
  choices: [
    {
      id: 'impulsar_la_ordenanza',
      text: 'Impulsar la ordenanza de transparencia',
      addFlags: ['transparency_champion'],
      effects: { popularity: 10, corruption: -8, structure: 3 },
      ideology: { institutional: 8 },
      relationships: { organizacionCivil: 15 },
      durationMonths: 2,
    },
    {
      id: 'dejarla_para_mas_adelante',
      text: 'Dejarla para más adelante',
      effects: { popularity: -3 },
      relationships: { organizacionCivil: -10 },
      durationMonths: 1,
    },
  ],
}
