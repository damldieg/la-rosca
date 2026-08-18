import type { Event } from '../../domain/events/types'

export const elDebateMunicipal: Event = {
  id: 'el_debate_municipal',
  title: 'El debate municipal',
  description: 'La oposición te cuestiona en el recinto delante de la prensa.',
  conditions: { type: 'role', operator: 'equals', value: 'concejal' },
  choices: [
    {
      id: 'defender_gestion',
      text: 'Defender tu gestión con números',
      addFlags: ['trusted_by_party'],
      effects: { popularity: 8, power: 5 },
      durationMonths: 2,
    },
    {
      id: 'atacar_oposicion',
      text: 'Atacar a la oposición',
      effects: { power: 8, popularity: -5, corruption: 3 },
      durationMonths: 2,
    },
  ],
}
