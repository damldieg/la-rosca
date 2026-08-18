import { describe, expect, it } from 'vitest'
import { clubDelBarrio } from '../../../content/events/clubDelBarrio'
import { defaultEventPool } from '../../../content/events'
import { elArchivoOAvance } from '../../../content/events/elArchivoOAvance'
import { elAscenso } from '../../../content/events/elAscenso'
import { elDebateMunicipal } from '../../../content/events/elDebateMunicipal'
import { elDesenlaceEmpresario } from '../../../content/events/elDesenlaceEmpresario'
import { elEmpresario } from '../../../content/events/elEmpresario'
import { elFiscal } from '../../../content/events/elFiscal'
import { elJefePolitico } from '../../../content/events/elJefePolitico'
import { elPeriodista } from '../../../content/events/elPeriodista'
import { laDenuncia } from '../../../content/events/laDenuncia'
import { laInterna } from '../../../content/events/laInterna'
import { laInvestigacionEmpresario } from '../../../content/events/laInvestigacionEmpresario'
import { laInvestigacionJudicial } from '../../../content/events/laInvestigacionJudicial'
import { laLicitacion } from '../../../content/events/laLicitacion'
import { laOportunidad } from '../../../content/events/laOportunidad'
import { laTraicion } from '../../../content/events/laTraicion'
import { getEligibleEvents } from '../../../domain/events/eventPool'
import { chooseEvent } from '../chooseEvent'
import { getNextEvent } from '../getNextEvent'
import { startGame } from '../startGame'

describe('event chain: el empresario -> la licitación', () => {
  it('appears once the player accepted the businessman and became concejal', () => {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0]) // help_club
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[0]) // accept_partnership -> businessman_ally
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0]) // accept_candidacy -> concejal

    expect(state.flags).toContain('businessman_ally')
    expect(state.role).toBe('concejal')

    const eligible = getEligibleEvents(defaultEventPool, state)
    expect(eligible.map((e) => e.id)).toContain('la_licitacion')
    expect(getNextEvent(state)).toEqual(laLicitacion)
  })

  it('stays blocked if the player rejected the businessman', () => {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0]) // help_club
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[1]) // reject_partnership -> no flag
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0]) // accept_candidacy -> concejal

    expect(state.flags).not.toContain('businessman_ally')
    expect(state.role).toBe('concejal')

    const eligible = getEligibleEvents(defaultEventPool, state)
    expect(eligible.map((e) => e.id)).not.toContain('la_licitacion')
    expect(getNextEvent(state)).toEqual(elDebateMunicipal)
  })
})

describe('getNextEvent', () => {
  it('returns a deterministic first eligible event for a fresh game', () => {
    const state = startGame('popular')

    expect(getNextEvent(state)).toEqual(clubDelBarrio)
  })
})

describe('event chain: la investigación -> el desenlace -> el negocio conjunto', () => {
  it('el_negocio_conjunto unlocks through a combined money + relationship gate (spec §20)', () => {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0]) // help_club
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[0]) // accept_partnership
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0]) // -> concejal
    state = chooseEvent(state, laLicitacion, laLicitacion.choices[0]) // favor_empresario -> accepted_bribe

    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_investigacion_empresario')
    state = chooseEvent(state, laInvestigacionEmpresario, laInvestigacionEmpresario.choices[0]) // pagar_para_tapar

    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_desenlace_empresario')
    state = chooseEvent(state, elDesenlaceEmpresario, elDesenlaceEmpresario.choices[0]) // seguir_como_si_nada

    expect(state.money).toBeGreaterThanOrEqual(5_000_000)
    expect(state.relationships.empresario).toBeGreaterThanOrEqual(10)
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_negocio_conjunto')
  })

  it('a distrusted empresario relationship blocks el_negocio_conjunto even with enough money', () => {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0])
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[1]) // reject_partnership -> relationship -10, no ally flag
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0]) // -> concejal

    const rich = { ...state, money: 10_000_000 }
    expect(getEligibleEvents(defaultEventPool, rich).map((e) => e.id)).not.toContain('el_negocio_conjunto')
  })
})

describe('event chain: justicia (denuncia -> fiscal -> investigación -> archivo o avance)', () => {
  it('runs its full course once a scandal is exposed with enough corruption', () => {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0])
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[0])
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0]) // -> concejal
    state = chooseEvent(state, laLicitacion, laLicitacion.choices[0]) // favor_empresario -> corruption 20
    state = chooseEvent(state, elPeriodista, elPeriodista.choices[1]) // let_him_publish -> scandal_exposed

    expect(state.flags).toContain('scandal_exposed')
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_denuncia')

    state = chooseEvent(state, laDenuncia, laDenuncia.choices[0]) // buscar_contactos_en_tribunales
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_fiscal')

    state = chooseEvent(state, elFiscal, elFiscal.choices[1]) // resistir_la_presion
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_investigacion_judicial')

    state = chooseEvent(state, laInvestigacionJudicial, laInvestigacionJudicial.choices[0])
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_archivo_o_avance')

    state = chooseEvent(state, elArchivoOAvance, elArchivoOAvance.choices[1]) // exponer_publicamente_la_maniobra
    expect(state.flags).toContain('case_advanced')
  })
})

describe('event chain: partido (jefe político -> interna -> traición -> ascenso a senador)', () => {
  function reachConcejalHavingConfrontedTheOpposition() {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0])
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[0])
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0]) // -> concejal
    state = chooseEvent(state, elDebateMunicipal, elDebateMunicipal.choices[1]) // atacar_oposicion
    return state
  }

  it('el_jefe_politico is unreachable without the confronted_opposition flag', () => {
    let state = startGame('popular')
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0])
    state = chooseEvent(state, elEmpresario, elEmpresario.choices[0])
    state = chooseEvent(state, laOportunidad, laOportunidad.choices[0])

    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('el_jefe_politico')

    state = chooseEvent(state, elDebateMunicipal, elDebateMunicipal.choices[1]) // atacar_oposicion
    expect(state.flags).toContain('confronted_opposition')
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_jefe_politico')
  })

  it('a loyal path builds enough trust with the party boss to reach el_ascenso and promote to senador', () => {
    let state = reachConcejalHavingConfrontedTheOpposition()
    state = chooseEvent(state, elJefePolitico, elJefePolitico.choices[0]) // jurar_lealtad_al_jefe (+25)
    state = chooseEvent(state, laInterna, laInterna.choices[0]) // disciplinarte_a_la_lista_oficial (+10)
    state = chooseEvent(state, laTraicion, laTraicion.choices[0]) // mantenerte_leal (+15)

    expect(state.relationships.jefePartidario).toBeGreaterThanOrEqual(40)
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_ascenso')

    state = chooseEvent(state, elAscenso, elAscenso.choices[0]) // aceptar_la_banca_de_senador
    expect(state.role).toBe('senador')
  })

  it('a different choice at la_traicion breaks with the boss and closes off el_ascenso', () => {
    let state = reachConcejalHavingConfrontedTheOpposition()
    state = chooseEvent(state, elJefePolitico, elJefePolitico.choices[0]) // jurar_lealtad_al_jefe (+25)
    state = chooseEvent(state, laInterna, laInterna.choices[0]) // disciplinarte_a_la_lista_oficial (+10, ->35)
    state = chooseEvent(state, laTraicion, laTraicion.choices[1]) // romper_con_el_jefe (-30)

    expect(state.flags).toContain('broke_with_boss')
    expect(state.relationships.jefePartidario).toBeLessThan(40)
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('el_ascenso')
  })
})
