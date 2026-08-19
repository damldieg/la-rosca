import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../../domain/game/state/initialState'
import type { PoliticalParty } from '../../../domain/party/types'
import { SeededRandomSource } from '../../../domain/random/randomSource'
import type { Event } from '../../../domain/events/types'
import {
  careerFocusedDecisionPolicies,
  corruptDecisionPolicy,
  createCareerFocusedPolicy,
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

describe('careerFocusedDecisionPolicy (Fase 9 §13, simulation-only)', () => {
  const pivotEvent: Event = {
    id: 'pivot_event',
    title: '',
    description: '',
    choices: [
      { id: 'go_tecnica', text: '', careerPath: 'tecnica', effects: { power: 1 } },
      { id: 'go_empresarial', text: '', careerPath: 'empresarial', effects: { power: 50 } },
      { id: 'stay', text: '', effects: { popularity: 10 } },
    ],
  }

  it('always picks the choice that sets careerPath to the target, even when another choice scores higher on raw effects', () => {
    const policy = createCareerFocusedPolicy('tecnica')
    const choice = policy(pivotEvent, freshState(), new SeededRandomSource(1))
    expect(choice.id).toBe('go_tecnica')
  })

  it('never picks a choice that pivots to a different careerPath than the target', () => {
    const policy = createCareerFocusedPolicy('tecnica')
    for (let seed = 1; seed <= 20; seed++) {
      const choice = policy(pivotEvent, freshState(), new SeededRandomSource(seed))
      expect(choice.id).not.toBe('go_empresarial')
    }
  })

  it('falls back to the mild effects-based preference among choices that do not touch careerPath', () => {
    const noPivotEvent: Event = {
      id: 'no_pivot',
      title: '',
      description: '',
      choices: [
        { id: 'low', text: '', effects: { power: 1 } },
        { id: 'high', text: '', effects: { power: 10, popularity: 10 } },
      ],
    }
    const policy = createCareerFocusedPolicy('tecnica')
    const choice = policy(noPivotEvent, freshState(), new SeededRandomSource(1))
    expect(choice.id).toBe('high')
  })

  it('ships one ready-made policy per careerPath', () => {
    expect(Object.keys(careerFocusedDecisionPolicies).sort()).toEqual(
      ['empresarial', 'institucional', 'mediatica', 'sindical', 'tecnica', 'territorial'].sort(),
    )
  })
})
