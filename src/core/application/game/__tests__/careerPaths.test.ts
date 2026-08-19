import { describe, expect, it } from 'vitest'
import { defaultEventPool } from '../../../content/events'
import { clubDelBarrio } from '../../../content/events/clubDelBarrio'
import { elAsesorPolitico } from '../../../content/events/elAsesorPolitico'
import { elCandidatoTecnico } from '../../../content/events/elCandidatoTecnico'
import { elDirigenteMediatico } from '../../../content/events/elDirigenteMediatico'
import { elFinancista } from '../../../content/events/elFinancista'
import { elLlamadoNacional } from '../../../content/events/elLlamadoNacional'
import { elLobbyista } from '../../../content/events/elLobbyista'
import { elReferente } from '../../../content/events/elReferente'
import { elSindicato } from '../../../content/events/elSindicato'
import { laAsesoria } from '../../../content/events/laAsesoria'
import { laCampana } from '../../../content/events/laCampana'
import { laCandidaturaAlSenado } from '../../../content/events/laCandidaturaAlSenado'
import { laConsolidacionTerritorial } from '../../../content/events/laConsolidacionTerritorial'
import { laDiputacion } from '../../../content/events/laDiputacion'
import { laOrientacionPolitica } from '../../../content/events/laOrientacionPolitica'
import { laPrimeraMilitancia } from '../../../content/events/laPrimeraMilitancia'
import { laRedDeContactos } from '../../../content/events/laRedDeContactos'
import { calculateEventWeight } from '../../../domain/events/eventWeight'
import { getEligibleEvents } from '../../../domain/events/eventPool'
import { STARTING_AGE } from '../../../domain/game/state/initialState'
import type { GameState, Role } from '../../../domain/game/types/gameState'
import type { PartyId } from '../../../domain/party/types'
import { FixedRandomSource, SeededRandomSource } from '../../../domain/random/randomSource'
import { chooseEvent } from '../chooseEvent'
import { getNextEvent } from '../getNextEvent'
import { startGame } from '../startGame'

/**
 * age is derived from STARTING_AGE + date.years on every applyDecision (Fase 7.5)
 * — a state built with `{ ...state, age: N }` alone loses that override the
 * instant it goes through another chooseEvent, since only `date` actually
 * persists. Use this whenever a test needs the age override to survive a
 * subsequent chooseEvent call, not just an immediate eligibility check.
 */
function agedState(state: GameState, age: number): GameState {
  return { ...state, age, date: { ...state.date, years: age - STARTING_AGE } }
}

/**
 * Plays under real weighted randomness (a seeded, reproducible RandomSource),
 * always taking the choice that advances the "el_jefe_politico -> la_interna ->
 * la_traicion -> el_ascenso" loyalty chain when it's offered, and choices[0]
 * otherwise. Used to confirm the milestone floor (see eventWeight.ts) actually
 * keeps a critical chain reachable once randomness picks which normal events
 * appear along the way, not just which choices are made.
 */
function playLoyalPathWithSeed(seed: number): GameState {
  const loyalChoiceId: Record<string, string> = {
    el_jefe_politico: 'jurar_lealtad_al_jefe',
    la_interna: 'disciplinarte_a_la_lista_oficial',
    la_traicion: 'mantenerte_leal',
  }

  let state = startGame('popular')
  const random = new SeededRandomSource(seed)

  for (let guard = 0; guard < 200; guard++) {
    const event = getNextEvent(state, random)
    if (!event) break
    const preferredId = loyalChoiceId[event.id]
    const choice = event.choices.find((c) => c.id === preferredId) ?? event.choices[0]
    state = chooseEvent(state, event, choice)
  }

  return state
}

/**
 * Plays a full deterministic run always taking the first offered choice, and
 * always the first eligible event in pool order (roll 0 — see eventSelector.ts).
 * Deterministic on purpose: this test asserts a specific expected path exists,
 * not what weighted selection's distribution looks like (see eventSelector.test.ts
 * for that).
 */
function playToTheEnd(partyId: PartyId): { state: GameState; eventIds: string[] } {
  let state = startGame(partyId)
  const random = new FixedRandomSource(0)
  const eventIds: string[] = []

  // Fase 8's own territorial-path content pushed the popular party's deterministic
  // path past the old guard of 50 (now needs ~52) before the pool exhausts.
  for (let guard = 0; guard < 100; guard++) {
    const event = getNextEvent(state, random)
    if (!event) break
    eventIds.push(event.id)
    state = chooseEvent(state, event, event.choices[0])
  }

  return { state, eventIds }
}

describe('parties start with a different political network', () => {
  it('each party begins with distinct initial relationships, shaping which chains open first', () => {
    const popular = startGame('popular')
    const liberal = startGame('liberal')
    const progresista = startGame('progresista')

    expect(popular.relationships.sindicalista).toBeGreaterThan(0)
    expect(liberal.relationships.empresario).toBeGreaterThan(0)
    expect(progresista.relationships.periodista).toBeGreaterThan(0)
    expect(popular.relationships).not.toEqual(liberal.relationships)
  })
})

describe('party choice diverges the playthrough', () => {
  it('a popular-party player can see el_sindicato but never the liberal-only or asesor content', () => {
    // role forced to 'puntero': this test isolates the puntero-tier party split
    // from the militante/referente early career (see 'early career' below for that).
    const state: GameState = { ...startGame('popular'), role: 'puntero' }
    const eligible = getEligibleEvents(defaultEventPool, state).map((e) => e.id)

    expect(eligible).toContain(elSindicato.id)
    expect(eligible).not.toContain(elFinancista.id)
    expect(eligible).not.toContain(laAsesoria.id)
  })

  it('a liberal-party player never sees el_sindicato and can reach the asesor/diputado branch', () => {
    // la_asesoria's age>=22 gate (Fase 7.5) — agedState so it survives the chooseEvent calls below.
    let state: GameState = agedState({ ...startGame('liberal'), role: 'puntero' }, 22)

    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).not.toContain(elSindicato.id)
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain(elFinancista.id)

    // build popularity up to la_asesoria's threshold (30) via real choices
    state = chooseEvent(state, clubDelBarrio, clubDelBarrio.choices[0]) // help_club: +5 popularity
    state = chooseEvent(state, laCampana, laCampana.choices[0]) // puerta_a_puerta: +8 popularity
    expect(state.popularity).toBeGreaterThanOrEqual(30)
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_asesoria')

    state = chooseEvent(state, laAsesoria, laAsesoria.choices[0]) // aceptar_asesoria -> role: asesor
    expect(state.role).toBe('asesor')
  })
})

describe('a full playthrough differs by party', () => {
  it('popular and liberal players actually see different events and end in different roles', () => {
    const popular = playToTheEnd('popular')
    const liberal = playToTheEnd('liberal')

    // Regression guard: pool ORDER decides this, not just conditions. With the
    // party-specific events ordered after the promotions, both runs silently
    // collapsed onto the identical path even though eligibility differed.
    const onlyPopular = popular.eventIds.filter((id) => !liberal.eventIds.includes(id))
    const onlyLiberal = liberal.eventIds.filter((id) => !popular.eventIds.includes(id))

    expect(onlyPopular).toContain(elSindicato.id)
    expect(onlyLiberal).toContain(elFinancista.id)
    expect(onlyLiberal).toContain(laAsesoria.id)

    // Territorial branch: intendente -> gobernador -> el_llamado_nacional -> ministro -> presidente
    // (gobernador is no longer a dead end — see elLlamadoNacional.ts). Técnica branch:
    // asesor -> diputado -> senador -> ministro -> presidente (diputado is no longer a
    // dead end either, as of Fase 7.5 — see laCandidaturaAlSenado.ts). Both reach the
    // top today; the divergence this test actually guards is which EVENTS each party
    // sees along the way (asserted above), not which role they end on.
    expect(popular.state.role).toBe('presidente')
    expect(liberal.state.role).toBe('presidente')
  })

  it('every playthrough terminates once the eligible pool is exhausted, even a permanently corrupt one', () => {
    for (const partyId of ['popular', 'liberal', 'progresista'] as const) {
      const { state } = playToTheEnd(partyId)
      expect(getNextEvent(state)).toBeNull()
    }
  })

  it('a corrupt career keeps facing el_barometro_de_opinion for as long as it stays exposed, but managing exposure down eventually ends the cycle', () => {
    // The popular deterministic path racks up real corruption (stays >= 20
    // for the rest of the game) but always answers el_barometro_de_opinion
    // with "responder_con_datos" (exposure -3 each time), so exposure
    // eventually drops below the event's own exposure >= 10 floor and the
    // pool finally empties — corruption alone isn't a life sentence, staying
    // exposed is (see elBarometroDeOpinion.ts).
    const { state } = playToTheEnd('popular')

    expect(state.corruption).toBeGreaterThanOrEqual(20)
    expect(state.exposure).toBeLessThan(10)
  })
})

describe('weighted selection keeps the el_ascenso milestone chain reachable', () => {
  it('a loyal path reaches senador via el_ascenso across many independently seeded playthroughs', () => {
    const seeds = Array.from({ length: 25 }, (_, i) => i + 1)
    const reachedSenador = seeds.filter((seed) => {
      const state = playLoyalPathWithSeed(seed)
      return ['senador', 'gobernador', 'ministro', 'presidente'].includes(state.role)
    })

    // Not 25/25: normal-weight events can still occasionally consume enough
    // of a run's guard budget that the chain doesn't fully resolve. The
    // milestone floor's job is to make it reliable, not literally guaranteed
    // on every seed.
    expect(reachedSenador.length).toBeGreaterThanOrEqual(20)
  })

  it('is itself reproducible: the same seed always reaches the same outcome', () => {
    const first = playLoyalPathWithSeed(3)
    const second = playLoyalPathWithSeed(3)

    expect(second.role).toBe(first.role)
    expect(second.history).toEqual(first.history)
  })
})

// Before Fase 7.5, age never gated a promotion — only events/stats/relationships did (see git
// history for the old version of this describe block). The spec explicitly reverses that: age
// is now one more AND-gate alongside the existing ones, never the sole trigger on its own —
// this block now asserts *that* intended behavior instead.
describe('career reaches senador/ministro/presidente through events AND age, neither alone (Fase 7.5)', () => {
  it('the full ladder above concejal requires the partido chain and threshold events, given a sufficient age', () => {
    const senadorReady = {
      ...startGame('popular'),
      role: 'senador' as const,
      age: 38,
      power: 60,
    }
    expect(getEligibleEvents(defaultEventPool, senadorReady).map((e) => e.id)).toContain('el_gabinete')

    const ministroReady = { ...senadorReady, role: 'ministro' as const, age: 40, power: 80 }
    expect(getEligibleEvents(defaultEventPool, ministroReady).map((e) => e.id)).toContain('la_presidencia')
  })

  it('reaching senador stays blocked below el_ascenso power/relationship requirements even at old age', () => {
    const veryOldButUnearned = {
      ...startGame('popular'),
      age: 90,
      role: 'concejal' as const,
      flags: ['confronted_opposition'],
      relationships: { jefePartidario: 10 }, // below el_ascenso's 40 threshold
    }

    expect(getEligibleEvents(defaultEventPool, veryOldButUnearned).map((e) => e.id)).not.toContain('el_ascenso')
  })

  it('el_gabinete stays blocked below its age>=20 gate, even with power fully earned (Fase 7.5)', () => {
    const tooYoung = { ...startGame('popular'), role: 'senador' as const, power: 60, age: 19 }
    const oldEnough = { ...tooYoung, age: 20 }

    expect(getEligibleEvents(defaultEventPool, tooYoung).map((e) => e.id)).not.toContain('el_gabinete')
    expect(getEligibleEvents(defaultEventPool, oldEnough).map((e) => e.id)).toContain('el_gabinete')
  })

  it('age alone never promotes anyone — el_gabinete still requires the power threshold regardless of age', () => {
    const oldButWeak = { ...startGame('popular'), role: 'senador' as const, power: 10, age: 60 }

    expect(getEligibleEvents(defaultEventPool, oldButWeak).map((e) => e.id)).not.toContain('el_gabinete')
  })
})

describe('gobernador is no longer a career dead end (Fase 6.75)', () => {
  it('a gobernador with enough power can access el_llamado_nacional, the twin of el_gabinete', () => {
    const gobernadorReady = { ...startGame('popular'), role: 'gobernador' as const, age: 38, power: 55 }
    expect(getEligibleEvents(defaultEventPool, gobernadorReady).map((e) => e.id)).toContain('el_llamado_nacional')
  })

  it('stays blocked below the power threshold, exactly like el_gabinete', () => {
    const gobernadorNotReady = { ...startGame('popular'), role: 'gobernador' as const, age: 38, power: 30 }
    expect(getEligibleEvents(defaultEventPool, gobernadorNotReady).map((e) => e.id)).not.toContain('el_llamado_nacional')
  })

  it('accepting el_llamado_nacional promotes to ministro, from which la_presidencia is reachable exactly as via the senador route', () => {
    const gobernadorReady = agedState({ ...startGame('popular'), role: 'gobernador' as const, power: 55 }, 40)
    const afterLlamado = chooseEvent(gobernadorReady, elLlamadoNacional, elLlamadoNacional.choices[0])

    expect(afterLlamado.role).toBe('ministro')
    expect(getEligibleEvents(defaultEventPool, { ...afterLlamado, power: 75 }).map((e) => e.id)).toContain('la_presidencia')
  })

  it('senador and gobernador are parallel, independent routes into ministro — neither event fires for the other role', () => {
    const senador = { ...startGame('popular'), role: 'senador' as const, age: 38, power: 60 }
    const gobernador = { ...senador, role: 'gobernador' as const }

    expect(getEligibleEvents(defaultEventPool, senador).map((e) => e.id)).toContain('el_gabinete')
    expect(getEligibleEvents(defaultEventPool, senador).map((e) => e.id)).not.toContain('el_llamado_nacional')
    expect(getEligibleEvents(defaultEventPool, gobernador).map((e) => e.id)).toContain('el_llamado_nacional')
    expect(getEligibleEvents(defaultEventPool, gobernador).map((e) => e.id)).not.toContain('el_gabinete')
  })
})

describe('no accidental terminal roles among the career-ladder roles this fix covers', () => {
  const READY_STATES: { role: Role; overrides: Partial<GameState> }[] = [
    { role: 'concejal', overrides: { age: 28, flags: ['trusted_by_party'] } },
    { role: 'intendente', overrides: { age: 32, power: 45 } },
    { role: 'gobernador', overrides: { age: 38, power: 55 } },
    { role: 'senador', overrides: { age: 38, power: 55 } },
    // diputado: was a genuine dead end before Fase 7.5 — see laCandidaturaAlSenado.ts.
    { role: 'diputado', overrides: { age: 32, power: 40 } },
    { role: 'ministro', overrides: { age: 40, power: 75 } },
  ]

  it.each(READY_STATES)('role $role has at least one event that can move the player out of it once ready', ({ role, overrides }) => {
    const state: GameState = { ...startGame('popular'), role, ...overrides }
    const eligible = getEligibleEvents(defaultEventPool, state)

    const hasContinuation = eligible.some((event) => event.choices.some((choice) => choice.role && choice.role !== role))
    expect(hasContinuation).toBe(true)
  })
})

describe('promotion is blocked until its requirements are met', () => {
  it('la_diputacion stays ineligible below the power threshold, and becomes eligible once it is met', () => {
    const belowThreshold = { ...startGame('liberal'), role: 'asesor' as const, age: 28, power: 10 }
    expect(getEligibleEvents([laDiputacion], belowThreshold)).toEqual([])

    const aboveThreshold = { ...belowThreshold, power: 25 }
    expect(getEligibleEvents([laDiputacion], aboveThreshold)).toEqual([laDiputacion])
  })

  it('an invalid promotion attempt never happens because the event simply is not offered', () => {
    const state = { ...startGame('liberal'), role: 'asesor' as const, age: 28, power: 10 }
    const eligible = getEligibleEvents(defaultEventPool, state)

    expect(eligible.map((e) => e.id)).not.toContain('la_diputacion')
    expect(state.role).toBe('asesor') // unchanged: no decision was ever offered or applied
  })
})

describe('early career: militante -> referente -> puntero (Fase 7.5)', () => {
  it('a fresh game starts as a militante, not a puntero', () => {
    const state = startGame('popular')
    expect(state.role).toBe('militante')
  })

  it('el_referente requires the commitment flag — no age gate here, deliberately (see elReferente.ts)', () => {
    const withoutFlag = startGame('popular')
    const withFlag = { ...withoutFlag, flags: ['showed_early_commitment'] }

    expect(getEligibleEvents(defaultEventPool, withoutFlag).map((e) => e.id)).not.toContain('el_referente')
    expect(getEligibleEvents(defaultEventPool, withFlag).map((e) => e.id)).toContain('el_referente')
  })

  it('la_consolidacion_territorial requires only the referente role, and grants puntero', () => {
    const notReady = startGame('popular') // role: militante
    expect(getEligibleEvents(defaultEventPool, notReady).map((e) => e.id)).not.toContain('la_consolidacion_territorial')

    const ready = { ...notReady, role: 'referente' as const }
    expect(getEligibleEvents(defaultEventPool, ready).map((e) => e.id)).toContain('la_consolidacion_territorial')

    const promoted = chooseEvent(ready, laConsolidacionTerritorial, laConsolidacionTerritorial.choices[0])
    expect(promoted.role).toBe('puntero')
  })

  it('militante -> referente -> puntero actually happens through real choices, not a forced override', () => {
    let state = startGame('popular')
    expect(state.role).toBe('militante')

    state = chooseEvent(state, laPrimeraMilitancia, laPrimeraMilitancia.choices[0]) // sumarte_de_lleno -> showed_early_commitment
    state = chooseEvent(state, laRedDeContactos, laRedDeContactos.choices[0]) // tejer_relaciones
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('el_referente')

    state = chooseEvent(state, elReferente, elReferente.choices[0]) // asumir_como_referente
    expect(state.role).toBe('referente')
    expect(state.roleHistory.map((e) => e.role)).toEqual(['militante', 'referente'])
    expect(getEligibleEvents(defaultEventPool, state).map((e) => e.id)).toContain('la_consolidacion_territorial')

    state = chooseEvent(state, laConsolidacionTerritorial, laConsolidacionTerritorial.choices[0]) // aceptar_la_estructura
    expect(state.role).toBe('puntero')
    expect(state.roleHistory.map((e) => e.role)).toEqual(['militante', 'referente', 'puntero'])
  })
})

describe('diputado is no longer a career dead end (Fase 7.5)', () => {
  it('la_candidatura_al_senado stays blocked below its age/power gates', () => {
    const tooWeak = { ...startGame('popular'), role: 'diputado' as const, age: 19, power: 10 }
    const tooYoung = { ...startGame('popular'), role: 'diputado' as const, age: 18, power: 40 }

    expect(getEligibleEvents(defaultEventPool, tooWeak).map((e) => e.id)).not.toContain('la_candidatura_al_senado')
    expect(getEligibleEvents(defaultEventPool, tooYoung).map((e) => e.id)).not.toContain('la_candidatura_al_senado')
  })

  it('accepting la_candidatura_al_senado promotes a diputado to senador', () => {
    const diputadoReady = { ...startGame('popular'), role: 'diputado' as const, age: 19, power: 40 }
    const promoted = chooseEvent(diputadoReady, laCandidaturaAlSenado, laCandidaturaAlSenado.choices[0])

    expect(promoted.role).toBe('senador')
  })
})

describe('careerPath: set by la_orientacion_politica, never a rigid class (Fase 7.5)', () => {
  it('is unset until la_orientacion_politica resolves', () => {
    expect(startGame('popular').careerPath).toBeUndefined()
  })

  it('any militante can pick any path, regardless of party', () => {
    const state = { ...startGame('liberal'), role: 'militante' as const }
    const chosen = chooseEvent(state, laOrientacionPolitica, laOrientacionPolitica.choices.find((c) => c.careerPath === 'sindical')!)

    expect(chosen.careerPath).toBe('sindical')
  })

  it('nudges an aligned event\'s weight upward without making a misaligned path ineligible', () => {
    const territorial = { ...startGame('popular'), role: 'referente' as const, age: 20, flags: ['built_early_network'], careerPath: 'territorial' as const }
    const sindical = { ...territorial, careerPath: 'sindical' as const }

    const territorialWeight = calculateEventWeight(laConsolidacionTerritorial, territorial)
    const sindicalWeight = calculateEventWeight(laConsolidacionTerritorial, sindical)

    expect(territorialWeight).toBeGreaterThan(sindicalWeight)
    // Still eligible either way — careerPath only weights, it never gates (spec §9).
    expect(getEligibleEvents(defaultEventPool, sindical).map((e) => e.id)).toContain('la_consolidacion_territorial')
  })
})

describe('Fase 9: strategic career agency', () => {
  it('changing careerPath does not change role, unless the choice itself says so', () => {
    // el_dirigente_mediatico's accept choice only sets careerPath, no role field at all.
    const state: GameState = { ...startGame('popular'), role: 'diputado' as const, careerPath: 'mediatica' }
    const pivoted = chooseEvent(state, elDirigenteMediatico, elDirigenteMediatico.choices[0])

    expect(pivoted.careerPath).toBe('sindical')
    expect(pivoted.role).toBe('diputado') // unchanged
  })

  it('changing careerPath does not erase relationships the choice never mentions', () => {
    const state: GameState = {
      ...startGame('popular'),
      role: 'diputado' as const,
      careerPath: 'mediatica',
      relationships: { periodista: 40, jefePartidario: 12 },
    }
    // el_dirigente_mediatico's accept choice touches sindicalista/periodista, never jefePartidario.
    const pivoted = chooseEvent(state, elDirigenteMediatico, elDirigenteMediatico.choices[0])

    expect(pivoted.relationships.jefePartidario).toBe(12)
  })

  it('careerPath can change more than once in the same game', () => {
    const state: GameState = { ...startGame('popular'), role: 'puntero' as const, careerPath: 'territorial' }

    const first = chooseEvent(state, elAsesorPolitico, elAsesorPolitico.choices[0])
    expect(first.careerPath).toBe('tecnica')
    expect(first.role).toBe('asesor')

    const second = chooseEvent(first, elCandidatoTecnico, elCandidatoTecnico.choices[0])
    expect(second.careerPath).toBe('institucional')

    expect(second.careerPathHistory.map((e) => e.careerPath)).toEqual(['tecnica', 'institucional'])
  })

  it('a party nudges a pivot event\'s weight upward without ever making it ineligible for another party', () => {
    const liberalTecnico: GameState = { ...startGame('liberal'), role: 'asesor' as const, careerPath: 'tecnica' }
    const popularTecnico: GameState = { ...liberalTecnico, party: 'popular' as const }

    expect(calculateEventWeight(elLobbyista, liberalTecnico)).toBeGreaterThan(calculateEventWeight(elLobbyista, popularTecnico))
    expect(getEligibleEvents(defaultEventPool, popularTecnico).map((e) => e.id)).toContain('el_lobbyista')
  })

  it('every careerPath can transition to at least one other via a valid decision (no dead ends, Fase 9 §10/§11)', () => {
    const ALL: GameState['careerPath'][] = ['territorial', 'tecnica', 'empresarial', 'sindical', 'mediatica', 'institucional']
    for (const path of ALL) {
      const state: GameState = { ...startGame('popular'), role: 'diputado' as const, careerPath: path }
      const eligible = getEligibleEvents(defaultEventPool, state)
      const canPivot = eligible.some((event) => event.choices.some((choice) => choice.careerPath !== undefined && choice.careerPath !== path))
      expect(canPivot).toBe(true)
    }
  })
})
