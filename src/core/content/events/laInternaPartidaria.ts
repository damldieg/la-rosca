import type { Event } from '../../domain/events/types'

export const laInternaPartidaria: Event = {
  id: 'la_interna_partidaria',
  title: 'La interna partidaria',
  description: 'Sin respaldo de la conducción, la auditoría interna se convierte en una purga en tu contra.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'flag', flag: 'internal_investigation', operator: 'exists' },
      { type: 'relationship', target: 'jefePartidario', operator: 'lt', value: 20 },
    ],
  },
  choices: [
    {
      id: 'aceptar_el_desgaste',
      text: 'Aceptar el desgaste y seguir en filas',
      effects: { popularity: -15, power: -10 },
      relationships: { jefePartidario: -15 },
      durationMonths: 2,
    },
    {
      id: 'romper_con_el_partido',
      text: 'Romper con la conducción partidaria',
      addFlags: ['broke_with_party'],
      effects: { power: 5, popularity: -10 },
      relationships: { jefePartidario: -40 },
      durationMonths: 2,
    },
  ],
}
