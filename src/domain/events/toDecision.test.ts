import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../game/state/initialState'
import { applyDecision } from '../game/engine/applyDecision'
import { choiceToDecision } from './toDecision'
import type { Event } from './types'

const event: Event = {
  id: 'club_del_barrio',
  title: 'El club del barrio',
  description: '',
  choices: [
    { id: 'help_club', text: 'Ayudar', addFlags: ['helped_local_club'], effects: { popularity: 5 } },
  ],
}

describe('choiceToDecision', () => {
  it('produces a Decision from an event choice', () => {
    const decision = choiceToDecision(event, event.choices[0])

    expect(decision).toEqual({
      id: 'club_del_barrio:help_club',
      addFlags: ['helped_local_club'],
      effects: { popularity: 5 },
    })
  })

  it('the resulting Decision is compatible with applyDecision', () => {
    const state = createInitialGameState()
    const decision = choiceToDecision(event, event.choices[0])
    const newState = applyDecision(state, decision)

    expect(newState.flags).toContain('helped_local_club')
    expect(newState.popularity).toBe(state.popularity + 5)
    expect(newState.history[0].decisionId).toBe('club_del_barrio:help_club')
  })
})
