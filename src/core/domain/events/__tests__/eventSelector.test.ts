import { describe, expect, it } from 'vitest'
import { selectEvent } from '../eventSelector'
import type { Event } from '../types'

const eventA: Event = { id: 'a', title: 'A', description: '', choices: [] }
const eventB: Event = { id: 'b', title: 'B', description: '', choices: [] }

describe('selectEvent', () => {
  it('selects a valid event from the eligible list', () => {
    const selected = selectEvent([eventA, eventB])

    expect(selected).toEqual(eventA)
  })

  it('returns null when there are no eligible events', () => {
    expect(selectEvent([])).toBeNull()
  })

  it('is deterministic for the same input', () => {
    expect(selectEvent([eventA, eventB])).toEqual(selectEvent([eventA, eventB]))
  })
})
