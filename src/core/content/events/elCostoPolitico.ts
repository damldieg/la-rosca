import type { Event } from '../../domain/events/types'

export const elCostoPolitico: Event = {
  id: 'el_costo_politico',
  title: 'El costo político',
  description: 'Sostenerte en el cargo con este nivel de exposición te está costando caro en capital político.',
  conditions: { type: 'stat', stat: 'exposure', operator: 'gte', value: 60 },
  choices: [
    {
      id: 'ceder_espacio_de_poder',
      text: 'Ceder espacio para bajar la tensión',
      effects: { power: -10, exposure: -15 },
      durationMonths: 1,
    },
    {
      id: 'sostener_a_cualquier_precio',
      text: 'Sostener la posición a cualquier precio',
      effects: { popularity: -10, corruption: 5, exposure: 5 },
      durationMonths: 1,
    },
  ],
}
