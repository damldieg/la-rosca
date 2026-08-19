import type { Event } from '../../domain/events/types'

export const elPerfilTecnico: Event = {
  id: 'el_perfil_tecnico',
  title: 'El perfil técnico',
  description: 'Te invitan a exponer en un panel universitario sobre gestión pública basada en evidencia.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'concejal' },
      { type: 'party', operator: 'equals', value: 'progresista' },
    ],
  },
  chainId: 'tecnico',
  choices: [
    {
      id: 'exponer_con_datos',
      text: 'Exponer con datos y diagnóstico técnico',
      addFlags: ['technical_profile'],
      effects: { popularity: 6, power: 4 },
      ideology: { institutional: 5 },
      durationMonths: 1,
    },
    {
      id: 'declinar_la_exposicion',
      text: 'Declinar: no es el momento',
      effects: { popularity: -2 },
      durationMonths: 1,
    },
  ],
}
