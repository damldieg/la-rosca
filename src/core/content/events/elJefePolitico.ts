import type { Event } from '../../domain/events/types'

export const elJefePolitico: Event = {
  id: 'el_jefe_politico',
  title: 'El jefe político',
  description: 'Tu enfrentamiento con la oposición no pasó desapercibido. El jefe partidario te manda llamar.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'flag', flag: 'confronted_opposition', operator: 'exists' },
    ],
  },
  chainId: 'partido',
  choices: [
    {
      id: 'jurar_lealtad_al_jefe',
      text: 'Jurarle lealtad',
      addFlags: ['loyal_to_boss'],
      effects: { power: 5 },
      relationships: { jefePartidario: 25 },
      durationMonths: 1,
    },
    {
      id: 'marcar_diferencias',
      text: 'Marcarle diferencias',
      effects: { popularity: 5 },
      ideology: { institutional: 8 },
      relationships: { jefePartidario: -15 },
      durationMonths: 1,
    },
  ],
}
