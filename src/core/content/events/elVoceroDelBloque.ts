import type { Event } from '../../domain/events/types'

/** Fase 9: career-path evolution, diputado stage, any path -> mediatica. */
export const elVoceroDelBloque: Event = {
  id: 'el_vocero_del_bloque',
  title: 'El vocero del bloque',
  description: 'Tu bloque necesita una cara visible ante los medios y te proponen ser el vocero.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'diputado' },
      { type: 'careerPath', operator: 'not_equals', value: 'mediatica' },
    ],
  },
  choices: [
    {
      id: 'asumir_como_vocero',
      text: 'Asumir como vocero',
      careerPath: 'mediatica',
      relationships: { periodista: 7 },
      effects: { popularity: 6, exposure: 3 },
      durationMonths: 2,
    },
    {
      id: 'dejar_que_otro_hable',
      text: 'Dejar que otro sea la cara pública',
      effects: { structure: 1 },
      durationMonths: 1,
    },
  ],
}
