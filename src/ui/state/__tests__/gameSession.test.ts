import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'
import { chooseAtom, continueAtom, gameSessionAtom, goToPartySelectionAtom, selectPartyAtom } from '../gameSession'

function startGameWithParty(store: ReturnType<typeof createStore>, partyId: 'popular' | 'liberal' | 'progresista') {
  store.set(goToPartySelectionAtom)
  store.set(selectPartyAtom, partyId)
}

describe('gameSession store', () => {
  it('going to party selection creates no GameState yet', () => {
    const store = createStore()
    store.set(goToPartySelectionAtom)

    expect(store.get(gameSessionAtom)).toEqual({ phase: 'selecting_party' })
  })

  it('selecting a party creates a valid GameState and an initial event', () => {
    const store = createStore()
    startGameWithParty(store, 'popular')

    const session = store.get(gameSessionAtom)
    expect(session.phase).toBe('playing')
    if (session.phase !== 'playing') throw new Error('unreachable')
    expect(session.state.age).toBe(18)
    expect(session.state.role).toBe('militante')
    expect(session.state.party).toBe('popular')
    expect(session.event).not.toBeNull()
  })

  it('a party cannot be selected twice in a row', () => {
    const store = createStore()
    startGameWithParty(store, 'popular')
    const afterFirstSelection = store.get(gameSessionAtom)

    store.set(selectPartyAtom, 'liberal') // ignored: no longer in 'selecting_party' phase
    expect(store.get(gameSessionAtom)).toEqual(afterFirstSelection)
  })

  it('different parties start with different stats and can see different eligible events', () => {
    const popularStore = createStore()
    startGameWithParty(popularStore, 'popular')
    const popularSession = popularStore.get(gameSessionAtom)

    const liberalStore = createStore()
    startGameWithParty(liberalStore, 'liberal')
    const liberalSession = liberalStore.get(gameSessionAtom)

    if (popularSession.phase !== 'playing' || liberalSession.phase !== 'playing') {
      throw new Error('unreachable')
    }
    expect(popularSession.state.money).not.toBe(liberalSession.state.money)
    expect(popularSession.state.ideology).not.toEqual(liberalSession.state.ideology)
  })

  it('choosing applies the decision and shows real consequences before continuing', () => {
    const store = createStore()
    startGameWithParty(store, 'popular')
    const before = store.get(gameSessionAtom)
    if (before.phase !== 'playing') throw new Error('unreachable')

    const choice = before.event.choices[0]
    store.set(chooseAtom, choice)

    const session = store.get(gameSessionAtom)
    expect(session.phase).toBe('resolved')
    if (session.phase !== 'resolved') throw new Error('unreachable')
    expect(session.previousState).toEqual(before.state)
    expect(session.choice).toEqual(choice)

    for (const [stat, delta] of Object.entries(choice.effects ?? {})) {
      const key = stat as keyof typeof session.state
      expect((session.state[key] as number) - (session.previousState[key] as number)).toBe(delta)
    }
  })

  it('continuing recomputes the next eligible event', () => {
    const store = createStore()
    startGameWithParty(store, 'popular')
    const playing = store.get(gameSessionAtom)
    if (playing.phase !== 'playing') throw new Error('unreachable')

    store.set(chooseAtom, playing.event.choices[0])
    store.set(continueAtom)

    const session = store.get(gameSessionAtom)
    expect(['playing', 'gameover']).toContain(session.phase)
    if (session.phase === 'playing') {
      expect(session.event.id).not.toBe(playing.event.id)
    }
  })

  it('a choice cannot be applied twice in a row', () => {
    const store = createStore()
    startGameWithParty(store, 'popular')
    const playing = store.get(gameSessionAtom)
    if (playing.phase !== 'playing') throw new Error('unreachable')

    store.set(chooseAtom, playing.event.choices[0])
    const afterFirstChoice = store.get(gameSessionAtom)

    store.set(chooseAtom, playing.event.choices[1]) // ignored: no longer in 'playing' phase
    expect(store.get(gameSessionAtom)).toEqual(afterFirstChoice)
  })

  it('playing again creates an independent GameState', () => {
    const store = createStore()
    startGameWithParty(store, 'popular')
    const first = store.get(gameSessionAtom)
    if (first.phase !== 'playing') throw new Error('unreachable')

    store.set(chooseAtom, first.event.choices[0])
    startGameWithParty(store, 'popular') // "jugar de nuevo"

    const second = store.get(gameSessionAtom)
    expect(second.phase).toBe('playing')
    if (second.phase !== 'playing') throw new Error('unreachable')
    expect(second.state.history).toEqual([])
    expect(second.state).not.toBe(first.state)
  })
})
