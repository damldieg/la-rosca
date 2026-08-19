import type { Event } from '../../domain/events/types'

export const laCaidaMinisterial: Event = {
  id: 'la_caida_ministerial',
  title: 'La caída ministerial',
  description: 'Sin poder suficiente para contener el escándalo, la presión por tu cabeza en el gabinete se vuelve insostenible.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'ministro' },
      { type: 'flag', flag: 'under_investigation', operator: 'exists' },
      { type: 'stat', stat: 'power', operator: 'lt', value: 50 },
    ],
  },
  choices: [
    {
      id: 'renunciar_con_dignidad',
      text: 'Renunciar antes de que te echen',
      role: 'diputado',
      effects: { popularity: 5, exposure: -30 },
      durationMonths: 2,
    },
    {
      id: 'resistir_en_el_cargo',
      text: 'Resistir en el cargo a cualquier costo',
      effects: { power: -15, popularity: -15, exposure: 10 },
      durationMonths: 2,
    },
  ],
}
