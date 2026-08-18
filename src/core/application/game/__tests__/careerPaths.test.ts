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
import { chooseEvent } from '../chooseEvent'
import { getNextEvent } from '../getNextEvent'
import { startGame } from '../startGame'

/** Plays a full deterministic run always taking the first offered choice. */
function playToTheEnd(partyId: PartyId): { state: GameState; eventIds: string[] } {
  let state = startGame(partyId)
  const eventIds: string[] = []

  for (let guard = 0; guard < 50; guard++) {
    const event = getNextEvent(state)
    if (!event) break
    eventIds.push(event.id)
    state = chooseEvent(state, event, event.choices[0])
  }

  return { state, eventIds }
}

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
