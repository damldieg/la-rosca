import { MONEY_SCALE } from '../../domain/game/economy'
import type { Event } from '../../domain/events/types'

/**
 * Fase 8's own named example of a shared event resolving differently per path
 * (via EventChoice.conditions, not a parallel system) — the same offer, four
 * genuinely different responses. The unconditioned 'evaluarlo_con_cautela'
 * choice is the fallback for sindical/institucional/no-path-yet players, and
 * the safety net withEligibleChoices relies on if a path ever ends up with no
 * matching choice of its own.
 */
export const laOfertaDeFinanciamiento: Event = {
  id: 'la_oferta_de_financiamiento',
  title: 'La oferta de financiamiento',
  description: 'Te ofrecen financiar tu próxima campaña.',
  choices: [
    {
      id: 'negociar_apoyo_territorial',
      text: 'Aceptar, a cambio de apoyo territorial concreto para el aparato',
      conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
      relationships: { jefePartidario: 6 },
      effects: { money: MONEY_SCALE.LOCAL_FAVOR, structure: 5, corruption: 3 },
      durationMonths: 1,
    },
    {
      id: 'rechazar_por_conflicto_institucional',
      text: 'Rechazarla: no vas a comprometer tu independencia institucional',
      conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' },
      effects: { popularity: 3 },
      ideology: { institutional: 6 },
      durationMonths: 1,
    },
    {
      id: 'aceptar_la_inversion',
      text: 'Aceptarla como una inversión más',
      conditions: { type: 'careerPath', operator: 'equals', value: 'empresarial' },
      relationships: { empresario: 6 },
      effects: { money: MONEY_SCALE.BUSINESS_FINANCING, corruption: 5, exposure: 5 },
      durationMonths: 1,
    },
    {
      id: 'denunciar_publicamente',
      text: 'Denunciar públicamente el intento de financiamiento',
      conditions: { type: 'careerPath', operator: 'equals', value: 'mediatica' },
      relationships: { periodista: 6 },
      effects: { popularity: 6, exposure: 4 },
      durationMonths: 1,
    },
    {
      id: 'evaluarlo_con_cautela',
      text: 'Evaluarlo con cautela antes de decidir',
      effects: { popularity: 1 },
      durationMonths: 1,
    },
  ],
}
