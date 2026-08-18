import type { Event } from '../../domain/events/types'

export const elArchivoOAvance: Event = {
  id: 'el_archivo_o_avance',
  title: 'Archivo o avance',
  description: 'Llega el momento de resolver el expediente: se archiva, o avanza a juicio.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'flag', flag: 'judicial_case_reviewed', operator: 'exists' },
    ],
  },
  chainId: 'justicia',
  choices: [
    {
      id: 'agradecer_el_archivo',
      text: 'Agradecer discretamente el archivo del expediente',
      addFlags: ['case_closed'],
      effects: { corruption: 5, impunity: 5 },
      relationships: { fiscal: 10 },
      durationMonths: 1,
    },
    {
      id: 'exponer_publicamente_la_maniobra',
      text: 'Exponerlo públicamente y pedir que el caso avance',
      addFlags: ['case_advanced'],
      effects: { popularity: 12, power: -5 },
      relationships: { fiscal: -10, empresario: -15 },
      durationMonths: 1,
    },
  ],
}
