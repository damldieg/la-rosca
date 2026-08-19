import { describe, expect, it } from 'vitest'
import { defaultEventPool } from '../../../content/events'
import { laCaidaMinisterial } from '../../../content/events/laCaidaMinisterial'
import { laFiltracion } from '../../../content/events/laFiltracion'
import { laInvestigacionPeriodistica } from '../../../content/events/laInvestigacionPeriodistica'
import { evaluateConditions } from '../../../domain/events/conditionEngine'
import { getEligibleEvents } from '../../../domain/events/eventPool'
import { calculateEventWeight, DEFAULT_EVENT_WEIGHT } from '../../../domain/events/eventWeight'
import type { GameState } from '../../../domain/game/types/gameState'
import { chooseEvent } from '../chooseEvent'
import { startGame } from '../startGame'

function stateWith(overrides: Partial<GameState>): GameState {
  return { ...startGame('popular'), role: 'concejal', ...overrides }
}

describe('exposure in conditions', () => {
  it('a StatCondition can evaluate exposure exactly like any other stat, with no special-casing in the engine', () => {
    const state = stateWith({ exposure: 55 })

    expect(evaluateConditions({ type: 'stat', stat: 'exposure', operator: 'gte', value: 50 }, state)).toBe(true)
    expect(evaluateConditions({ type: 'stat', stat: 'exposure', operator: 'gte', value: 60 }, state)).toBe(false)
  })

  it('supports combined corruption AND exposure conditions', () => {
    const state = stateWith({ corruption: 60, exposure: 50 })
    const condition = {
      type: 'and' as const,
      conditions: [
        { type: 'stat' as const, stat: 'corruption' as const, operator: 'gte' as const, value: 60 },
        { type: 'stat' as const, stat: 'exposure' as const, operator: 'gte' as const, value: 50 },
      ],
    }

    expect(evaluateConditions(condition, state)).toBe(true)
    expect(evaluateConditions(condition, { ...state, exposure: 10 })).toBe(false)
  })
})

describe('la_investigacion_periodistica: appears with high corruption+exposure, not without', () => {
  it('is eligible for a concejal with corruption >= 40 and exposure >= 50', () => {
    const state = stateWith({ corruption: 45, exposure: 55 })
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_investigacion_periodistica')
  })

  it('is NOT eligible for a puntero, even with high corruption/exposure', () => {
    const state = stateWith({ role: 'puntero', corruption: 80, exposure: 80 })
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain('la_investigacion_periodistica')
  })

  it('is NOT eligible below either threshold', () => {
    const lowCorruption = stateWith({ corruption: 10, exposure: 80 })
    const lowExposure = stateWith({ corruption: 80, exposure: 10 })

    expect(getEligibleEvents(defaultEventPool, lowCorruption).map((e) => e.id)).not.toContain('la_investigacion_periodistica')
    expect(getEligibleEvents(defaultEventPool, lowExposure).map((e) => e.id)).not.toContain('la_investigacion_periodistica')
  })

  it('its three choices produce meaningfully different consequences', () => {
    const state = stateWith({ corruption: 45, exposure: 55 })

    const denied = chooseEvent(state, laInvestigacionPeriodistica, laInvestigacionPeriodistica.choices[0])
    const collaborated = chooseEvent(state, laInvestigacionPeriodistica, laInvestigacionPeriodistica.choices[1])
    const attacked = chooseEvent(state, laInvestigacionPeriodistica, laInvestigacionPeriodistica.choices[2])

    expect(denied.exposure).toBeGreaterThan(state.exposure)
    expect(collaborated.exposure).toBeLessThan(state.exposure)
    expect(attacked.exposure).toBeGreaterThan(collaborated.exposure)
    expect(attacked.relationships.periodista).toBeLessThan(denied.relationships.periodista)
  })
})

describe('relationships influence risk: negative relationships expose you, positive ones can protect you', () => {
  it('la_filtracion needs a badly damaged periodista relationship plus real exposure', () => {
    const exposedButTrusted = stateWith({ exposure: 60, relationships: { periodista: 20 } })
    const exposedAndHated = stateWith({ exposure: 60, relationships: { periodista: -40 } })

    expect(getEligibleEvents(defaultEventPool, exposedButTrusted).map((e) => e.id)).not.toContain('la_filtracion')
    expect(getEligibleEvents(defaultEventPool, exposedAndHated).map((e) => e.id)).toContain('la_filtracion')
  })

  it('a hostile periodista relationship raises la_filtracion’s weight further via a weightModifier', () => {
    const mildlyHated = stateWith({ exposure: 60, relationships: { periodista: -30 } })
    const deeplyHated = stateWith({ exposure: 60, relationships: { periodista: -55 } })

    expect(calculateEventWeight(laFiltracion, deeplyHated)).toBeGreaterThan(calculateEventWeight(laFiltracion, mildlyHated))
  })

  it('a weak, unprotected player facing a scandal cannot reach la_supervivencia_del_escandalo', () => {
    const weak = stateWith({ power: 20, relationships: { jefePartidario: 5 }, flags: ['under_investigation'] })
    expect(getEligibleEvents(defaultEventPool, weak).map((e) => e.id)).not.toContain('la_supervivencia_del_escandalo')
  })

  it('a powerful, well-connected player facing the same scandal CAN reach la_supervivencia_del_escandalo', () => {
    const protectedPlayer = stateWith({ power: 90, relationships: { jefePartidario: 80 }, flags: ['under_investigation'] })
    expect(getEligibleEvents(defaultEventPool, protectedPlayer).map((e) => e.id)).toContain('la_supervivencia_del_escandalo')
  })

  it('el_indulto_politico demonstrates impunity (an existing stat, not a new mechanic) protecting a player', () => {
    const highImpunity = stateWith({ impunity: 50, flags: ['under_investigation'] })
    const lowImpunity = stateWith({ impunity: 5, flags: ['under_investigation'] })

    expect(getEligibleEvents(defaultEventPool, highImpunity).map((e) => e.id)).toContain('el_indulto_politico')
    expect(getEligibleEvents(defaultEventPool, lowImpunity).map((e) => e.id)).not.toContain('el_indulto_politico')
  })
})

describe('a scandal can affect career, not just stats', () => {
  it('a weak ministro under investigation can fall to diputado through la_caida_ministerial', () => {
    const fallingMinister = stateWith({ role: 'ministro', power: 30, flags: ['under_investigation'] })
    expect(getEligibleEvents(defaultEventPool, fallingMinister).map((e) => e.id)).toContain('la_caida_ministerial')

    const after = chooseEvent(fallingMinister, laCaidaMinisterial, laCaidaMinisterial.choices[0])
    expect(after.role).toBe('diputado')
  })

  it('a powerful ministro under investigation is not offered la_caida_ministerial at all', () => {
    const strongMinister = stateWith({ role: 'ministro', power: 70, flags: ['under_investigation'] })
    expect(getEligibleEvents(defaultEventPool, strongMinister).map((e) => e.id)).not.toContain('la_caida_ministerial')
  })

  it('choosing to resist instead of resigning keeps the role but at a real cost', () => {
    const fallingMinister = stateWith({ role: 'ministro', power: 30, popularity: 50, flags: ['under_investigation'] })
    const resisted = chooseEvent(fallingMinister, laCaidaMinisterial, laCaidaMinisterial.choices[1])

    expect(resisted.role).toBe('ministro')
    expect(resisted.popularity).toBeLessThan(fallingMinister.popularity)
  })
})

describe('an internal rival is a separate risk track from press scrutiny', () => {
  it('el_rival_interno needs real power and some corruption, regardless of exposure', () => {
    const state = stateWith({ power: 45, corruption: 35, exposure: 0 })
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_rival_interno')
  })

  it('branches into la_interna_partidaria (bad) or el_pacto_de_gobernabilidad (good) depending on jefePartidario', () => {
    const isolated = { ...stateWith({}), flags: ['internal_investigation'], relationships: { jefePartidario: 5 } }
    const backed = { ...stateWith({}), flags: ['internal_investigation'], relationships: { jefePartidario: 60 } }

    expect(getEligibleEvents(defaultEventPool, isolated).map((e) => e.id)).toContain('la_interna_partidaria')
    expect(getEligibleEvents(defaultEventPool, isolated).map((e) => e.id)).not.toContain('el_pacto_de_gobernabilidad')

    expect(getEligibleEvents(defaultEventPool, backed).map((e) => e.id)).toContain('el_pacto_de_gobernabilidad')
    expect(getEligibleEvents(defaultEventPool, backed).map((e) => e.id)).not.toContain('la_interna_partidaria')
  })
})

describe('weighted selection integration', () => {
  it('risk events use the same default weight as ordinary content when no modifier applies', () => {
    const state = stateWith({ corruption: 45, exposure: 55 })
    expect(calculateEventWeight(laInvestigacionPeriodistica, state)).toBe(DEFAULT_EVENT_WEIGHT)
  })

  it('weight modifiers correctly raise it as corruption/exposure climb further, without breaking a normal unrelated event', () => {
    const state = stateWith({ corruption: 55, exposure: 65, relationships: { periodista: -50 } })
    const weight = calculateEventWeight(laInvestigacionPeriodistica, state)

    // corruption>=50 (+20) + exposure>=60 (+30) + periodista<=-40 (+15) on top of the base 10
    expect(weight).toBe(DEFAULT_EVENT_WEIGHT + 20 + 30 + 15)

    // An unrelated, ordinary event elsewhere in the pool is unaffected.
    const ordinaryEvent = defaultEventPool.find((e) => e.id === 'club_del_barrio')!
    expect(calculateEventWeight(ordinaryEvent, state)).toBe(DEFAULT_EVENT_WEIGHT)
  })
})
