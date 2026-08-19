import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/**
 * Sets the player's careerPath (Fase 7.5) — never a rigid class, can change
 * later (see elAsesorPolitico.ts, elDirigenteMediatico.ts, elCandidatoTecnico.ts).
 * Any militante can pick any path regardless of party. Each choice also nudges
 * that path's own "natural" relationship a little (Fase 8) — jefePartidario for
 * territorial, fiscal for tecnica/institucional, empresario for empresarial,
 * sindicalista/periodista already did for sindical/mediatica — the same light
 * touch the spec asks for, not a multiplier system.
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
      relationships: { jefePartidario: 8 },
      effects: { structure: 5 },
      ideology: { institutional: -5 },
      durationMonths: 1,
    },
    {
      id: 'camino_tecnico',
      text: 'Los números: formarte como cuadro técnico',
      careerPath: 'tecnica',
      relationships: { fiscal: 5 },
      effects: { power: 5 },
      ideology: { institutional: 5 },
      durationMonths: 1,
    },
    {
      id: 'camino_empresarial',
      text: 'Los negocios: acercarte al mundo empresario',
      careerPath: 'empresarial',
      relationships: { empresario: 8 },
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
      relationships: { fiscal: 8 },
      effects: { popularity: 3 },
      ideology: { institutional: 10 },
      durationMonths: 1,
    },
  ],
}
