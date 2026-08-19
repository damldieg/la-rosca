import type { Event } from '../../domain/events/types'

/** Territorial-path weakness the spec names explicitly: internal disputes over turf. */
export const laInternaTerritorial: Event = {
  id: 'la_interna_territorial',
  title: 'La interna territorial',
  description: 'Otro referente de la zona reclama tu territorio como propio.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
  choices: [
    {
      id: 'disputar_el_territorio',
      text: 'Disputarle el territorio, cueste lo que cueste',
      relationships: { jefePartidario: -5 },
      effects: { structure: 6, popularity: -4 },
      durationMonths: 2,
    },
    {
      id: 'repartir_la_zona',
      text: 'Repartir la zona para evitar la pelea',
      effects: { structure: -2, popularity: 3 },
      durationMonths: 1,
    },
  ],
}
