import type { Event } from '../../domain/events/types'

export const elPrestigioAcademico: Event = {
  id: 'el_prestigio_academico',
  title: 'El prestigio académico',
  description: 'Una universidad te designa profesor honorario: tu perfil técnico ya es un activo político por derecho propio.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'party', operator: 'equals', value: 'progresista' },
      { type: 'flag', flag: 'opinion_columnist', operator: 'exists' },
    ],
  },
  chainId: 'tecnico',
  choices: [
    {
      id: 'aceptar_la_designacion',
      text: 'Aceptar la designación',
      addFlags: ['recognized_expert'],
      effects: { popularity: 12, power: 6 },
      ideology: { institutional: 6 },
      durationMonths: 2,
    },
    {
      id: 'declinar_por_agenda',
      text: 'Declinar por agenda',
      effects: { popularity: 2 },
      durationMonths: 1,
    },
  ],
}
