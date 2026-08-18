import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../game/state/initialState'
import type { PoliticalParty } from '../../party/types'
import { isLifecycleEligible } from '../eventLifecycle'
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

function freshState() {
  return createInitialGameState(testParty)
}

const oneShotEvent: Event = { id: 'once', title: '', description: '', choices: [] }
const explicitOneShotEvent: Event = {
  id: 'once_explicit',
  title: '',
  description: '',
  lifecycle: { type: 'oneShot' },
  choices: [],
}
const repeatableEvent: Event = {
  id: 'repeat',
  title: '',
  description: '',
  lifecycle: { type: 'repeatable' },
  choices: [],
}
const cooldownEvent: Event = {
  id: 'cooldown',
  title: '',
  description: '',
  lifecycle: { type: 'cooldown', months: 4 },
  choices: [],
}
const milestoneEvent: Event = {
  id: 'milestone',
  title: '',
  description: '',
  lifecycle: { type: 'milestone' },
  choices: [],
}

describe('isLifecycleEligible', () => {
  it('a oneShot event is eligible before it has ever happened', () => {
    expect(isLifecycleEligible(oneShotEvent, freshState())).toBe(true)
  })

  it('a oneShot event (implicit default) never reappears once resolved', () => {
    const state = {
      ...freshState(),
      history: [{ decisionId: 'once:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    expect(isLifecycleEligible(oneShotEvent, state)).toBe(false)
  })

  it('an explicit oneShot event never reappears once resolved', () => {
    const state = {
      ...freshState(),
      history: [{ decisionId: 'once_explicit:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    expect(isLifecycleEligible(explicitOneShotEvent, state)).toBe(false)
  })

  it('a repeatable event can reappear after already being resolved', () => {
    const state = {
      ...freshState(),
      history: [
        { decisionId: 'repeat:ok', gameDate: { years: 18, months: 0 }, effects: {} },
        { decisionId: 'repeat:ok', gameDate: { years: 18, months: 3 }, effects: {} },
      ],
    }

    expect(isLifecycleEligible(repeatableEvent, state)).toBe(true)
  })

  it('a cooldown event blocks reappearance until enough time has elapsed', () => {
    const justHappened = {
      ...freshState(),
      date: { years: 18, months: 2 },
      history: [{ decisionId: 'cooldown:ok', gameDate: { years: 18, months: 2 }, effects: {} }],
    }
    expect(isLifecycleEligible(cooldownEvent, justHappened)).toBe(false)

    const notEnoughTime = { ...justHappened, date: { years: 18, months: 5 } } // 3 months elapsed, needs 4
    expect(isLifecycleEligible(cooldownEvent, notEnoughTime)).toBe(false)

    const cooldownElapsed = { ...justHappened, date: { years: 18, months: 6 } } // 4 months elapsed
    expect(isLifecycleEligible(cooldownEvent, cooldownElapsed)).toBe(true)
  })

  it('a cooldown event is eligible the first time, before it has ever happened', () => {
    expect(isLifecycleEligible(cooldownEvent, freshState())).toBe(true)
  })

  it('a milestone event respects its own lifecycle: never again once resolved', () => {
    expect(isLifecycleEligible(milestoneEvent, freshState())).toBe(true)

    const resolved = {
      ...freshState(),
      history: [{ decisionId: 'milestone:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }
    expect(isLifecycleEligible(milestoneEvent, resolved)).toBe(false)
  })
})
