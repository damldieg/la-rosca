import type { Event } from '../../domain/events/types'

export const elInformeDeTransparencia: Event = {
  id: 'el_informe_de_transparencia',
  title: 'El informe de transparencia',
  description: 'Una organización de control te propone publicar voluntariamente tu declaración jurada completa.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'institucional' },
  choices: [
    {
      id: 'publicarla',
      text: 'Publicarla completa',
      relationships: { fiscal: 6, periodista: 4 },
      effects: { corruption: -5, popularity: 4 },
      ideology: { institutional: 6 },
      durationMonths: 1,
    },
    {
      id: 'publicar_una_version_resumida',
      text: 'Publicar solo una versión resumida',
      effects: { popularity: 1 },
      durationMonths: 1,
    },
  ],
}
