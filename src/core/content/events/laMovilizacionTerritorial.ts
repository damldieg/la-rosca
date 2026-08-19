import type { Event } from '../../domain/events/types'

/** Territorial-path flavor: mobilization is the path's core strength — and its risk of overreach. */
export const laMovilizacionTerritorial: Event = {
  id: 'la_movilizacion_territorial',
  title: 'La movilización territorial',
  description: 'El partido te pide llenar la plaza para la próxima marcha.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
  choices: [
    {
      id: 'movilizar_a_pleno',
      text: 'Movilizar con toda la estructura',
      relationships: { jefePartidario: 6 },
      effects: { structure: 6, popularity: 3, exposure: 4 },
      durationMonths: 1,
    },
    {
      id: 'movilizar_moderado',
      text: 'Movilizar con un contingente chico, sin desgastar el aparato',
      effects: { structure: 2, popularity: 1 },
      durationMonths: 1,
    },
  ],
}
