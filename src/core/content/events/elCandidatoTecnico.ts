import type { Event } from '../../domain/events/types'

/** Career-path evolution, tecnica -> institucional: técnica's own example, "asesor -> candidato," reframed as formal institutional standing. */
export const elCandidatoTecnico: Event = {
  id: 'el_candidato_tecnico',
  title: 'El candidato técnico',
  description: 'Te ofrecen encabezar una candidatura como perfil técnico e independiente, sin operador político detrás.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'asesor' },
      { type: 'careerPath', operator: 'equals', value: 'tecnica' },
    ],
  },
  choices: [
    {
      id: 'aceptar_la_candidatura_independiente',
      text: 'Aceptar la candidatura independiente',
      careerPath: 'institucional',
      relationships: { fiscal: 4 },
      effects: { popularity: 4 },
      ideology: { institutional: 8 },
      durationMonths: 3,
    },
    {
      id: 'seguir_como_asesor',
      text: 'Seguir como asesor, sin exponerte',
      effects: { power: 1 },
      durationMonths: 1,
    },
  ],
}
