import type { Event } from '../../domain/events/types'

export const elReconocimientoPublico: Event = {
  id: 'el_reconocimiento_publico',
  title: 'El reconocimiento público',
  description: 'Una fundación internacional destaca tu gestión en un ranking de transparencia municipal.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'party', operator: 'equals', value: 'progresista' },
      { type: 'flag', flag: 'transparency_champion', operator: 'exists' },
    ],
  },
  chainId: 'civica',
  choices: [
    {
      id: 'aceptar_el_reconocimiento',
      text: 'Aceptar el reconocimiento en una ceremonia pública',
      effects: { popularity: 15, power: 6 },
      relationships: { organizacionCivil: 10, periodista: 10 },
      durationMonths: 1,
    },
    {
      id: 'declinar_la_ceremonia',
      text: 'Declinar la ceremonia y seguir con la gestión',
      effects: { structure: 5 },
      durationMonths: 1,
    },
  ],
}
