import type { Event } from '../../domain/events/types'

export const laReformaLegislativa: Event = {
  id: 'la_reforma_legislativa',
  title: 'La reforma legislativa',
  description: 'Tenés la oportunidad de redactar vos mismo un proyecto de reforma.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'careerPath', operator: 'equals', value: 'tecnica' },
      { type: 'or', conditions: [{ type: 'role', operator: 'equals', value: 'diputado' }, { type: 'role', operator: 'equals', value: 'ministro' }] },
    ],
  },
  choices: [
    {
      id: 'redactar_una_reforma_ambiciosa',
      text: 'Redactar una reforma ambiciosa y técnicamente sólida',
      relationships: { fiscal: 4 },
      effects: { power: 8, popularity: -3 },
      ideology: { institutional: 5 },
      durationMonths: 3,
    },
    {
      id: 'una_reforma_moderada',
      text: 'Una versión moderada, más fácil de aprobar',
      effects: { power: 4, popularity: 2 },
      durationMonths: 2,
    },
  ],
}
