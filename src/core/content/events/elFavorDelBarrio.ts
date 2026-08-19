import type { Event } from '../../domain/events/types'

export const elFavorDelBarrio: Event = {
  id: 'el_favor_del_barrio',
  title: 'El favor del barrio',
  description: 'Una familia del barrio necesita una changa, un trámite resuelto, una mano.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
  choices: [
    {
      id: 'resolverlo_personalmente',
      text: 'Resolverlo vos mismo, cara a cara',
      relationships: { jefePartidario: 3 },
      effects: { popularity: 5, structure: 3 },
      durationMonths: 1,
    },
    {
      id: 'derivarlo',
      text: 'Derivarlo a la estructura del partido',
      effects: { structure: 1 },
      durationMonths: 1,
    },
  ],
}
