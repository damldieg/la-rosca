import type { EventPool } from '../../domain/events/eventPool'
import { clubDelBarrio } from './clubDelBarrio'
import { elDebateMunicipal } from './elDebateMunicipal'
import { elEmpresario } from './elEmpresario'
import { elFinancista } from './elFinancista'
import { elPeriodista } from './elPeriodista'
import { elSindicato } from './elSindicato'
import { jefeTerritorial } from './jefeTerritorial'
import { laAsesoria } from './laAsesoria'
import { laCampana } from './laCampana'
import { laDiputacion } from './laDiputacion'
import { laGobernacion } from './laGobernacion'
import { laIntendencia } from './laIntendencia'
import { laLicitacion } from './laLicitacion'
import { laOportunidad } from './laOportunidad'
import { losMedios } from './losMedios'

/**
 * Order matters: selectEvent is deterministic and takes the first eligible event,
 * so build-up events (including the party-specific ones) must precede the
 * promotion events that would otherwise move the player out of their role and
 * make the earlier ones permanently ineligible.
 */
export const defaultEventPool: EventPool = [
  // --- puntero: build-up, shared ---
  clubDelBarrio,
  jefeTerritorial,
  elEmpresario,
  laCampana,
  // --- puntero: party-specific ---
  elSindicato,
  elFinancista,
  // --- promotions out of puntero (alternative branches) ---
  laAsesoria,
  laOportunidad,
  // --- concejal ---
  laLicitacion,
  elDebateMunicipal,
  losMedios,
  elPeriodista,
  // --- senior promotions ---
  laDiputacion,
  laIntendencia,
  laGobernacion,
]
