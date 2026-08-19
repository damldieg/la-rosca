import type { Event } from '../../domain/events/types'

export const laOrganizacionCivil: Event = {
  id: 'la_organizacion_civil',
  title: 'La organización civil',
  description: 'Una ONG de transparencia te invita a sumarte a una campaña de participación ciudadana en el barrio.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'puntero' },
      { type: 'party', operator: 'equals', value: 'progresista' },
    ],
  },
  chainId: 'civica',
  choices: [
    {
      id: 'sumarte_a_la_organizacion',
      text: 'Sumarte a la campaña de participación ciudadana',
      addFlags: ['civic_ally'],
      effects: { popularity: 6, structure: 4 },
      ideology: { institutional: 8 },
      relationships: { organizacionCivil: 20 },
      durationMonths: 2,
    },
    {
      id: 'mantener_distancia',
      text: 'Mantenerte al margen por ahora',
      effects: { popularity: -2 },
      durationMonths: 1,
    },
  ],
}
