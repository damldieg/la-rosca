import type { EventPool } from '../../domain/events/eventPool'
import { clubDelBarrio } from './clubDelBarrio'
import { elAcuerdoSindical } from './elAcuerdoSindical'
import { elArchivoOAvance } from './elArchivoOAvance'
import { elAscenso } from './elAscenso'
import { elAsesorPolitico } from './elAsesorPolitico'
import { elBarometroDeOpinion } from './elBarometroDeOpinion'
import { elCandidatoTecnico } from './elCandidatoTecnico'
import { elConflictoDeIntereses } from './elConflictoDeIntereses'
import { elContratoPrivado } from './elContratoPrivado'
import { elCostoPolitico } from './elCostoPolitico'
import { elDebateMunicipal } from './elDebateMunicipal'
import { elDebateTelevisivo } from './elDebateTelevisivo'
import { elDesenlaceEmpresario } from './elDesenlaceEmpresario'
import { elDirigenteMediatico } from './elDirigenteMediatico'
import { elEmpresario } from './elEmpresario'
import { elEmpresarioQuiereAyudarte } from './elEmpresarioQuiereAyudarte'
import { elEquipoTecnico } from './elEquipoTecnico'
import { elEscandaloMediatico } from './elEscandaloMediatico'
import { elFavorDelBarrio } from './elFavorDelBarrio'
import { elFavorSindical } from './elFavorSindical'
import { elFinancista } from './elFinancista'
import { elFiscal } from './elFiscal'
import { elGabinete } from './elGabinete'
import { elIndultoPolitico } from './elIndultoPolitico'
import { elInformeDeTransparencia } from './elInformeDeTransparencia'
import { elInformeTecnico } from './elInformeTecnico'
import { elJefePolitico } from './elJefePolitico'
import { elLlamadoNacional } from './elLlamadoNacional'
import { elLobbyEmpresarial } from './elLobbyEmpresarial'
import { elNegocioConjunto } from './elNegocioConjunto'
import { elOperadorDeConfianza } from './elOperadorDeConfianza'
import { elOrganismoDeControl } from './elOrganismoDeControl'
import { elPactoDeGobernabilidad } from './elPactoDeGobernabilidad'
import { elParoGeneral } from './elParoGeneral'
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
import { laAuditoriaInstitucional } from './laAuditoriaInstitucional'
import { laCaidaGubernamental } from './laCaidaGubernamental'
import { laCaidaMinisterial } from './laCaidaMinisterial'
import { laCampana } from './laCampana'
import { laCampanaDeImagen } from './laCampanaDeImagen'
import { laCandidaturaAlSenado } from './laCandidaturaAlSenado'
import { laCoherenciaCuestionada } from './laCoherenciaCuestionada'
import { laColumnaDeOpinion } from './laColumnaDeOpinion'
import { laConsolidacionTerritorial } from './laConsolidacionTerritorial'
import { laCriticaSinRespaldo } from './laCriticaSinRespaldo'
import { laCrisisTerritorial } from './laCrisisTerritorial'
import { laDenuncia } from './laDenuncia'
import { laDiputacion } from './laDiputacion'
import { laEntrevista } from './laEntrevista'
import { laEntrevistaExclusiva } from './laEntrevistaExclusiva'
import { laFiltracion } from './laFiltracion'
import { laGobernacion } from './laGobernacion'
import { laIntendencia } from './laIntendencia'
import { laInterna } from './laInterna'
import { laInternaPartidaria } from './laInternaPartidaria'
import { laInternaSindical } from './laInternaSindical'
import { laInternaTerritorial } from './laInternaTerritorial'
import { laInvestigacionEmpresario } from './laInvestigacionEmpresario'
import { laInvestigacionJudicial } from './laInvestigacionJudicial'
import { laInvestigacionPeriodistica } from './laInvestigacionPeriodistica'
import { laLicitacion } from './laLicitacion'
import { laMovilizacion } from './laMovilizacion'
import { laMovilizacionTerritorial } from './laMovilizacionTerritorial'
import { laMulta } from './laMulta'
import { laNegociacion } from './laNegociacion'
import { laNegociacionColectiva } from './laNegociacionColectiva'
import { laNegociacionPrivada } from './laNegociacionPrivada'
import { laOfertaDeFinanciamiento } from './laOfertaDeFinanciamiento'
import { laOperacionMediatica } from './laOperacionMediatica'
import { laOportunidad } from './laOportunidad'
import { laOrganizacionCivil } from './laOrganizacionCivil'
import { laOrientacionPolitica } from './laOrientacionPolitica'
import { laPerdidaDeFinanciacion } from './laPerdidaDeFinanciacion'
import { laPerdidaDeLaCandidatura } from './laPerdidaDeLaCandidatura'
import { laPresidencia } from './laPresidencia'
import { laPrimeraMilitancia } from './laPrimeraMilitancia'
import { laRedDeContactos } from './laRedDeContactos'
import { laReformaDeGestion } from './laReformaDeGestion'
import { laReformaLegislativa } from './laReformaLegislativa'
import { laSupervivenciaDelEscandalo } from './laSupervivenciaDelEscandalo'
import { laTraicion } from './laTraicion'
import { laTransparencia } from './laTransparencia'
import { laUnidadBasica } from './laUnidadBasica'
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
  // --- career identity (Fase 8): shared, path-dependent-choice events ---
  laOfertaDeFinanciamiento,
  elEmpresarioQuiereAyudarte,
  // --- career identity: path pivots (careerPath is never a rigid class) ---
  elAsesorPolitico,
  elDirigenteMediatico,
  elCandidatoTecnico,
  // --- career identity: territorial path ---
  laUnidadBasica,
  laMovilizacionTerritorial,
  laInternaTerritorial,
  elFavorDelBarrio,
  // --- career identity: tecnica path ---
  elInformeTecnico,
  laReformaLegislativa,
  elEquipoTecnico,
  laCriticaSinRespaldo,
  // --- career identity: empresarial path ---
  elLobbyEmpresarial,
  elContratoPrivado,
  laNegociacionPrivada,
  elConflictoDeIntereses,
  // --- career identity: sindical path ---
  laNegociacionColectiva,
  elParoGeneral,
  elAcuerdoSindical,
  laInternaSindical,
  // --- career identity: mediatica path ---
  laEntrevistaExclusiva,
  elDebateTelevisivo,
  laCampanaDeImagen,
  elEscandaloMediatico,
  // --- career identity: institucional path ---
  elInformeDeTransparencia,
  laAuditoriaInstitucional,
  elOrganismoDeControl,
  laReformaDeGestion,
]
