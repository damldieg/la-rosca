import { describe, expect, it } from 'vitest'
import { clubDelBarrio } from '../../content/events/clubDelBarrio'
import { defaultEventPool } from '../../content/events'
import { elDebateMunicipal } from '../../content/events/elDebateMunicipal'
import { elEmpresario } from '../../content/events/elEmpresario'
import { laLicitacion } from '../../content/events/laLicitacion'
import { laOportunidad } from '../../content/events/laOportunidad'
import { getEligibleEvents } from '../../domain/events/eventPool'
import { chooseEvent } from './chooseEvent'
import { getNextEvent } from './getNextEvent'
import { startGame } from './startGame'

describe('event chain: el empresario -> la licitación', () => {
  it('appears once the player accepted the businessman and became concejal', () => {
    let state = startGame()
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
    let state = startGame()
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
    const state = startGame()

    expect(getNextEvent(state)).toEqual(clubDelBarrio)
  })
})
