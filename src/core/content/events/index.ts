import type { EventPool } from '../../domain/events/eventPool'
import { clubDelBarrio } from './clubDelBarrio'
import { elArchivoOAvance } from './elArchivoOAvance'
import { elAscenso } from './elAscenso'
import { elDebateMunicipal } from './elDebateMunicipal'
import { elDesenlaceEmpresario } from './elDesenlaceEmpresario'
import { elEmpresario } from './elEmpresario'
import { elFavorSindical } from './elFavorSindical'
import { elFinancista } from './elFinancista'
import { elFiscal } from './elFiscal'
import { elGabinete } from './elGabinete'
import { elJefePolitico } from './elJefePolitico'
import { elNegocioConjunto } from './elNegocioConjunto'
import { elOperadorDeConfianza } from './elOperadorDeConfianza'
import { elPeriodista } from './elPeriodista'
import { elSindicato } from './elSindicato'
import { jefeTerritorial } from './jefeTerritorial'
import { laAsesoria } from './laAsesoria'
import { laCampana } from './laCampana'
import { laDenuncia } from './laDenuncia'
import { laDiputacion } from './laDiputacion'
import { laEntrevista } from './laEntrevista'
import { laGobernacion } from './laGobernacion'
import { laIntendencia } from './laIntendencia'
import { laInterna } from './laInterna'
import { laInvestigacionEmpresario } from './laInvestigacionEmpresario'
import { laInvestigacionJudicial } from './laInvestigacionJudicial'
import { laLicitacion } from './laLicitacion'
import { laMovilizacion } from './laMovilizacion'
import { laNegociacion } from './laNegociacion'
import { laOperacionMediatica } from './laOperacionMediatica'
import { laOportunidad } from './laOportunidad'
import { laPresidencia } from './laPresidencia'
import { laTraicion } from './laTraicion'
import { laVeeduriaCiudadana } from './laVeeduriaCiudadana'
import { losMedios } from './losMedios'

/**
 * Order matters: selectEvent is deterministic and takes the first eligible event,
 * so build-up events (including the party-specific/chain ones) must precede the
 * promotion events that would otherwise move the player out of their role and
 * make the earlier ones permanently ineligible.
 */
export const defaultEventPool: EventPool = [
  // --- puntero: build-up, shared ---
  clubDelBarrio,
  jefeTerritorial,
  elEmpresario,
  laCampana,
  // --- ideology depth demos: role-agnostic, gated on an ideology axis extreme ---
  elOperadorDeConfianza,
  laVeeduriaCiudadana,
  // --- puntero: party-specific — sindicalista chain (popular) ---
  elSindicato,
  laMovilizacion,
  laNegociacion,
  elFavorSindical,
  // --- puntero: party-specific — financista (liberal) ---
  elFinancista,
  // --- promotions out of puntero (alternative branches) ---
  laAsesoria,
  laOportunidad,
  // --- concejal: empresario chain (contract -> investigation -> outcome) ---
  laLicitacion,
  elDebateMunicipal,
  losMedios,
  laInvestigacionEmpresario,
  elDesenlaceEmpresario,
  elNegocioConjunto,
  // --- concejal: periodista chain ---
  laEntrevista,
  elPeriodista,
  laOperacionMediatica,
  // --- concejal: justicia chain (triggered once a scandal is exposed) ---
  laDenuncia,
  elFiscal,
  laInvestigacionJudicial,
  elArchivoOAvance,
  // --- concejal: partido chain (only reachable by confronting the opposition) ---
  elJefePolitico,
  laInterna,
  laTraicion,
  elAscenso,
  // --- senior promotions ---
  laDiputacion,
  laIntendencia,
  laGobernacion,
  elGabinete,
  laPresidencia,
]
