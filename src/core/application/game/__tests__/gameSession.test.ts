import { describe, expect, it } from 'vitest'
import { makeDecision } from '../makeDecision'
import { startGame } from '../startGame'

describe('application: game session', () => {
  it('starts a new game with a valid initial state', () => {
    const state = startGame('popular')

    expect(state.age).toBe(18)
    expect(state.role).toBe('militante')
  })

  it('orchestrates a decision against the current GameState via the domain engine', () => {
    const state = startGame('popular')
    const newState = makeDecision(state, { id: 'accept_bribe', effects: { money: 20, corruption: 10 } })

    expect(newState.money).toBe(state.money + 20)
    expect(newState.corruption).toBe(state.corruption + 10)
    expect(newState.history).toHaveLength(1)
    expect(state.history).toHaveLength(0)
  })
})
