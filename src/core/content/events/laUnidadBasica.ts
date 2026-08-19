import type { Event } from '../../domain/events/types'

/** Territorial-path flavor: the unidad básica is where a territorial career actually lives. */
export const laUnidadBasica: Event = {
  id: 'la_unidad_basica',
  title: 'La unidad básica',
  description: 'La unidad básica del barrio necesita a alguien que la mantenga viva entre elecciones.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
  choices: [
    {
      id: 'sostener_la_unidad_basica',
      text: 'Sostener la unidad básica con tu propio tiempo',
      relationships: { jefePartidario: 8 },
      effects: { structure: 8 },
      durationMonths: 3,
    },
    {
      id: 'delegarla',
      text: 'Delegarla en un referente de confianza',
      effects: { structure: 3, power: 2 },
      durationMonths: 2,
    },
  ],
}
