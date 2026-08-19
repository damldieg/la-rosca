import { describe, expect, it } from 'vitest'
import { defaultEventPool } from '../../../content/events'
import { elPerfilTecnico } from '../../../content/events/elPerfilTecnico'
import { elPrestigioAcademico } from '../../../content/events/elPrestigioAcademico'
import { elReconocimientoPublico } from '../../../content/events/elReconocimientoPublico'
import { laColumnaDeOpinion } from '../../../content/events/laColumnaDeOpinion'
import { laOrganizacionCivil } from '../../../content/events/laOrganizacionCivil'
import { laTransparencia } from '../../../content/events/laTransparencia'
import { getEligibleEvents } from '../../../domain/events/eventPool'
import type { GameState } from '../../../domain/game/types/gameState'
import { chooseEvent } from '../chooseEvent'
import { startGame } from '../startGame'

describe('civica chain: la_organizacion_civil -> la_transparencia -> el_reconocimiento_publico', () => {
  it('la_organizacion_civil is only eligible for a progresista puntero', () => {
    const progresista: GameState = { ...startGame('progresista'), role: 'puntero' }
    const popular: GameState = { ...startGame('popular'), role: 'puntero' }

    expect(getEligibleEvents(defaultEventPool, progresista).map((e) => e.id)).toContain('la_organizacion_civil')
    expect(getEligibleEvents(defaultEventPool, popular).map((e) => e.id)).not.toContain('la_organizacion_civil')
  })

  it('runs its full course once each step is accepted, and stays blocked out of order', () => {
    let state = startGame('progresista')

    // la_transparencia isn't reachable yet — civic_ally hasn't been earned.
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('la_transparencia')

    state = chooseEvent(state, laOrganizacionCivil, laOrganizacionCivil.choices[0]) // sumarte_a_la_organizacion
    expect(state.flags).toContain('civic_ally')
    expect(state.relationships.organizacionCivil).toBeGreaterThan(0)

    // Still puntero: la_transparencia requires concejal too.
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('la_transparencia')

    // Force the role transition directly (as other career tests do) to isolate
    // the civica chain from the unrelated puntero->concejal promotion events.
    state = { ...state, role: 'concejal' }
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_transparencia')

    state = chooseEvent(state, laTransparencia, laTransparencia.choices[0]) // impulsar_la_ordenanza
    expect(state.flags).toContain('transparency_champion')
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_reconocimiento_publico')

    state = chooseEvent(state, elReconocimientoPublico, elReconocimientoPublico.choices[0])
    expect(state.relationships.periodista).toBeGreaterThan(0)
  })
})

describe('tecnico chain: el_perfil_tecnico -> la_columna_de_opinion -> el_prestigio_academico', () => {
  it('is only eligible for a progresista concejal, never for other parties', () => {
    const progresistaConcejal = { ...startGame('progresista'), role: 'concejal' as const }
    const popularConcejal = { ...startGame('popular'), role: 'concejal' as const }

    expect(getEligibleEvents(defaultEventPool, progresistaConcejal).map((e) => e.id)).toContain('el_perfil_tecnico')
    expect(getEligibleEvents(defaultEventPool, popularConcejal).map((e) => e.id)).not.toContain('el_perfil_tecnico')
  })

  it('runs its full course in order', () => {
    let state: GameState = { ...startGame('progresista'), role: 'concejal' }

    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('la_columna_de_opinion')

    state = chooseEvent(state, elPerfilTecnico, elPerfilTecnico.choices[0]) // exponer_con_datos
    expect(state.flags).toContain('technical_profile')
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_columna_de_opinion')
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('el_prestigio_academico')

    state = chooseEvent(state, laColumnaDeOpinion, laColumnaDeOpinion.choices[0]) // aceptar_la_columna
    expect(state.flags).toContain('opinion_columnist')
    expect(state.relationships.periodista).toBeGreaterThan(0)
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_prestigio_academico')

    state = chooseEvent(state, elPrestigioAcademico, elPrestigioAcademico.choices[0]) // aceptar_la_designacion
    expect(state.flags).toContain('recognized_expert')
  })
})
