import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/**
 * Fase 9: career-path evolution, empresarial -> tecnica. The people financing
 * your career propose formalizing that into an actual management role.
 */
export const laProfesionalizacion: Event = {
  id: 'la_profesionalizacion',
  title: 'La profesionalización',
  description: 'Los socios que financian tu carrera te proponen sumarte a un equipo de gestión técnica.',
  conditions: {
    type: 'and',
    conditions: [
      { type: 'or', conditions: [{ type: 'role', operator: 'equals', value: 'puntero' }, { type: 'role', operator: 'equals', value: 'asesor' }] },
      { type: 'careerPath', operator: 'equals', value: 'empresarial' },
    ],
  },
  weightModifiers: [{ conditions: { type: 'party', operator: 'equals', value: 'liberal' }, modifier: 6 }],
  choices: [
    {
      id: 'aceptar_la_gestion_tecnica',
      text: 'Aceptar la gestión técnica',
      role: 'asesor',
      careerPath: 'tecnica',
      relationships: { fiscal: 5, empresario: -3 },
      effects: { power: 5 },
      ideology: { institutional: 6 },
      durationMonths: 3,
    },
    {
      id: 'seguir_con_los_negocios',
      text: 'Seguir con los negocios como están',
      effects: { money: MONEY_SCALE.LOCAL_FAVOR },
      durationMonths: 1,
    },
  ],
}
