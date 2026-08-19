import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/**
 * Sets the player's careerPath (Fase 7.5) — narrative/weighting metadata, not
 * a rigid class. Any militante can pick any path regardless of party; party
 * gating and per-path weightModifiers elsewhere are what actually make one
 * path more natural for a given party (see laConsolidacionTerritorial.ts,
 * elAscenso.ts, laIntendencia.ts, laAsesoria.ts, laCandidaturaAlSenado.ts).
 */
export const laOrientacionPolitica: Event = {
  id: 'la_orientacion_politica',
  title: 'La orientación política',
  description: 'Con el tiempo, tenés que decidir qué tipo de militante querés ser.',
  conditions: { type: 'role', operator: 'equals', value: 'militante' },
  lifecycle: { type: 'milestone' },
  choices: [
    {
      id: 'camino_territorial',
      text: 'El territorio: la calle, el barrio, la estructura',
      careerPath: 'territorial',
      effects: { structure: 5 },
      ideology: { institutional: -5 },
      durationMonths: 1,
    },
    {
      id: 'camino_tecnico',
      text: 'Los números: formarte como cuadro técnico',
      careerPath: 'tecnica',
      effects: { power: 5 },
      ideology: { institutional: 5 },
      durationMonths: 1,
    },
    {
      id: 'camino_empresarial',
      text: 'Los negocios: acercarte al mundo empresario',
      careerPath: 'empresarial',
      effects: { money: MONEY_SCALE.LOCAL_FAVOR },
      ideology: { economic: 10 },
      durationMonths: 1,
    },
    {
      id: 'camino_sindical',
      text: 'El sindicato: organizar a los trabajadores',
      careerPath: 'sindical',
      relationships: { sindicalista: 10 },
      ideology: { economic: -10 },
      durationMonths: 1,
    },
    {
      id: 'camino_mediatico',
      text: 'Los medios: construir tu imagen pública',
      careerPath: 'mediatica',
      relationships: { periodista: 10 },
      effects: { popularity: 5 },
      durationMonths: 1,
    },
    {
      id: 'camino_institucional',
      text: 'Las instituciones: el prestigio académico y técnico',
      careerPath: 'institucional',
      effects: { popularity: 3 },
      ideology: { institutional: 10 },
      durationMonths: 1,
    },
  ],
}
