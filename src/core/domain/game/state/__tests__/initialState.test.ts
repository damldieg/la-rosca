import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '../initialState'

describe('createInitialGameState', () => {
  it('returns a valid initial state', () => {
    const state = createInitialGameState()

    expect(state.age).toBe(18)
    expect(state.date).toEqual({ years: 18, months: 0 })
    expect(state.role).toBe('puntero')
    expect(state.flags).toEqual([])
    expect(state.relationships).toEqual({})
    expect(state.history).toEqual([])
  })
})
