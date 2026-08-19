import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

export const elEquipoTecnico: Event = {
  id: 'el_equipo_tecnico',
  title: 'El equipo técnico',
  description: 'Podés armar un equipo propio de asesores especializados.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' },
  choices: [
    {
      id: 'armar_el_equipo',
      text: 'Armar el equipo, aunque cueste',
      effects: { money: -MONEY_SCALE.LOCAL_FAVOR, power: 6, structure: 2 },
      durationMonths: 2,
    },
    {
      id: 'trabajar_solo',
      text: 'Seguir trabajando solo',
      effects: { power: 1 },
      durationMonths: 1,
    },
  ],
}
