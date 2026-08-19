import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../../domain/game/state/initialState'
import type { PoliticalParty } from '../../../domain/party/types'
import { SeededRandomSource } from '../../../domain/random/randomSource'
import type { Event } from '../../../domain/events/types'
import {
  corruptDecisionPolicy,
  institutionalDecisionPolicy,
  popularDecisionPolicy,
  randomDecisionPolicy,
} from '../decisionPolicy'

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

function freshState() {
  return createInitialGameState(testParty)
}

const event: Event = {
  id: 'choice_event',
  title: '',
  description: '',
  choices: [
    { id: 'money', text: '', effects: { money: 1_000_000, power: 5 } },
    { id: 'popularity', text: '', effects: { popularity: 20, structure: 10 } },
    { id: 'institutional', text: '', ideology: { institutional: 10 }, relationships: { jefePartidario: 15 } },
  ],
}

describe('randomDecisionPolicy', () => {
  it('always returns one of the event choices', () => {
    const random = new SeededRandomSource(1)
    for (let i = 0; i < 50; i++) {
      const choice = randomDecisionPolicy(event, freshState(), random)
      expect(event.choices).toContain(choice)
    }
  })

  it('is reproducible for the same seed', () => {
    const pick = () => randomDecisionPolicy(event, freshState(), new SeededRandomSource(7))
    expect(pick()).toEqual(pick())
  })
})

describe('corruptDecisionPolicy', () => {
  it('prefers the choice with the biggest money/power/corruption payoff', () => {
    const choice = corruptDecisionPolicy(event, freshState(), new SeededRandomSource(1))
    expect(choice.id).toBe('money')
  })
})

describe('popularDecisionPolicy', () => {
  it('prefers the choice with the biggest popularity/structure payoff', () => {
    const choice = popularDecisionPolicy(event, freshState(), new SeededRandomSource(1))
    expect(choice.id).toBe('popularity')
  })
})

describe('institutionalDecisionPolicy', () => {
  it('prefers the choice with the biggest institutional/relationship payoff', () => {
    const choice = institutionalDecisionPolicy(event, freshState(), new SeededRandomSource(1))
    expect(choice.id).toBe('institutional')
  })
})
