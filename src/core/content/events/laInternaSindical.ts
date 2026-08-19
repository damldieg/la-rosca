import type { Event } from '../../domain/events/types'

export const laInternaSindical: Event = {
  id: 'la_interna_sindical',
  title: 'La interna sindical',
  description: 'Una lista opositora dentro del gremio disputa tu conducción.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'sindical' },
  choices: [
    {
      id: 'disputar_la_conduccion',
      text: 'Disputarla y ganar la interna',
      relationships: { sindicalista: 6 },
      effects: { power: 5, popularity: -2 },
      durationMonths: 2,
    },
    {
      id: 'ceder_espacio',
      text: 'Cederles espacio para mantener la unidad',
      relationships: { sindicalista: -3 },
      effects: { structure: 2 },
      durationMonths: 1,
    },
  ],
}
