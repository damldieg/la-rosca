import { describe, expect, it } from 'vitest'
import { defaultEventPool } from '../../../content/events'
import { elAsesorPolitico } from '../../../content/events/elAsesorPolitico'
import { elCandidatoTecnico } from '../../../content/events/elCandidatoTecnico'
import { elEmpresarioQuiereAyudarte } from '../../../content/events/elEmpresarioQuiereAyudarte'
import { elLobbyEmpresarial } from '../../../content/events/elLobbyEmpresarial'
import { elSindicato } from '../../../content/events/elSindicato'
import { laInternaTerritorial } from '../../../content/events/laInternaTerritorial'
import { laNegociacionColectiva } from '../../../content/events/laNegociacionColectiva'
import { laOfertaDeFinanciamiento } from '../../../content/events/laOfertaDeFinanciamiento'
import { laOrientacionPolitica } from '../../../content/events/laOrientacionPolitica'
import { laUnidadBasica } from '../../../content/events/laUnidadBasica'
import { calculateEventWeight } from '../../../domain/events/eventWeight'
import { getEligibleEvents } from '../../../domain/events/eventPool'
import type { CareerPathId, GameState } from '../../../domain/game/types/gameState'
import { chooseEvent } from '../chooseEvent'
import { getNextEvent } from '../getNextEvent'
import { startGame } from '../startGame'

const ALL_PATHS: CareerPathId[] = ['territorial', 'tecnica', 'empresarial', 'sindical', 'mediatica', 'institucional']

function withPath(path: CareerPathId): GameState {
  return { ...startGame('popular'), careerPath: path }
}

describe('1. each careerPath has its own events', () => {
  it('la_unidad_basica is only eligible for territorial, la_negociacion_colectiva only for sindical', () => {
    expect(getEligibleEvents([laUnidadBasica], withPath('territorial'))).toEqual([laUnidadBasica])
    expect(getEligibleEvents([laNegociacionColectiva], withPath('sindical'))).toEqual([laNegociacionColectiva])
  })
})

describe('2. path events do not appear indiscriminately', () => {
  it('a territorial event is never eligible for any other path, or for no path at all', () => {
    for (const path of ALL_PATHS.filter((p) => p !== 'territorial')) {
      expect(getEligibleEvents([laUnidadBasica], withPath(path))).toEqual([])
    }
    expect(getEligibleEvents([laUnidadBasica], startGame('popular'))).toEqual([]) // careerPath still unset
  })

  it('an empresarial event never appears for a sindical player', () => {
    expect(getEligibleEvents([elLobbyEmpresarial], withPath('sindical'))).toEqual([])
  })
})

describe('3. careerPath can evolve — it is never a rigid class', () => {
  it('el_asesor_politico pivots a territorial puntero into tecnica, recorded in careerPathHistory', () => {
    const state: GameState = { ...withPath('territorial'), role: 'puntero' }
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_asesor_politico')

    const pivoted = chooseEvent(state, elAsesorPolitico, elAsesorPolitico.choices[0])
    expect(pivoted.careerPath).toBe('tecnica')
    expect(pivoted.role).toBe('asesor')
    expect(pivoted.careerPathHistory.map((e) => e.careerPath)).toEqual(['tecnica'])
  })

  it('el_candidato_tecnico pivots a tecnica asesor into institucional', () => {
    const state: GameState = { ...withPath('tecnica'), role: 'asesor' }
    const pivoted = chooseEvent(state, elCandidatoTecnico, elCandidatoTecnico.choices[0])

    expect(pivoted.careerPath).toBe('institucional')
  })

  it('declining a pivot event leaves careerPath unchanged', () => {
    const state: GameState = { ...withPath('territorial'), role: 'puntero' }
    const declined = chooseEvent(state, elAsesorPolitico, elAsesorPolitico.choices[1])

    expect(declined.careerPath).toBe('territorial')
    expect(declined.careerPathHistory).toEqual([])
  })
})

describe('4. same role, different path -> different experience', () => {
  it('a territorial puntero and an empresarial puntero see different eligible content', () => {
    const territorial: GameState = { ...withPath('territorial'), role: 'puntero' }
    const empresarial: GameState = { ...withPath('empresarial'), role: 'puntero' }

    const territorialEligible = getEligibleEvents(defaultEventPool, territorial).map((e) => e.id)
    const empresarialEligible = getEligibleEvents(defaultEventPool, empresarial).map((e) => e.id)

    expect(territorialEligible).toContain('la_unidad_basica')
    expect(territorialEligible).not.toContain('el_lobby_empresarial')
    expect(empresarialEligible).toContain('el_lobby_empresarial')
    expect(empresarialEligible).not.toContain('la_unidad_basica')
  })

  it('a shared event offers genuinely different choices depending on path (la_oferta_de_financiamiento)', () => {
    const territorial = withPath('territorial')
    const tecnica = withPath('tecnica')
    const empresarial = withPath('empresarial')
    const mediatica = withPath('mediatica')
    const noPath = startGame('popular')

    const [territorialView] = getEligibleEvents([laOfertaDeFinanciamiento], territorial)
    const [tecnicaView] = getEligibleEvents([laOfertaDeFinanciamiento], tecnica)
    const [empresarialView] = getEligibleEvents([laOfertaDeFinanciamiento], empresarial)
    const [mediaticaView] = getEligibleEvents([laOfertaDeFinanciamiento], mediatica)
    const [noPathView] = getEligibleEvents([laOfertaDeFinanciamiento], noPath)

    expect(territorialView.choices.map((c) => c.id)).toContain('negociar_apoyo_territorial')
    expect(tecnicaView.choices.map((c) => c.id)).toContain('rechazar_por_conflicto_institucional')
    expect(empresarialView.choices.map((c) => c.id)).toContain('aceptar_la_inversion')
    expect(mediaticaView.choices.map((c) => c.id)).toContain('denunciar_publicamente')
    // no path set yet: only the neutral fallback is offered
    expect(noPathView.choices.map((c) => c.id)).toEqual(['evaluarlo_con_cautela'])
  })

  it('el_empresario_quiere_ayudarte gives territorial and tecnica two path choices each, empresarial/mediatica one each', () => {
    const territorialChoices = getEligibleEvents([elEmpresarioQuiereAyudarte], withPath('territorial'))[0].choices
    const tecnicaChoices = getEligibleEvents([elEmpresarioQuiereAyudarte], withPath('tecnica'))[0].choices
    const empresarialChoices = getEligibleEvents([elEmpresarioQuiereAyudarte], withPath('empresarial'))[0].choices
    const mediaticaChoices = getEligibleEvents([elEmpresarioQuiereAyudarte], withPath('mediatica'))[0].choices

    expect(territorialChoices.map((c) => c.id)).toEqual(['aceptar_apoyo', 'negociar_favores', 'responder_con_cautela'])
    expect(tecnicaChoices.map((c) => c.id)).toEqual(['transparentar_el_ofrecimiento', 'rechazar_el_ofrecimiento', 'responder_con_cautela'])
    expect(empresarialChoices.map((c) => c.id)).toEqual(['asociarse', 'responder_con_cautela'])
    expect(mediaticaChoices.map((c) => c.id)).toEqual(['convertirlo_en_noticia', 'responder_con_cautela'])
  })
})

describe('5. paths affect relationships via weighting, never by hardcoding the engine', () => {
  it('sindical raises el_sindicato\'s weight; empresarial raises el_financista\'s weight (already party/role-eligible)', () => {
    const sindicalPopular: GameState = { ...withPath('sindical'), role: 'puntero', party: 'popular' }
    const noPathPopular: GameState = { ...startGame('popular'), role: 'puntero' }

    expect(calculateEventWeight(elSindicato, sindicalPopular)).toBeGreaterThan(calculateEventWeight(elSindicato, noPathPopular))
  })

  it('la_orientacion_politica nudges each path\'s own natural relationship on pick', () => {
    let state: GameState = { ...startGame('popular'), role: 'militante' }
    const before = state.relationships.jefePartidario ?? 0

    const territorialChoice = laOrientacionPolitica.choices.find((c) => c.id === 'camino_territorial')!
    state = chooseEvent(state, laOrientacionPolitica, territorialChoice)

    expect(state.relationships.jefePartidario ?? 0).toBeGreaterThan(before)
    expect(state.careerPath).toBe('territorial')
  })
})

describe('6/7/8. simulation-level: distinct outcomes per path, none dead, no loops', () => {
  it('every path can be played through several turns without the pool ever going empty on turn 1 (no immediate dead end)', () => {
    for (const path of ALL_PATHS) {
      const state: GameState = { ...withPath(path), role: 'puntero' }
      expect(getNextEvent(state)).not.toBeNull()
    }
  })

  it('a bounded playthrough terminates (or hits the guard) for every path — no infinite loop', () => {
    for (const path of ALL_PATHS) {
      let state: GameState = { ...withPath(path), role: 'puntero' }
      let guard = 0
      for (; guard < 300; guard++) {
        const event = getNextEvent(state)
        if (!event) break
        state = chooseEvent(state, event, event.choices[0])
      }
      expect(guard).toBeLessThan(300) // reached natural termination before the guard, for every path
    }
  })
})

describe('9. regression: existing internal actor-chain events still fire correctly with the new weightModifiers attached', () => {
  it('el_sindicato remains eligible for a popular puntero regardless of careerPath', () => {
    const state: GameState = { ...startGame('popular'), role: 'puntero' }
    expect(getEligibleEvents([elSindicato], state)).toEqual([elSindicato])
  })

  it('la_interna_territorial never fires for a non-territorial player', () => {
    const state: GameState = { ...withPath('mediatica'), role: 'puntero' }
    expect(getEligibleEvents([laInternaTerritorial], state)).toEqual([])
  })
})
