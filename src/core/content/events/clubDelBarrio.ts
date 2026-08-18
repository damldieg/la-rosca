import type { Event } from '../../domain/events/types'

export const clubDelBarrio: Event = {
  id: 'club_del_barrio',
  title: 'El club del barrio',
  description: 'El club de fútbol del barrio necesita una mano para arreglar la cancha.',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  choices: [
    {
      id: 'help_club',
      text: 'Conseguir los materiales y ayudar con la obra',
      addFlags: ['helped_local_club'],
      effects: { popularity: 5 },
      durationMonths: 3,
    },
    {
      id: 'ignore_club',
      text: 'No tenés tiempo para eso',
      effects: { popularity: -2 },
      durationMonths: 1,
    },
  ],
}
