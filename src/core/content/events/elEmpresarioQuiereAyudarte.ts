import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/** Fase 8's second named example: territorial and técnica each get two path-flavored choices, empresarial and mediática one each, plus a neutral fallback. */
export const elEmpresarioQuiereAyudarte: Event = {
  id: 'el_empresario_quiere_ayudarte',
  title: 'Un empresario quiere ayudarte',
  description: 'Un empresario de la zona se acerca a ofrecerte una mano.',
  choices: [
    {
      id: 'aceptar_apoyo',
      text: 'Aceptar el apoyo tal cual lo ofrece',
      conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
      relationships: { empresario: 5, jefePartidario: 3 },
      effects: { structure: 4 },
      durationMonths: 1,
    },
    {
      id: 'negociar_favores',
      text: 'Negociar favores concretos a cambio',
      conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
      relationships: { empresario: 3 },
      effects: { structure: 6, corruption: 3 },
      durationMonths: 1,
    },
    {
      id: 'transparentar_el_ofrecimiento',
      text: 'Transparentar públicamente el ofrecimiento',
      conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' },
      relationships: { fiscal: 4 },
      effects: { popularity: 3 },
      ideology: { institutional: 5 },
      durationMonths: 1,
    },
    {
      id: 'rechazar_el_ofrecimiento',
      text: 'Rechazarlo directamente',
      conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' },
      effects: { popularity: 1 },
      durationMonths: 1,
    },
    {
      id: 'asociarse',
      text: 'Asociarte formalmente con él',
      conditions: { type: 'careerPath', operator: 'equals', value: 'empresarial' },
      relationships: { empresario: 8 },
      effects: { money: MONEY_SCALE.JOINT_VENTURE_RETURN, corruption: 4 },
      durationMonths: 2,
    },
    {
      id: 'convertirlo_en_noticia',
      text: 'Convertirlo en una noticia sobre tráfico de influencias',
      conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' },
      relationships: { periodista: 6, empresario: -8 },
      effects: { popularity: 5, exposure: 4 },
      durationMonths: 1,
    },
    {
      id: 'responder_con_cautela',
      text: 'Responder con cautela, sin comprometerte',
      effects: { popularity: 1 },
      durationMonths: 1,
    },
  ],
}
