import type { Event } from '../../domain/events/types'

/** The mediática path's own named weakness: image-dependence means a public crisis costs more. */
export const elEscandaloMediatico: Event = {
  id: 'el_escandalo_mediatico',
  title: 'El escándalo mediático',
  description: 'Un ciclo de streaming saca un audio tuyo fuera de contexto y se vuelve tendencia.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'careerPath', operator: 'equals', value: 'mediatica' },
      { type: 'stat', stat: 'popularity', operator: 'gte', value: 50 },
    ],
  },
  choices: [
    {
      id: 'dar_la_cara',
      text: 'Dar la cara en tu propio programa de confianza',
      relationships: { periodista: 5 },
      effects: { exposure: -8, popularity: -6 },
      durationMonths: 1,
    },
    {
      id: 'dejar_que_pase',
      text: 'Dejar que el ciclo de noticias lo tape solo',
      effects: { exposure: 6, popularity: -10 },
      durationMonths: 1,
    },
  ],
}
