import type { Event } from '../../domain/events/types'

/** Fase 9: career-path evolution, diputado stage, any path -> territorial. */
export const laConstruccionDeEstructura: Event = {
  id: 'la_construccion_de_estructura',
  title: 'La construcción de estructura',
  description: 'Un intendente aliado te ofrece ayuda para armar estructura territorial propia de cara a la próxima elección.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'diputado' },
      { type: 'careerPath', operator: 'not_equals', value: 'territorial' },
    ],
  },
  choices: [
    {
      id: 'aceptar_armar_estructura',
      text: 'Aceptar armar estructura propia',
      careerPath: 'territorial',
      relationships: { jefePartidario: 7 },
      effects: { structure: 8 },
      ideology: { institutional: -4 },
      durationMonths: 3,
    },
    {
      id: 'seguir_sin_estructura_propia',
      text: 'Seguir sin estructura propia',
      effects: { power: 1 },
      durationMonths: 1,
    },
  ],
}
