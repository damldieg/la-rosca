import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/** Fase 9: career-path evolution, tecnica -> empresarial. */
export const elLobbyista: Event = {
  id: 'el_lobbyista',
  title: 'El lobbysta',
  description: 'Un lobbysta te propone asesorar formalmente a un grupo de empresarios ante el Estado.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'role', operator: 'equals', value: 'asesor' },
      { type: 'careerPath', operator: 'equals', value: 'tecnica' },
    ],
  },
  weightModifiers: [{ conditions: { type: 'party', operator: 'equals', value: 'liberal' }, modifier: 6 }],
  choices: [
    {
      id: 'aceptar_el_asesoramiento',
      text: 'Aceptar el asesoramiento privado',
      careerPath: 'empresarial',
      relationships: { empresario: 8, fiscal: -3 },
      effects: { money: MONEY_SCALE.LOCAL_FAVOR, corruption: 3 },
      ideology: { economic: 8 },
      durationMonths: 3,
    },
    {
      id: 'seguir_como_tecnico_independiente',
      text: 'Seguir como técnico independiente',
      effects: { power: 2 },
      durationMonths: 1,
    },
  ],
}
