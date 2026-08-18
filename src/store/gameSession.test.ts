import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'
import { chooseAtom, continueAtom, gameSessionAtom, startGameAtom } from './gameSession'

describe('gameSession store', () => {
  it('starting a game creates a valid GameState and an initial event', () => {
    const store = createStore()
    store.set(startGameAtom)

    const session = store.get(gameSessionAtom)
    expect(session.phase).toBe('playing')
    if (session.phase !== 'playing') throw new Error('unreachable')
    expect(session.state.age).toBe(18)
    expect(session.state.role).toBe('puntero')
    expect(session.event).not.toBeNull()
  })

  it('choosing applies the decision and shows real consequences before continuing', () => {
    const store = createStore()
    store.set(startGameAtom)
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
    store.set(startGameAtom)
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
    store.set(startGameAtom)
    const playing = store.get(gameSessionAtom)
    if (playing.phase !== 'playing') throw new Error('unreachable')

    store.set(chooseAtom, playing.event.choices[0])
    const afterFirstChoice = store.get(gameSessionAtom)

    store.set(chooseAtom, playing.event.choices[1]) // ignored: no longer in 'playing' phase
    expect(store.get(gameSessionAtom)).toEqual(afterFirstChoice)
  })

  it('playing again creates an independent GameState', () => {
    const store = createStore()
    store.set(startGameAtom)
    const first = store.get(gameSessionAtom)
    if (first.phase !== 'playing') throw new Error('unreachable')

    store.set(chooseAtom, first.event.choices[0])
    store.set(startGameAtom) // "jugar de nuevo"

    const second = store.get(gameSessionAtom)
    expect(second.phase).toBe('playing')
    if (second.phase !== 'playing') throw new Error('unreachable')
    expect(second.state.history).toEqual([])
    expect(second.state).not.toBe(first.state)
  })
})
