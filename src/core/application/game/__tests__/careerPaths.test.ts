import { describe, expect, it } from 'vitest'
import { defaultEventPool } from '../../../content/events'
import { clubDelBarrio } from '../../../content/events/clubDelBarrio'
import { elFinancista } from '../../../content/events/elFinancista'
import { elSindicato } from '../../../content/events/elSindicato'
import { laAsesoria } from '../../../content/events/laAsesoria'
import { laCampana } from '../../../content/events/laCampana'
import { laDiputacion } from '../../../content/events/laDiputacion'
import { getEligibleEvents } from '../../../domain/events/eventPool'
import type { GameState } from '../../../domain/game/types/gameState'
import type { PartyId } from '../../../domain/party/types'
import { FixedRandomSource, SeededRandomSource } from '../../../domain/random/randomSource'
import { chooseEvent } from '../chooseEvent'
import { getNextEvent } from '../getNextEvent'
import { startGame } from '../startGame'

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

  for (let guard = 0; guard < 50; guard++) {
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
    const state = startGame('popular')
    const eligible = getEligibleEvents(defaultEventPool, state).map((e) => e.id)

    expect(eligible).toContain(elSindicato.id)
    expect(eligible).not.toContain(elFinancista.id)
    expect(eligible).not.toContain(laAsesoria.id)
  })

  it('a liberal-party player never sees el_sindicato and can reach the asesor/diputado branch', () => {
    let state = startGame('liberal')

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

    expect(popular.state.role).toBe('gobernador') // territorial branch
    expect(liberal.state.role).toBe('diputado') // asesor branch
    expect(popular.state.role).not.toBe(liberal.state.role)
  })

  it('every playthrough terminates once the eligible pool is exhausted', () => {
    for (const partyId of ['popular', 'liberal', 'progresista'] as const) {
      const { state } = playToTheEnd(partyId)
      expect(getNextEvent(state)).toBeNull()
    }
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

describe('career reaches senador/ministro/presidente only through events, never through age', () => {
  it('the full ladder above concejal requires the partido chain and threshold events, not age', () => {
    const senadorReady = {
      ...startGame('popular'),
      role: 'senador' as const,
      power: 60,
    }
    expect(getEligibleEvents(defaultEventPool, senadorReady).map((e) => e.id)).toContain('el_gabinete')

    const ministroReady = { ...senadorReady, role: 'ministro' as const, power: 80 }
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

  it('age has no bearing on promotion eligibility — only the underlying stats/relationships do', () => {
    const young = { ...startGame('popular'), role: 'senador' as const, power: 60, age: 19 }
    const old = { ...young, age: 95 }

    expect(getEligibleEvents(defaultEventPool, young).map((e) => e.id)).toContain('el_gabinete')
    expect(getEligibleEvents(defaultEventPool, old).map((e) => e.id)).toContain('el_gabinete')
  })
})

describe('promotion is blocked until its requirements are met', () => {
  it('la_diputacion stays ineligible below the power threshold, and becomes eligible once it is met', () => {
    const belowThreshold = { ...startGame('liberal'), role: 'asesor' as const, power: 10 }
    expect(getEligibleEvents([laDiputacion], belowThreshold)).toEqual([])

    const aboveThreshold = { ...belowThreshold, power: 25 }
    expect(getEligibleEvents([laDiputacion], aboveThreshold)).toEqual([laDiputacion])
  })

  it('an invalid promotion attempt never happens because the event simply is not offered', () => {
    const state = { ...startGame('liberal'), role: 'asesor' as const, power: 10 }
    const eligible = getEligibleEvents(defaultEventPool, state)

    expect(eligible.map((e) => e.id)).not.toContain('la_diputacion')
    expect(state.role).toBe('asesor') // unchanged: no decision was ever offered or applied
  })
})
