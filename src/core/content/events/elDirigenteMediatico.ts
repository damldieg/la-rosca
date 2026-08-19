import type { Event } from '../../domain/events/types'

/** Career-path evolution, mediática -> sindical: a media figure who becomes a labor-movement dirigente. */
export const elDirigenteMediatico: Event = {
  id: 'el_dirigente_mediatico',
  title: 'El dirigente mediático',
  description: 'Un gremio te propone dejar la exposición pura y ponerte al frente de su comunicación política.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' },
  choices: [
    {
      id: 'asumir_como_dirigente',
      text: 'Asumir como dirigente gremial',
      careerPath: 'sindical',
      relationships: { sindicalista: 8, periodista: -3 },
      effects: { structure: 4 },
      durationMonths: 3,
    },
    {
      id: 'seguir_en_los_medios',
      text: 'Seguir construyendo desde los medios',
      effects: { popularity: 2 },
      durationMonths: 1,
    },
  ],
}
