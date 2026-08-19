import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../../game/state/initialState'
import type { PoliticalParty } from '../../party/types'
import { getEligibleEvents, withEligibleChoices } from '../eventPool'
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

/** role: 'puntero', not the real 'militante' starting role — these fixtures test generic eligibility mechanics, not the early career itself (see careerPaths.test.ts for that). */
function freshState() {
  return { ...createInitialGameState(testParty), role: 'puntero' as const }
}

const punteroEvent: Event = {
  id: 'puntero_event',
  title: 'Puntero event',
  description: '',
  conditions: { type: 'role', operator: 'equals', value: 'puntero' },
  choices: [{ id: 'ok', text: 'ok' }],
}

const concejalEvent: Event = {
  id: 'concejal_event',
  title: 'Concejal event',
  description: '',
  conditions: { type: 'role', operator: 'equals', value: 'concejal' },
  choices: [{ id: 'ok', text: 'ok' }],
}

const unconditionalEvent: Event = {
  id: 'unconditional_event',
  title: 'Unconditional event',
  description: '',
  choices: [{ id: 'ok', text: 'ok' }],
}

const liberalOnlyEvent: Event = {
  id: 'liberal_only_event',
  title: 'Liberal-only event',
  description: '',
  conditions: { type: 'party', operator: 'equals', value: 'liberal' },
  choices: [{ id: 'ok', text: 'ok' }],
}

const highPowerEvent: Event = {
  id: 'high_power_event',
  title: 'High power event',
  description: '',
  conditions: { type: 'stat', stat: 'power', operator: 'gte', value: 50 },
  choices: [{ id: 'ok', text: 'ok' }],
}

const trustedByEmpresarioEvent: Event = {
  id: 'trusted_by_empresario_event',
  title: 'Trusted by empresario event',
  description: '',
  conditions: { type: 'relationship', target: 'empresario', operator: 'gte', value: 50 },
  choices: [{ id: 'ok', text: 'ok' }],
}

const adultEvent: Event = {
  id: 'adult_event',
  title: 'Adult event',
  description: '',
  conditions: { type: 'age', operator: 'gte', value: 30 },
  choices: [{ id: 'ok', text: 'ok' }],
}

describe('getEligibleEvents', () => {
  it('filters out events whose conditions are not met', () => {
    const state = freshState()
    const eligible = getEligibleEvents([punteroEvent, concejalEvent], state)

    expect(eligible).toEqual([punteroEvent])
  })

  it('returns all compatible events', () => {
    const state = freshState()
    const eligible = getEligibleEvents([punteroEvent, unconditionalEvent], state)

    expect(eligible).toEqual([punteroEvent, unconditionalEvent])
  })

  it('does not mutate the GameState', () => {
    const state = freshState()
    const snapshot = structuredClone(state)

    getEligibleEvents([punteroEvent, concejalEvent, unconditionalEvent], state)

    expect(state).toEqual(snapshot)
  })

  it('excludes an event already resolved in history, even if its conditions still hold', () => {
    const state = {
      ...freshState(),
      history: [{ decisionId: 'unconditional_event:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    const eligible = getEligibleEvents([punteroEvent, unconditionalEvent], state)

    expect(eligible).toEqual([punteroEvent])
  })

  it('returns an empty pool once every eligible event has been resolved', () => {
    const state = {
      ...freshState(),
      history: [{ decisionId: 'puntero_event:ok', gameDate: { years: 18, months: 0 }, effects: {} }],
    }

    expect(getEligibleEvents([punteroEvent], state)).toEqual([])
  })

  it('an event can depend on party', () => {
    const popularPlayer = freshState() // party: 'popular'
    const liberalPlayer = createInitialGameState({ ...testParty, id: 'liberal' })

    expect(getEligibleEvents([liberalOnlyEvent], popularPlayer)).toEqual([])
    expect(getEligibleEvents([liberalOnlyEvent], liberalPlayer)).toEqual([liberalOnlyEvent])
  })

  it('an event can depend on a stat threshold', () => {
    const lowPower = freshState() // power starts at 10
    const highPower = { ...freshState(), power: 60 }

    expect(getEligibleEvents([highPowerEvent], lowPower)).toEqual([])
    expect(getEligibleEvents([highPowerEvent], highPower)).toEqual([highPowerEvent])
  })

  it('a relationship can unlock an event', () => {
    const distrusted = freshState()
    const trusted = { ...freshState(), relationships: { empresario: 65 } }

    expect(getEligibleEvents([trustedByEmpresarioEvent], distrusted)).toEqual([])
    expect(getEligibleEvents([trustedByEmpresarioEvent], trusted)).toEqual([trustedByEmpresarioEvent])
  })

  it('an event can depend on age', () => {
    const young = freshState() // age starts at 18
    const older = { ...freshState(), age: 35 }

    expect(getEligibleEvents([adultEvent], young)).toEqual([])
    expect(getEligibleEvents([adultEvent], older)).toEqual([adultEvent])
  })

  describe('withEligibleChoices (Fase 8)', () => {
    const pathSplitEvent: Event = {
      id: 'path_split_event',
      title: 'Path split event',
      description: '',
      choices: [
        { id: 'territorial_choice', text: 't', conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' } },
        { id: 'tecnica_choice', text: 'x', conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' } },
        { id: 'fallback_choice', text: 'f' },
      ],
    }

    it('drops a choice whose conditions do not hold, keeping the unconditioned fallback', () => {
      const territorial = { ...freshState(), careerPath: 'territorial' as const }
      const filtered = withEligibleChoices(pathSplitEvent, territorial)

      expect(filtered.choices.map((c) => c.id)).toEqual(['territorial_choice', 'fallback_choice'])
    })

    it('keeps a choice whose conditions hold', () => {
      const tecnica = { ...freshState(), careerPath: 'tecnica' as const }
      const filtered = withEligibleChoices(pathSplitEvent, tecnica)

      expect(filtered.choices.map((c) => c.id)).toEqual(['tecnica_choice', 'fallback_choice'])
    })

    it('returns the original event unchanged when nothing was filtered out', () => {
      const unconditioned = punteroEvent // single choice, no per-choice conditions
      const state = freshState()

      expect(withEligibleChoices(unconditioned, state)).toBe(unconditioned)
    })

    it('falls back to keeping every choice if filtering would otherwise leave none — never an empty choice list', () => {
      const allConditioned: Event = {
        id: 'all_conditioned_event',
        title: 'All conditioned event',
        description: '',
        choices: [
          { id: 'a', text: 'a', conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' } },
          { id: 'b', text: 'b', conditions: { type: 'careerPath', operator: 'equals', value: 'tecnica' } },
        ],
      }
      const noPathYet = freshState() // careerPath undefined — matches neither choice

      const filtered = withEligibleChoices(allConditioned, noPathYet)
      expect(filtered.choices).toHaveLength(2)
    })

    it('getEligibleEvents applies choice filtering to every eligible event it returns', () => {
      const territorial = { ...freshState(), careerPath: 'territorial' as const }
      const [eligible] = getEligibleEvents([pathSplitEvent], territorial)

      expect(eligible.choices.map((c) => c.id)).toEqual(['territorial_choice', 'fallback_choice'])
    })
  })
})
