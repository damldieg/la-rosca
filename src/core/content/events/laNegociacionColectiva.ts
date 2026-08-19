import type { Event } from '../../domain/events/types'

export const laNegociacionColectiva: Event = {
  id: 'la_negociacion_colectiva',
  title: 'La negociación colectiva',
  description: 'El gremio te pide encabezar la mesa de paritarias de este año.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'sindical' },
  choices: [
    {
      id: 'encabezar_la_mesa',
      text: 'Encabezarla vos mismo',
      relationships: { sindicalista: 10 },
      effects: { structure: 6, power: 3 },
      durationMonths: 2,
    },
    {
      id: 'delegar_en_el_gremio',
      text: 'Delegarla en la conducción del gremio',
      relationships: { sindicalista: 3 },
      effects: { structure: 2 },
      durationMonths: 1,
    },
  ],
}
