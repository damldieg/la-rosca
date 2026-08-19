import type { EventPool } from '../../domain/events/eventPool'
import { clubDelBarrio } from './clubDelBarrio'
import { elArchivoOAvance } from './elArchivoOAvance'
import { elAscenso } from './elAscenso'
import { elBarometroDeOpinion } from './elBarometroDeOpinion'
import { elCostoPolitico } from './elCostoPolitico'
import { elDebateMunicipal } from './elDebateMunicipal'
import { elDesenlaceEmpresario } from './elDesenlaceEmpresario'
import { elEmpresario } from './elEmpresario'
import { elFavorSindical } from './elFavorSindical'
import { elFinancista } from './elFinancista'
import { elFiscal } from './elFiscal'
import { elGabinete } from './elGabinete'
import { elIndultoPolitico } from './elIndultoPolitico'
import { elJefePolitico } from './elJefePolitico'
import { elLlamadoNacional } from './elLlamadoNacional'
import { elNegocioConjunto } from './elNegocioConjunto'
import { elOperadorDeConfianza } from './elOperadorDeConfianza'
import { elPactoDeGobernabilidad } from './elPactoDeGobernabilidad'
import { elPeriodista } from './elPeriodista'
import { elPerfilTecnico } from './elPerfilTecnico'
import { elPrestigioAcademico } from './elPrestigioAcademico'
import { elReconocimientoPublico } from './elReconocimientoPublico'
import { elReferente } from './elReferente'
import { elRivalInterno } from './elRivalInterno'
import { elSindicato } from './elSindicato'
import { jefeTerritorial } from './jefeTerritorial'
import { laAsesoria } from './laAsesoria'
import { laAuditoriaDeContratos } from './laAuditoriaDeContratos'
import { laCaidaGubernamental } from './laCaidaGubernamental'
import { laCaidaMinisterial } from './laCaidaMinisterial'
import { laCampana } from './laCampana'
import { laCandidaturaAlSenado } from './laCandidaturaAlSenado'
import { laCoherenciaCuestionada } from './laCoherenciaCuestionada'
import { laColumnaDeOpinion } from './laColumnaDeOpinion'
import { laConsolidacionTerritorial } from './laConsolidacionTerritorial'
import { laCrisisTerritorial } from './laCrisisTerritorial'
import { laDenuncia } from './laDenuncia'
import { laDiputacion } from './laDiputacion'
import { laEntrevista } from './laEntrevista'
import { laFiltracion } from './laFiltracion'
import { laGobernacion } from './laGobernacion'
import { laIntendencia } from './laIntendencia'
import { laInterna } from './laInterna'
import { laInternaPartidaria } from './laInternaPartidaria'
import { laInvestigacionEmpresario } from './laInvestigacionEmpresario'
import { laInvestigacionJudicial } from './laInvestigacionJudicial'
import { laInvestigacionPeriodistica } from './laInvestigacionPeriodistica'
import { laLicitacion } from './laLicitacion'
import { laMovilizacion } from './laMovilizacion'
import { laMulta } from './laMulta'
import { laNegociacion } from './laNegociacion'
import { laOperacionMediatica } from './laOperacionMediatica'
import { laOportunidad } from './laOportunidad'
import { laOrganizacionCivil } from './laOrganizacionCivil'
import { laOrientacionPolitica } from './laOrientacionPolitica'
import { laPerdidaDeFinanciacion } from './laPerdidaDeFinanciacion'
import { laPerdidaDeLaCandidatura } from './laPerdidaDeLaCandidatura'
import { laPresidencia } from './laPresidencia'
import { laPrimeraMilitancia } from './laPrimeraMilitancia'
import { laRedDeContactos } from './laRedDeContactos'
import { laSupervivenciaDelEscandalo } from './laSupervivenciaDelEscandalo'
import { laTraicion } from './laTraicion'
import { laTransparencia } from './laTransparencia'
import { laVeeduriaCiudadana } from './laVeeduriaCiudadana'
import { losMedios } from './losMedios'

/**
 * Grouped for readability only — selectEvent is a weighted random pick, so
 * array order no longer decides which eligible event is chosen (see
 * eventSelector.ts). It only ever mattered because a promotion event, once
 * selected, moves the player out of the role that made earlier build-up
 * events eligible in the first place.
 */
export const defaultEventPool: EventPool = [
  // --- militante/referente: early career, shared (Fase 7.5) ---
  laPrimeraMilitancia,
  laRedDeContactos,
  laOrientacionPolitica,
  elReferente,
  laConsolidacionTerritorial,
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
  // --- puntero: party-specific — organización civil (progresista) ---
  laOrganizacionCivil,
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
  // --- concejal: party-specific — civica chain (progresista) ---
  laTransparencia,
  elReconocimientoPublico,
  // --- concejal: party-specific — tecnico/mediatico chain (progresista) ---
  elPerfilTecnico,
  laColumnaDeOpinion,
  elPrestigioAcademico,
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
  laCandidaturaAlSenado,
  laIntendencia,
  laGobernacion,
  elGabinete,
  elLlamadoNacional,
  laPresidencia,
  // --- political risk: investigation / press, and its consequences ---
  laInvestigacionPeriodistica,
  laSupervivenciaDelEscandalo,
  elIndultoPolitico,
  laCaidaMinisterial,
  laCaidaGubernamental,
  laPerdidaDeLaCandidatura,
  // --- political risk: internal rival ---
  elRivalInterno,
  laInternaPartidaria,
  elPactoDeGobernabilidad,
  // --- political risk: leak ---
  laFiltracion,
  // --- political risk: party-specific crisis ---
  laCrisisTerritorial,
  laAuditoriaDeContratos,
  laCoherenciaCuestionada,
  // --- political risk: consequences of corruption ---
  laMulta,
  elCostoPolitico,
  laPerdidaDeFinanciacion,
  elBarometroDeOpinion,
]
