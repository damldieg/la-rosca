import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../game/state/initialState'
import { applyDecision } from '../../game/engine/applyDecision'
import type { PoliticalParty } from '../../party/types'
import { choiceToDecision } from '../toDecision'
import type { Event } from '../types'

const testParty: PoliticalParty = {
  id: 'popular',
  name: 'Test Party',
  description: '',
  ideology: { economic: 0, social: 0, institutional: 0 },
  startingStats: {},
  preferredStats: [],
  availableRoles: ['puntero'],
  preferredEventTags: [],
}

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
    const state = createInitialGameState(testParty)
    const decision = choiceToDecision(event, event.choices[0])
    const newState = applyDecision(state, decision)

    expect(newState.flags).toContain('helped_local_club')
    expect(newState.popularity).toBe(state.popularity + 5)
    expect(newState.history[0].decisionId).toBe('club_del_barrio:help_club')
  })

  it('does not leak a per-choice conditions field into the resulting Decision (Fase 8)', () => {
    const pathSplitEvent: Event = {
      id: 'path_split_event',
      title: 'Path split event',
      description: '',
      choices: [
        {
          id: 'territorial_choice',
          text: 't',
          conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' },
          effects: { power: 1 },
        },
      ],
    }

    const decision = choiceToDecision(pathSplitEvent, pathSplitEvent.choices[0])

    expect(decision).toEqual({ id: 'path_split_event:territorial_choice', effects: { power: 1 } })
    expect(decision).not.toHaveProperty('conditions')
  })
})
