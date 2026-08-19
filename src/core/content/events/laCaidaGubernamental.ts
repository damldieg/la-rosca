import type { Event } from '../../domain/events/types'

export const laCaidaGubernamental: Event = {
  id: 'la_caida_gubernamental',
  title: 'La caída gubernamental',
  description: 'El escándalo erosiona tu gestión provincial más rápido de lo que podés controlarlo.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'gobernador' },
      { type: 'flag', flag: 'under_investigation', operator: 'exists' },
      { type: 'stat', stat: 'power', operator: 'lt', value: 50 },
    ],
  },
  choices: [
    {
      id: 'aceptar_la_derrota_electoral',
      text: 'Aceptar la derrota y bajar el perfil',
      role: 'intendente',
      effects: { popularity: 5, exposure: -30 },
      durationMonths: 3,
    },
    {
      id: 'forzar_una_reeleccion',
      text: 'Forzar una reelección a como dé lugar',
      effects: { power: -15, popularity: -20, exposure: 10, corruption: 5 },
      durationMonths: 3,
    },
  ],
}
